const express = require("express");
const router = express.Router();
const Account = require("../models/Account");
const { auth } = require("../middleware");
const mongoose = require("mongoose");

// 1. get balance
router.get("/balance", auth, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.status(201).json({
        balance: account.balance
    })
});

// 2. transfer money to another account
router.post("/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
        message: "Transfer successful"
    });
});

module.exports = router;