const nodemailer = require('nodemailer');
var crypto = require('crypto'); 

// async..await is not allowed in global scope, must use a wrapper
/*async function sendmail() {
	
	let testAccount = await nodemailer.createTestAccount();
    // Generate test SMTP service account from ethereal.email
	var hash = token(req.body.email);

    var userData = {
    		fullname  	 : req.body.fullname,
    		username  	 : req.body.username,
    		email 	  	 : req.body.email,
    		password  	 : bcrypt.hashSync(req.body.password, 10),
    		accountToken : hash
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
		ignoreTLS: true,// true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'Exchanger', // sender address
        to: userData.email, // list of receivers
        subject: 'Account Acivation?', // plain text body
        html: '<a href="http://localhost:3000/activate/${userData.username}/${userData.accountToken}">here</a>'
                        // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

sendmail().catch(console.error);*/



function token(email){

	var secret = email.split("@");
                secret = secret[0] + Date.now();

    var hash = crypto.createHmac('sha256', secret)
                           .update(secret[1])
                           .digest('hex');

    return hash = hash.substr(20,40);

}

function sendMail(mailOptions){
       
    return new Promise(function(resolve,reject){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'username',
                pass: 'password'
            }
            /*tls: {
                rejectUnauthorized : false
            }*/
        });

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return reject(error);
            }

            return resolve(info);
             
        });
    });

}

function saveUser(profile,newUser,hash){
                newUser.fullname = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.image = profile.photos[0].value;
                newUser.status = "1";
                return newUser;
}

module.exports.token = token;
module.exports.sendMail = sendMail;
module.exports.saveUser = saveUser;
