require('dotenv').config();

const env = process.env;
const baseUrl = 'https://cexp.cex.io/api';

const urls = {
    startFarm: `${baseUrl}/startFarm`,
    claimTaps: `${baseUrl}/claimTaps`,
    claimFarm: `${baseUrl}/claimFarm`,
    userInfo: `${baseUrl}/getUserInfo`,
}

const buildAuthQuery = () => {
    return env.AUTH_QUERY;
}

const buildRequestData = (data={}) => {  
    return { devAuthData: parseInt(env.TELEGRAM_ID), authData: buildAuthQuery(), data: data, platform: "ios" };
}

const getHeaders = () => {
    return {
        'Host': 'cexp.cex.io',
        'Accept': 'application/json, text/plain, */*',
        'Sec-Fetch-Site': 'same-origin',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Sec-Fetch-Mode': 'cors',
        'Content-Type': 'application/json',
        'Origin': 'https://cexp.cex.io',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
        'Referer': 'https://cexp.cex.io/',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty'
    };
}

module.exports = { urls, buildRequestData, getHeaders }
