const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (to,subject,html)=>{
    try {
        const transpoter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASS
            }
        });

        await transpoter.sendMail({
            from:`Educonnect ${process.env.USER_EMAIL}`,
            to,
            subject,
            html,
        })
    } catch (error) {
        console.log(error)
    }
};

module.exports = sendEmail;