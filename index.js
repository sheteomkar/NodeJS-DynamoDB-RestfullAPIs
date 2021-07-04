const express = require('express');
const aws = require('./aws/awsConfig');

const app = express();
app.use(express.json());

const table = "login";

app.get('/login', function (req, res, next) {

    let aws_method = "get";
    let params = {
        TableName: table,
    };

    if (Object.keys(req.body).length > 0) {

        params.Key = {
            "email_id": req.body.email_id,
        }
        aws.get(params, function (err, data) {
            if (err) {
                res.send({ 'error': 'error' });
            }
            res.send(data);
        });
    } else {

        aws.scan(params, function (err, data) {
            if (err) {
                res.send({ 'error': 'error' });
            }
            res.send(data);
        });
    }

});

app.put('/login', function (req, res, next) {

    let params = {
        TableName: table,
        Item: req.body
    };

    aws.put(params, function (err, data) {
        if (err) {
            res.send({ 'error': 'error' });
        }
        res.send("saved");
    });
});


app.patch('/login', function (req, res, next) {

    let params = {
        TableName: table,
        Key: { "email_id": req.body.email_id },
        UpdateExpression: "set password = :byUser, isActive = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": req.body.password,
            ":boolValue": req.body.isActive
        },
        ReturnValues: "UPDATED_NEW"

    };

    aws.update(params, function (err, data) {
        if (err) {
            res.send({ 'error': 'error' });
        }
        res.send("saved");
    });
});


app.delete('/login', function (req, res, next) {

    let params = {
        TableName: table,
        Key: { "email_id": req.body.email_id },
    };

    aws.delete(params, function (err, data) {
        if (err) {
            res.send({ 'error': 'error' });
        }
        res.send("deleted");
    });
});








app.listen(3000);