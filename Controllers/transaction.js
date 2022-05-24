const TransactionRepository = require("../Models/TransactionRepository");
const ProjectRepository = require("../Models/ProjectRepository");
const CustomerRepository = require("../Models/CustomerRepository")
const randomString = require("randomstring");
const { createInvoice } = require("../Services/invoice");
const { createUser, createNewUser } = require("../Services/user");


exports.initiatePayment = async (req,res,next)=>{
    let {projectId, phoneNumber, amount } = req.body;
    amount = amount *100
    let reference = randomString.generate(20);
    let Project = await ProjectRepository.findOne({_id:projectId})
    if(!Project){
            return res.status(403).send({
                status:403,
                message: "No Project Found"
            })
        }
    projectId = Project.id
    let customer = await CustomerRepository.findOne({phoneNumber: phoneNumber})
        if(!customer){
            try{
                let customerId = await createNewUser(phoneNumber)
                let newCustomer = {userId: customerId, phoneNumber}
                await CustomerRepository.create(newCustomer)
                let productId = Project.productId
                let invoice = await createInvoice(productId,customerId, amount)
                invoice = JSON.parse(invoice)
                let invoiceId = invoice.data.id
                let newTransaction = {reference,customerId,phoneNumber,projectId,amount,invoiceId}
                await TransactionRepository.create(newTransaction);
                console.log("here 2")
                return res.status(200).send({
                    data: reference
                })
            }catch (error) {
                console.log(error)
                return res.status(400).send({
                    message: "Bad Request"
                })
            }
    }else{
        let customerId = customer.userId
        try {
            let productId = Project.productId
            let invoice = await createInvoice(productId,customerId, amount)
            invoice = JSON.parse(invoice)
            let invoiceId = invoice.data.id
            let newTransaction = {reference, customerId, phoneNumber, projectId, amount, invoiceId}
            await TransactionRepository.create(newTransaction);
            return res.status(200).send({
                data: reference
            })
        }catch(error) {
            console.log(error)
            return res.status(400).send({
                message: "Bad Request"
            })
        }
    }
}


// To get all transaction for a Particular Project/customer with Id
exports.getTransaction = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let Transaction = await TransactionRepository.all(query, {_id: -1}, page, limit)
        if(Transaction.docs.length === 0){
            return res.status(400).send({
                status: 404,
                message: `No Transaction found for id ${query}`,
                data: Transaction
            })
        }
        else{
            message = "Transaction loaded successfully"
            return createSuccessResponse(res, Transaction ,message)
        }
    }catch(err){
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};

// To get all Customer for a Particular Project
exports.getCustomers = async (req,res,next)=>{
    let {...query} = req.query;
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let customer = await CustomerRepository.all(query, {_id: -1}, page, limit)
        if(customer.docs.length === 0){
            return res.status(404).send({
                status: 404,
                message: `No Customer found`,
                data: customer
            })
        }
        else{
            message = "Customer loaded successfully"
            return createSuccessResponse(res, customer ,message)
        }
    }catch(err){
        console.log(err)
        return res.status(400).send({
            status: 400,
            message: "Bad Request",
            error: err
        })
    }
};

// Get all Project Customer 
exports.getProjectCustomer = async (req, res, next)=>{
    let {...query} = req.params
    let {page,limit } = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
        let allTransation = await TransactionRepository.all(query, {_id: -1}, page, limit)
        let userIds = []
        allTransation.map(data =>{
            userIds.push(
            data.customerId)
        })
        let dob = await CustomerRepository.all({
            $or: [{userId: {$in: userIds}}]
        }, {_id: -1}, page, limit) 
        message = `Customers for Project loaded successfully`
        return createSuccessResponse(res, dob ,message)
    }catch(error){
        console.log(error)
        return res.status(400).send({
            status:400,
            message: "Error",
            error: error   
        });
    }
}




exports.fetchReport = async (req,res,next) =>{
    let {page ,limit, ...query} = req.query;
    page = page || 1;
    limit = limit || 100;
    try{
    
        let revenue = await TransactionRepository.aggregate(query, {status: "SUCCESS"})
        let transaction = await TransactionRepository.all(query, {_id: -1}, page, limit)
        let ProjectId = query.ProjectId
        let transactionGraph = await TransactionRepository.aggregateReportDate( {ProjectId: ProjectId, status: "PENDING",createdAt:{
            $lt: new Date(moment().toISOString()),
            $gte: new Date(moment().subtract(7, "days").startOf("day").toISOString())
        }})
        console.log(transactionGraph)
        let revenueGraph = await TransactionRepository.aggregateRevenue({ProjectId: ProjectId, status: "SUCCESS", createdAt:{
            $lt: new Date(moment().toISOString()),
            $gte: new Date(moment().subtract(7, "days").startOf("day").toISOString())
        }})
        // transactionCount = []
        // transactionGraph.map(data =>{
        //     transactionCount.push(
        //     ({date: data._id, count: data.count}))
        // })
        let customers = []
        transaction.docs.map(data =>{
            customers.push(
            data.customerId)
        })
        customers = await CustomerRepository.all({
            $or: [{userId: {$in: customers}}]
        }, {_id: -1}, page, limit) 

        let data = {
            totalRevenue: revenue[0].total,
            totalTransactions: transaction.total,
            totalCustomers: customers.total,
            transactionGraph,
            revenueGraph
        }
        return res.status(200).send({
            status:200,
            message: "Reports Loaded Successfully",
            data: data
        })
    }catch(error){
        console.log(error)
        return res.status(400).send({
            status: 400,
            message: "No Report for this Account",
            error: error
        })
    }
}
