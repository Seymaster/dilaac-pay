"use strict"

const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate");

const Schema    = mongoose.Schema({
    userId: {type: String, require: true},
    projectId: {type: String, require: true},
    reference: {type: String, require: true, unique: true},
    description: {type: String, require: false},
    amount: {type: String, require: false},
    meta: {type: Object},
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
const Link =  mongoose.model("Link", Schema)


module.exports = Link;