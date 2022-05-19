'use strict';

const Joi = require("joi");


exports.validate = (schema, property) =>{
    return (req, res, next) =>{
        const data = schema.validate(req[property]);
        if (!data.error){
            next();
        }
        else {
            const { error } = data;
            const message = error.details[0].message;
            res.status(422).json({
                status: 422,
                message: message.replace(/['"]/g,'')});
        }
    }
};

global.createSuccessResponse = (res, data, message, code= 200, isPaginated = false) => {
    if (isPaginated || (data && data.docs)) {
        data.data = data.docs;
        delete data.docs;
        delete data.pages
        delete data.limit
        data.status = code
        data.message = message;
        data.page = parseInt(data.page);
        return res.status(code).json(data);
    }
    return res.status(code).json({data});
};