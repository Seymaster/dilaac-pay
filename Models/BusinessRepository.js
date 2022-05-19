"use strict";

const Business = require("./Business");
const Repository = require("./MongodbRespository");

class BusinessRepository extends Repository{
    constructor(){
        super(Business)
    }

    nonMetaFields(){
        return ["userId","businessId","businessName","projectName","mobileNumber","countryCode","emailAddress","currentBalance"]
    }
}

module.exports = (new BusinessRepository());