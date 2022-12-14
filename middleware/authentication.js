const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const auth = async (req, res, next) => {
    // check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(400).json({message:"Check authentication properly"});
    }
    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach the user to the job routes
        req.user = { userId: payload.id };
        console.log(payload)
        next();
    } catch (error) {
        return res.status(400).json({message:"Authentication invalid"});
    }
};

module.exports = auth;
