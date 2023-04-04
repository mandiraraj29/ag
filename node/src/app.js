const express = require('express');
const dbsetup = require("./model/dbsetup")
const tester = require("../parserModule/parser").reportGenerator
const app = express();

const bodyParser = require('body-parser');
const router = require('./routes/routing');
const myErrorLogger = require('./utilities/errorlogger');
const myRequestLogger = require('./utilities/requestlogger');

app.use(bodyParser.json());

app.use(myRequestLogger);
app.use('/', router);
app.use(myErrorLogger);


// Import necessary modules and configure the middleware in proper order
// Note :  Do not remove any code which is already given 





app.get('/setupDb', async(req, res, next) => {
    try {
        let data = await dbsetup.setupDb();
        res.send(data)
    } catch (err) {
        res.send("Error occurred during insertion of data")
    }
})

app.get('/test', async(req, res, next) => {
    try {
        let data = await tester();
        console.log("--- Verification Completed ---")
        res.send(data);
    } catch (err) {
        console.log(err.message);
    }
})

if (!module.parent) {
    app.listen(1050);
}
console.log("Server listening in port 1050");


module.exports = app;