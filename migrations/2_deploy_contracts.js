var ACAToken = artifacts.require("./ACAToken.sol");
var ACATokenSale = artifacts.require("./ACATokenSale.sol");
var SafeMath = artifacts.require("../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol");

const moment = require('moment');

module.exports = function(deployer, network, accounts) {
    console.log(deployer);
    console.log(network);
    console.log(accounts);

    const totalSupply = web3.toWei(2000000000, "ether");

    const softCap = web3.toWei(100000000, "ether");
    const hardCap = web3.toWei(1000000000, "ether");

    const teamAmount = web3.toWei(560000000, "ether");
    const advisorsAmount = web3.toWei(100000000, "ether");

    const investorsAmount = web3.toWei(240000000, "ether");

    const referralAmountRaw = 30000000;
    const whitelistBonusAmountRaw = 10000000;
    const bountyAmountRaw = 100000000 - whitelistBonusAmountRaw - referralAmountRaw;
    const bountyAmount = web3.toWei(bountyAmountRaw, "ether");

    const referralAmount = web3.toWei(referralAmountRaw, "ether");
    const referralRateInviter = 3; // 3%
    const referralRateInvitee = 1; // 1%

    const whitelistBonusClosingTime = moment.utc("2018-05-14T11:00:00+02:00").unix();
    const whitelistBonusRate = web3.toWei(4000, "ether");
    const whitelistBonusAmount = web3.toWei(whitelistBonusAmountRaw, "ether");

    // live
    const wallet = "0x7A13228EdDf6079A84b3889D459bFf15eEcdd5A4";
    const admin = "0xED7Ad706c58AF35DD88cE105DB4ff7858d370A9c";

    const privateSaleOpeningTime = moment.utc("2018-04-15T11:00:00+02:00").unix();
    const privateSaleClosingTime = moment.utc("2018-06-30T11:00:00+02:00").unix();
    const privateSaleMinimumWei = web3.toWei(80, "ether");
    const privateSaleMaximumWei = web3.toWei(3000, "ether");
    const privateSaleCap = web3.toWei(216000000, "ether");
    const privateSaleRate = 32400;

    const preSaleOpeningTime = moment.utc("2018-07-14T11:00:00+02:00").unix();
    const preSaleClosingTime = moment.utc("2018-07-27T11:00:00+02:00").unix();
    const preSaleMinimumWei = web3.toWei(30, "ether");
    const preSaleMaximumWei = web3.toWei(1500, "ether");
    const preSaleCap = web3.toWei(140000000, "ether");
    const preSaleRate = 25200;

    const saleStage1OpeningTime = moment.utc("2018-08-04T11:00:00+02:00").unix();
    const saleStage1ClosingTime = moment.utc("2018-08-17T11:00:00+02:00").unix();
    const saleStage1MinimumWei = web3.toWei(0.1, "ether");
    const saleStage1MaximumWei = web3.toWei(500, "ether");
    const saleStage1Cap = web3.toWei(240000000, "ether");
    const saleStage1Rate = 21600;

    const saleStage2OpeningTime = moment.utc("2018-08-25T11:00:00+02:00").unix();
    const saleStage2ClosingTime = moment.utc("2018-09-07T11:00:00+02:00").unix();
    const saleStage2MinimumWei = web3.toWei(0.1, "ether");
    const saleStage2MaximumWei = web3.toWei(500, "ether");
    const saleStage2Cap = web3.toWei(220000000, "ether");
    const saleStage2Rate = 19800;

    const saleStage3OpeningTime = moment.utc("2018-09-15T11:00:00+02:00").unix();
    const saleStage3ClosingTime = moment.utc("2018-09-30T11:00:00+02:00").unix();
    const saleStage3MinimumWei = web3.toWei(0.1, "ether");
    const saleStage3MaximumWei = web3.toWei(500, "ether");
    const saleStage3Cap = web3.toWei(184000000, "ether");
    const saleStage3Rate = 18000;

    var tokenSale = null;
    var token = null;

    // gas limit is too damn low!
    deployer.deploy(ACATokenSale,
            wallet,

            totalSupply,
            softCap,
            hardCap,

            admin)
        .then((tx) => {
            return ACATokenSale.deployed();
        })
        .then((_tokenSale) => {
            tokenSale = _tokenSale;

            return deployer.deploy(ACAToken,
                totalSupply,
                tokenSale.address);
        })
        .then(() => {
            return ACAToken.deployed();
        })
        .then((_token) => {
            token = _token;

            return tokenSale.setToken(token.address);
        })
        .then((tx) => {
            console.log('setup bounty');
            return tokenSale.setupBounty(
                referralAmount,
                referralRateInviter,
                referralRateInvitee,

                bountyAmount,

                whitelistBonusClosingTime,
                whitelistBonusRate,
                whitelistBonusAmount
            );
        })
        .then((tx) => {
            console.log('add stage private');
            return tokenSale.addStage(
                privateSaleOpeningTime,
                privateSaleClosingTime,
                privateSaleCap,
                privateSaleMinimumWei,
                privateSaleMaximumWei,
                privateSaleRate,
            );
        })
        .then((tx) => {
            console.log('add stage pre');
            return tokenSale.addStage(
                preSaleOpeningTime,
                preSaleClosingTime,
                preSaleCap,
                preSaleMinimumWei,
                preSaleMaximumWei,
                preSaleRate,
            );
        })
        .then((tx) => {
            console.log('add stage 1');
            return tokenSale.addStage(
                saleStage1OpeningTime,
                saleStage1ClosingTime,
                saleStage1Cap,
                saleStage1MinimumWei,
                saleStage1MaximumWei,
                saleStage1Rate,
            );
        })
        .then((tx) => {
            console.log('add stage 2');
            return tokenSale.addStage(
                saleStage2OpeningTime,
                saleStage2ClosingTime,
                saleStage2Cap,
                saleStage2MinimumWei,
                saleStage2MaximumWei,
                saleStage2Rate,
            );
        })
        .then((tx) => {
            console.log('add stage 3');
            return tokenSale.addStage(
                saleStage3OpeningTime,
                saleStage3ClosingTime,
                saleStage3Cap,
                saleStage3MinimumWei,
                saleStage3MaximumWei,
                saleStage3Rate,
            );
        })
        .then((tx) => {
            console.log('enable');
            return tokenSale.enableTokenSale();
        })
        .then((tx) => {
            console.log('done');
            console.log(tx);
        })
};