"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    businessId: {type: String, require: true, unique: true},
    businessName: {type: String, require: true, unique: true},
    projectName: {type: String, require: true, unique: true},
    mobileNumber: {type: String, require: true},
    countryCode: {type: String, require: true},
    emailAddress: {type: String, require: true},
    currentBalance: {type: String, require: false, default: "0000"},
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
const Business =  mongoose.model("Business", Schema)


module.exports = Business;