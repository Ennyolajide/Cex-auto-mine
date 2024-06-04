require('dotenv').config();
const chalk = require('chalk');
const axios = require('axios');
const { urls, buildRequestData, getHeaders } = require('./config');
const { farmOrClaimOrWait, claimTaps, logInfo, logInfoError, exitProcess } = require('./requests.js');


const env = process.env;
const farmingTime = parseInt(env.FARMING_TIME);

axios.post(urls.userInfo, buildRequestData(), { headers: getHeaders() })
    .then((res) => {
        const { status, data } = res.data;
        const { availableTaps } = data;
        status == 'ok' ? logInfo(data) : logInfoError();
        status == 'ok' ? farmOrClaimOrWait(data, farmingTime) : false;

        (status == 'ok' && availableTaps > 0) ? claimTaps(availableTaps) : false;
    })
    .catch(error => {
        exitProcess();
    });