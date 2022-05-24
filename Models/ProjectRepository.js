"use strict";

const Project = require("./Project");
const Repository = require("./MongodbRespository");

class ProjectRepository extends Repository{
    constructor(){
        super(Project)
    }

    nonMetaFields(){
        return ["userId","ProductId","ProjectName","mobileNumber","countryCode","emailAddress","currentBalance","ledgerBalance"]
    }
}

module.exports = (new ProjectRepository());