const nodemailer = require('nodemailer');

exports.generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendEmailOTP = async (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        html: `<h2>Your OTP is ${otp}</h2>`,
    });
};
