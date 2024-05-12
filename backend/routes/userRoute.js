const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Account = require("../models/Account");
const zod = require("zod");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { auth } = require("../middleware");

const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string().email(),
    password: zod.string()
});

// 1. signup
router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid data provided."
        });
    }

    const existingUser = await User.findOne({
        username: body.username
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Username already exists."
        });
    }

    const user = await User.create({
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    });
    const userId = user._id;

    // -- create new account --
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    });

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET);

    res.status(201).json({
        message: "User created successfully.",
        token: token
    });
});

// 2. update user information
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", auth, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information."
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

// 3. get users, filterable via first/last name
router.get('/bulk', auth, async (req, res) => {
    const filter = req.query.filter || '';
    const loggedInUserId = req.query.loggedInUserId;

    try {
        const users = await User.find({
            _id: { $ne: loggedInUserId }, // Exclude the logged-in user
            $or: [
                { firstName: { "$regex": filter } },
                { lastName: { "$regex": filter } }
            ]
        });

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. login user
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs."
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        return res.status(411).json({
            message: "Invalid username or password."
        })
    }

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);

        res.status(200).json({
            user: user,
            token: token
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in.."
    })
})

module.exports = router;