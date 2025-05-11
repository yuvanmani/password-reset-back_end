const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { sendEmail } = require("../utils/emailService");

const authController = {
    register: async (req, res) => {
        try {
            // get the details from the request body
            const { email, password } = req.body;

            // validate input
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" })
            }

            // check if the user already exists
            const user = await User.findOne({ email });

            if (user) {
                return res.status(500).json({ message: "User already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // create a new user object
            const newUser = new User({
                email,
                password: hashedPassword
            })

            // save the user to the database
            await newUser.save();

            // send response to the user
            res.status(201).json({ message: "User registered successfully" });

        }
        catch (error) {
            return res.status(500).json({
                message: "Registration Failed"
            })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            // get the email from the request body
            const { email } = req.body;

            // validate input
            if (!email) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // check the user is exist in the database
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // avoid continuous token generating & give 1 minute time gap to generate another token
            const now = Date.now();
            const tokenLifetime = 10 * 60 * 1000;
            const gapTime = 60 * 1000;
            const oldTokenAge = now - (user.resetTokenExpiry - tokenLifetime);

            // check if the reset token exists & which is generated within 1 minute
            if (user.resetToken && user.resetTokenExpiry && oldTokenAge < gapTime) {
                return res.status(429).json({ message: "Please wait 1 minute before requesting a new link" });
            }

            // if user exist & no valid token before, create a new token
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10m" });

            // save the reset token details in database
            user.resetToken = token;
            user.resetTokenExpiry = now + tokenLifetime;
            await user.save();

            // create the reset link
            const resetLink = `http://localhost:3001/api/v1/users/reset-password/${token}`;

            // send the link to the user via email
            sendEmail(user.email, "Password Reset", `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`)

            // send the response to the user
            res.status(200).json({ message: "Password reset link sent to your Email" });
        }
        catch {
            return res.status(500).json({ message: "Send reset link is failed" });
        }
    },
    resetPassword: async (req, res) => {
        try {
            // get the token from request params
            const { token } = req.params;

            // get the new password from request body
            const { newPassword } = req.body;

            // check the input field is not empty
            if (!newPassword) {
                return res.status(400).send("<h4>New password is required<h4>");
            }

            // verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            // get the userId from the decoded.id
            const userId = decoded.id;

            // get the user details from the database by using userId
            const user = await User.findOne({ _id: userId, resetToken: token });

            // check if the user is exist & token is valid
            if (!user || user.resetTokenExpiry < Date.now()) {
                return res.status(400).send("<h4>Token expired or invalid user<h4>");
            }

            // save the new password & clear the reset token details in database
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetToken = undefined;
            user.resetTokenExpiry = undefined;

            await user.save();

            res.status(500).send("<h4>Password reset successful. Close this window<h4>");

        }
        catch (error) {
            return res.status(403).send("<h4>Forbidden<h4>");
        }
    },
    openResetPassword: async (req, res) => {
        try {
            // get the token from request params
            const { token } = req.params;

            // verify the token
            const decoded = jwt.verify(token, JWT_SECRET);

            // get the userId from the decoded.id
            const userId = decoded.id;

            // get the user details from the database by using userId
            const user = await User.findOne({ _id: userId, resetToken: token });

            // check if the user is exist
            if (!user) {
                return res.status(404).send("<h4>User not found<h4>");
            }

            // check if the token is valid
            if (user.resetTokenExpiry < Date.now()) {
                return res.status(400).send("<h4>Token expired<h4>");
            }

            res.send(`
                <!DOCTYPE html>

                  <html>
                        <head>
                           <title>Reset Password</title>
                        </head>

                      <body>
                          <h1>Reset your password</h1>
                          <form action ="/api/v1/users/reset-password/${token}" method="POST">
                             <input type="password" name="newPassword" placeholder="Enter new password" required autocomplete="off"/>
                             <button type="submit">Submit</button>
                          </form>
                      </body>

                     <script>
                        const params = new URLSearchParams(window.location.search);
                        const token = params.get('token');
                     </script>
                  </html>
    `);
        }
        catch (error) {
            return res.status(403).send("<h4>Forbidden<h4>");
        }
    }
}

module.exports = authController;