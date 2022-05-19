const Joi = require("joi");

// const pattern = /^[a-zA-Z0-9]*$/
const businessSchema = {
    businessPost: Joi.object().keys({
        userId: Joi.string().required(),
        businessName: Joi.string().required(),
        projectName: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        countryCode: Joi.string().required(),
        emailAddress: Joi.string().required()
    }).options({ allowUnknown: true })
}

const projectSchema = {
    projectPost: Joi.object().keys({
        userId: Joi.string().required(),
        projectName: Joi.string().required(),
        mobileNumber: Joi.string().required(),
        countryCode: Joi.string().required(),
        emailAddress: Joi.string().required()
    }).options({ allowUnknown: true })
}



module.exports = { businessSchema, projectSchema }