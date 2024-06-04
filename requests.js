const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment');
const { urls, getHeaders, buildRequestData } = require('./config');


function farmOrClaimOrWait(data, farmingTime) {
    const { farmStartedAt } = data;
    const currentTime = data?.serverTime;
    const farmTime = moment(farmStartedAt);
    const farmEndTime = farmTime.add(farmingTime, 'hours');
    farmEndTime.isBefore(currentTime) ? claimFarm() : false;
}

async function startFarming() {
    const data = buildRequestData();
    return await axios.post(urls.startFarm, data, { headers: getHeaders() }).then((res) => {
        const { status, data } = res.data;
        status == 'ok' ? logFarming(data) : false;
    }).catch((error) => {
        logError(error);
    });
}

async function claimFarm() {
    const data = buildRequestData();
    return await axios.post(urls.claimFarm, data, { headers: getHeaders() }).then((res) => {
        const { status, data } = res.data;
        status == 'ok' ? logFarmClaim(data) : false;
        status == 'ok' ? startFarming() : false;
    }).catch((error) => {
        logError(error);
    });
}

async function claimTaps(availableTaps) {
    const _data = buildRequestData({ taps: availableTaps });
    return await axios.post(urls.claimTaps, _data, { headers: getHeaders() }).then((res) => {
        const { status, data } = res.data;
        status == 'ok' ? logTaps(availableTaps, data) : false;
        data?.availableTaps < availableTaps ? exitProcess() : false;
    }).catch((error) => {
       exitProcess();
    });
}

function logInfo(obj) {
    console.log(
        'Username:', chalk.green(obj?.username),
        '| Balance', chalk.yellow(obj?.balance),
        '| Farm Reward:', chalk.green(obj?.farmReward),
        '| Available Taps:', chalk.blue(obj?.availableTaps),
        // '| Tap Interval Minutes:', chalk.blue(obj?.tapIntervalMinutes),
        // '| Tap Attempts Per Interval:', chalk.blue(obj?.tapAttemptsPerInterval),
        // '| Mining Era Interval In Seconds:', chalk.blue(obj?.miningEraIntervalInSeconds),
    );
}

function logFarming(data) {
    console.log(
        'Farming ... :', chalk.green('\u2714'),
        '| Farm Reward:', chalk.green(data?.farmReward),
        '| Farm Started At:', chalk.yellow(data?.farmStartedAt)
    );
}

function logFarmClaim(data) {
    console.log(
        'Farm Claiming ... :', chalk.green('\u2714'),
        '| Farm Reward:', chalk.green(data?.claimedBalance),
        '| Balance:', chalk.yellow(data?.balance)
    );
}

function logTaps(availableTaps, obj) {
    console.log(
        'Taping ...:', chalk.green('\u2714'),
        '| Taps:', chalk.blue(availableTaps),
        '| Balance', chalk.yellow(obj?.balance),
    );
}

function logInfoError() {
    console.log(chalk.red('Error getting account info'));
    process.exit();
}

function logError(error) {
    console.log(error);
}

function exitProcess() {
    console.log(chalk.red('Error || Completed. Exiting...'));
    process.exit(); //end the process
}

module.exports = { farmOrClaimOrWait, claimTaps, logInfo, logInfoError, logError, exitProcess }
