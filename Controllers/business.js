const BusinessRepository = require("../Models/BusinessRepository")
const ProjectRepository = require("../Models/ProjectRepository")
const { createProduct } = require("../Services/product");
const uuid = require("uuid");
const randomString = require("randomstring")


/**
 * Create Business and CRUD details
 * @param req
 * @param res
 * @param next
 * @return {Promise<*>}
 */



exports.createBusiness = async (req,res,next)=>{
    let {userId,businessName,projectName,mobileNumber,countryCode,emailAddress} = req.body;
    let productName = "ussd-"+ projectName
    let product = await createProduct(productName, userId);
    product = JSON.parse(product);
    let productId = product.data.id
    let businessId = uuid.v4()
    let newBusiness = { userId,businessId,businessName,projectName,mobileNumber,countryCode,emailAddress}
    let newProject = {userId,productId,projectName,mobileNumber,countryCode,emailAddress}
    try{
        await ProjectRepository.create(newProject)
        let Business = await BusinessRepository.create(newBusiness)
        return res.status(200).send({
            status:200,
            message: "Business Registered successfully",
            data: Business
        });
    }catch(err){
        if(err.code == 11000){
            let error = err['errmsg'].split(':')[2].split(' ')[1].split('_')[0];
            res.status(500).send({
                message: `${error} already exist`,
                status: 500,
                error: error
            });
        }else{
            console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
                })
            }
        };
}



exports.getBusiness = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Business = await BusinessRepository.all(query, {_id: -1}, page, limit)
        if(Business.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Business found for id ${query}`,
                data: Business
            })
        }
        else{
            message = "Business loaded successfully"
            return createSuccessResponse(res, Business ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};

exports.createProject = async (req,res,next)=>{
    let {userId,projectName,mobileNumber,countryCode,emailAddress} = req.body;
    let productName = "ussd-"+ projectName
    let product = await createProduct(productName, userId);
    product = JSON.parse(product);
    let productId = product.data.id
    let newProject = {userId,productId,projectName,mobileNumber,countryCode,emailAddress}
    try{
        let Project = await ProjectRepository.create(newProject)
        return res.status(200).send({
            status:200,
            message: "Project Registered successfully",
            data: Project
        });
    }catch(err){
        console.log("here2")
        if(err.code == 11000){
            let error = err['errmsg'].split(':')[2].split(' ')[1].split('_')[0];
            res.status(500).send({
                message: `${error} already exist`,
                status: 500,
                error: error
            });
        }else{
            // console.log(err)
            return res.status(400).send({
            status:400,
            message: "Bad Request",
            error: err
                })
            }
        };
}


exports.getProject = async (req,res,next)=>{
    let {...query} = req.query;
    console.log(query)
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Project = await ProjectRepository.all(query, {_id: -1}, page, limit)
        console.log(Project)
        if(Project.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Project found for id ${query}`,
                data: Project
            })
        }
        else{
            message = "Project loaded successfully"
            return createSuccessResponse(res, Project, message)
        }
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};
