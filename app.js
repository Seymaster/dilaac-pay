require("dotenv").config();
const express = require("express");
const app     = express();
const PORT    = process.env.PORT || 8080;
const logger  = require("morgan");
const cors    = require("cors");
const mongoose = require("mongoose")
const config   = require("./Config/mongo");
const BusinessRouter = require("./Routes/business")
const transactionRouter = require("./Routes/transaction")

mongoose.Promise = global.Promise;


app.listen(PORT, ()=> {
    console.log(`connected runing on ${PORT}`)
})


app.use(logger("dev")); //can't save
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/api/v1", BusinessRouter)
app.use("/api/v1", transactionRouter)

mongoose.set("debug", true)

mongoose.connect(config.dbUrl, {
    useNewUrlParser: true, useUnifiedTopology: true
})
.then(()=> {
    console.log("database connected");
})
.catch(err => {
    console.log(err);
})

app.use((req, res, next)=> {
    return res.status(404).send({
        status: 404,
        message: "This API endpoint doesnt exist"
    })
});