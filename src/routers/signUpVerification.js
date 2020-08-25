const Nexmo = require('nexmo');
const express = require('express')
const router = new express.Router()

const nexmo = new Nexmo({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});

router.post('/v1/requestPin', (req, res) => {

    let phoneNumber = req.body.number;

    console.log(phoneNumber);

    nexmo.verify.request({ 
        number: phoneNumber, 
        brand: 'Swipe',
        code_length: '6',
        workflow_id: '4',
        next_event_wait: '120',
        pin_expiry: '300'
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result);

            if (result && result.status == '0') {
                res.status(200).send(result);
            } else {
                res.status(400).send(result);
            }
        }
    });
});

router.post('/v1/verifyPin', (req, res) => {

    let code = req.body.code;
    let requestId = req.body.request_id;

    console.log("Code: " + code + " Request ID: " + requestId);

    nexmo.verify.check({ request_id: requestId, code: code }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(result)

            if (result && result.status == '0') {
                res.status(200).send(result);
                console.log('Account verified!')
            } else {
                res.status(400).send(result);
                console.log('Error verifying account')
            }
        }
    });
});

router.post('/v1/cancelPin', (req, res) => {

    let requestId = req.body.request_id;

    console.log("Request ID: " + requestId);

    nexmo.verify.control({ request_id: requestId, cmd: 'cancel' }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            if (result && result.status == '0') {
                res.status(200).send(result);
            } else {
                res.status(400).send(result);
            }
        }
    });
});


module.exports = router