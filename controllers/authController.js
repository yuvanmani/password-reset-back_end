const User = require("../models/user");
const bcrypt = require("bcrypt");

const authController = {
    register : async (req,res) => {
        try{
            // get the details from the request body
            const {email, password} = req.body;

            // check if the user already exists
            const user = await User.findOne({email});

            if(user){
                return res.status(500).json({message : "User already exists"});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user object
            const newUser = new User({
                email,
                password : hashedPassword
            })

            // save the user to the database
            await newUser.save();

            // send response to the user
            res.status(201).json({message : "User registered successfully"});
    
        }
        catch (error) {
           return res.status(500).json({
                message: "Registration Failed"
            })
        }
    },
    forgotPassword: async (req, res) => {
        try {

        }
        catch {

        }
    },
    resetPassword: async (req, res) => {
        try {

        }
        catch {

        }
    }
}

module.exports = authController;