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
const businessController = require("../Controllers/business")
const schema = require("../Middleware/schema");
const { validate } = require("../Middleware/helper");


router.post("/business/create", validate(schema.businessSchema.businessPost, 'body'), businessController.createBusiness);

router.get("/business", businessController.getBusiness)

router.post("/project/create" ,validate(schema.projectSchema.projectPost, 'body'),businessController.createProject);

router.get("/project", businessController.getProject)

router.post("/payment-link/create", businessController.createPaymentLink)

router.get("/payment-link", businessController.getLink)




module.exports = router;