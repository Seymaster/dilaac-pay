"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    projectId: {type: String, require: true, unique: true},
    projectName: {type: String, require: true, unique: true},
    mobileNumber: {type: String, require: true},
    countryCode: {type: String, require: true},
    emailAddress: {type: String, require: true},
    currentBalance: {type: String, require: false, default: "0"},
    ledgerBalance: {type: String, require: false, default: "0"},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date}
}, 
{
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id
            delete ret._v;
            delete ret._id;
        }
    }
});

Schema.index({"$**":"text"});
Schema.plugin(mongoosePaginate);
const Project =  mongoose.model("Project", Schema)


module.exports = Project;