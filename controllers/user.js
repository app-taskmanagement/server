const Model       = require('../models')
const library     = require('../helpers/library')
const template    = require('../helpers/templateemail')
const send        = require('../helpers/notification')
const express     = require('express')
const Sequelize   = require('sequelize')
const jwt         = require('jsonwebtoken')
const kue         = require('kue')
const FB          = require('fb')
const fb          = new FB.Facebook({version: 'v2.11'})
const queue       = kue.createQueue()
const Router      = express.Router()

module.exports = {
  postUserLogin: (req, res) => {
    Model.Setting.findAll()
    .then(setting => {
      Model.User.findOne({
        where: {
          email: req.body.email,
        }
      })
      .then(user => {
        if (!user) {
          res.status(404).json({
            // setting : setting[0],
            user    : user,
            message : 'Username belum terdaftar !!'
          })
        } else {
          user.check_password(req.body.password, (isMatch) => {
            if (isMatch) {
              let token = jwt.sign({ user: user }, process.env.APP_TOKEN, { expiresIn: '6h' })
              res.status(200).json({
                message : 'Success login',
                token   : token
              })
            } else {
              res.status(404).json({
                // setting : setting[0],
                user    : user,
                message: 'Username atau Password tidak sesuai !!'
              })
            }
          })
        }
      })
      .catch(err => res.status(500).json({
        // setting : setting[0],
        user    : user,
        message : err.message
      }))
    })
    .catch(err => res.status(500).json({
      // setting : setting[0],
      user    : user,
      message : err.message
    }))
  },

  postUserLoginFacebook: (req, res) => {
    Model.Setting.findAll()
    .then(setting => {
      FB.setAccessToken(req.body.tokenFB)
      FB.api('/me', { fields: 'name, email, picture' })
      .then(userFB => {
        // console.log('userFB ====', userFB);
        Model.User.findOne({
          where: {
            email: userFB.email,
          }
        })
        .then(user => {
          if (user) {
            let token = jwt.sign({ user: user }, process.env.APP_TOKEN, { expiresIn: '6h' })
            res.status(200).json({
              message : 'Success login',
              token   : token
            })
          } else {
            let objUser = {
              name          : userFB.name,
              email         : userFB.email,
              role          : 2,
              status        : 1,
            }
            Model.User.create(objUser)
            .then(function() {
              let token = jwt.sign({ user: objUser }, process.env.APP_TOKEN, { expiresIn: '6h' })
              res.status(200).json({
                message : 'Success login',
                token   : token
              })
            })
          }
        })
      })
      .catch(err => res.status(500).json({
        // setting : setting[0],
        user    : user,
        message : err.message
      }))
    })
    .catch(err => res.status(500).json({
      // setting : setting[0],
      user    : user,
      message : err.message
    }))
  },

  postUserRegister: (req, res) => {
    if (req.body.password != req.body.retype_password) {
      res.status(404).json({
        message: 'Verifikasi password tidak sesuai dengan password !!'
      })
    } else {
      Model.Setting.findAll()
      .then(setting => {
        let info      = ''
        let tokenReg  = library.randomValueBase64(64)
        let link      = req.headers.host + '/users/activation/' + tokenReg
        let objUser = {
          name          : req.body.name,
          email         : req.body.email,
          password      : req.body.password,
          role          : 2,
          reset_token   : tokenReg,
          reset_expired : null,
          status        : 0,
        }
        Model.User.create(objUser)
        .then(function() {
          Model.User.findOne({
            where: {
              email   : req.body.email,
              role    : 2,
              status  : 0,
            }
          })
          .then(user => {
            let objMail = {
              to          : req.body.email,
              subject     : `[${setting[0].app_name}] Selamat ${req.body.name}, Akun Anda telah berhasil di daftarkan.`,
              body        : template.registered_success(setting[0], objUser, link),
            }
            queue.create('email', objMail)
            .save(err => {
               if (!err) {
                 res.status(200).json({
                   // setting : setting[0],
                   message : `Selamat ${user.name}. Aktifasi akun telah dikirim ke email ${req.body.email}`
                 })
               } else {
                 res.status(404).json({
                   // setting : setting[0],
                   message : `Gagal untuk pendaftaran akun, ${err.message}`
                 })
               }
            })
          })
        })
        .catch(err => res.status(500).json({
          // setting : setting[0],
          user    : user,
          message : err.message
        }))
      })
    }
  }
}
