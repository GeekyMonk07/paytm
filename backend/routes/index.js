const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoute");
const accountRoutes = require("./accountRoute");

router.use("/user", userRoutes);
router.use("/account", accountRoutes);

module.exports = router;



