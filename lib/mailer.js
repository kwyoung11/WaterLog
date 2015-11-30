var nodemailer = require('nodemailer');


var mailer = function () {
    // create reusable transporter object using SMTP transport
    this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'envirohubapp@gmail.com',
            pass: 'envirohub'
        }
    });
};

mailer.prototype.deliver = function(toIn, subjectIn, htmlIn) {
    var self = this;
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'EnviroHub ✔ <EnviroHubApp@gmail.com>', // sender address
        to: toIn, // list of receivers
        subject: subjectIn, // Subject line
        html: htmlIn // html body
    };
    // send mail with defined transport object
    self.transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = new mailer();