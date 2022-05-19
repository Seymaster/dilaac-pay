"use strict";

const Link = require("./Link");
const Repository = require("./MongodbRespository");

class LinkRepository extends Repository{
    constructor(){
        super(Link)
    }

    nonMetaFields(){
        return ["userId","LinkId","reference","amount"]
    }
}

module.exports = (new LinkRepository());