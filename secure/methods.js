const nodemailer = require('nodemailer');
var crypto = require('crypto'); 

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
