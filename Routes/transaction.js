'use strict'
/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
|
*/

const express = require("express");
const router  = express.Router();
const transactionController = require("../Controllers/transaction")
const schema = require("../Middleware/schema");
const { validate } = require("../Middleware/helper");


router.post("/pay/initiate",transactionController.initiatePayment, validate(schema.transactionSchema.transactionPost, 'body'), );

router.get("/transaction", transactionController.getTransaction)

router.get("/transaction/detail/:reference", transactionController.getTransactionByReference)

// router.get("/customer" ,validate(schema.projectSchema.projectPost, 'body'),transactionController.createProject);






module.exports = router;