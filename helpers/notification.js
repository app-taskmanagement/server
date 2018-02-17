const Model       = require('../models')
const nodemailer  = require('nodemailer')
const Nexmo       = require('nexmo')

exports.email = function(obj, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    if (setting[0].mail_host != '' && setting[0].mail_username != '') {
      let mailOptions = {
        from        : `${setting[0].app_name} <${setting[0].mail_username}>`,
        to          : obj.to,
        subject     : obj.subject,
        html        : obj.body,
        attachments : obj.attachments || '',
      }

      if (!setting[0].port) { //using mailgun
        console.log('================Send mail using mailgun');
        mailOptions = {
          from        : `${setting[0].app_name} <mailgun@${setting[0].mail_host}>`,
          to          : obj.to,
          subject     : obj.subject,
          html        : obj.body,
          attachments : obj.attachments || '',
        }
        let mailgun = require('mailgun-js')({ apiKey: process.env.MAILGUN_KEY, domain: setting[0].mail_host })
        mailgun.messages().send(mailOptions, (error, info) => {
          callback(error, info)
        })
      } else { //using nodemailer
        console.log('Send mail using nodemailer');
        let secure = true
        if (setting[0].mail_secure == 2) {
          secure = false
        }
        let transporter = nodemailer.createTransport({
          poll  : true,
          host  : setting[0].mail_host,
          port  : setting[0].mail_port,
          secure: secure, // true for 465, false for other ports
          auth: {
              user: setting[0].mail_username, // generated ethereal user
              pass: setting[0].mail_password,  // generated ethereal password
          }
        })
        transporter.sendMail(mailOptions, (error, info) => {
          callback(error, info)
        })
      }
    } else {
      callback('You must setting mail server !!')
    }
  })
}



exports.sms = function(obj, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    if (setting[0].sms_apikey != '' && setting[0].sms_apisecret != '') {
      const nexmo = new Nexmo({
        apiKey    : setting[0].sms_apikey,
        apiSecret : setting[0].sms_apisecret,
      })

      let from  = 'NEXMO';
      let to    = obj.to;
      let text  = obj.text;
      nexmo.message.sendSms(from, to, text, {type: 'unicode'}, function(err, responseData) {
        callback(err, responseData)
      })
    }
  })
}
