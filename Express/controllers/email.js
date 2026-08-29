const nodemailer = require('nodemailer');

const sendemail = option => {
    // transporter

    const transporter = nodemailer.transporter({
        service : "gmail"
    })
}