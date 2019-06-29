import * as logger from "/netscript/utils/logger.js";

let stocks = {};

const buyThreshold = 55;
const sellThreshold = 50;

let threshold = {
    BUY: buyThreshold,
    SELL: sellThreshold,
    asArray: function() {
        return ["SELL: " + this.SELL, "BUY: " + this.BUY];
    },
    setBuy: function(newThreshold) {
        validLimit(newThreshold);
        if (newThreshold >= 50)
            this.BUY = newThreshold;
        else
            this.BUY = sellThreshold;
    },
    setSell: function(newThreshold) {
        validLimit(newThreshold);
        if (newThreshold >= 50)
            this.SELL = newThreshold;
        else
            this.SELL = sellThreshold;

    },
    valid: function() {
        validLimit(this.BUY);
        validLimit(this.SELL);
    }
}

export function getThreshold() {
    return threshold;
}

export function changeBuyThreshold(buyThreshold) {
    logger.info("BUY THRESHOLD", "CHANGE: " + buyThreshold);
    threshold.setBuy(threshold.BUY + buyThreshold);

}

export function changeSellThreshold(sellThreshold) {
    logger.info("SELL THRESHOLD", "CHANGE: " + sellThreshold);
    threshold.setSell(threshold.SELL + sellThreshold);
}

function validLimit(limit) {
    if (isNaN(limit)) {
        logger.throwNewError(`Limit(${limit}) is not a number.`);
    }
    if (!Number.isInteger(limit)) {
        logger.throwNewError(`Limit(${limit}) is not an integer.`);
    }
    if (limit > 100) {
        logger.throwNewError(`Limit(${limit}) is more than 100.`);
    }
    if (limit < 0) {
        logger.throwNewError(`Limit(${limit}) is less than 0.`);
    }
}

export function printThreshold() {
    logger.infoArr("THRESHOLD", threshold.asArray());
}