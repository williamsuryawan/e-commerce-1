const User = require('../models/user');
const Cart = require('../models/cart')
const bcrypt = require('bcrypt');
const jwtConvert = require('../helpers/jwtConvert');
// const googleSignin = require('../helpers/googleSignIn')

class UserController {
    static findUser (req,res) {
        let findMe = {}
        User
            .find(findMe)
            .then(users => {
                res.status(200).json(users)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }

    static register (req,res) {
        console.log("masuk ke register", req.body)
        User
            .create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: 'customer', 
                address: req.body.address,
                city: req.body.province,
                province: req.body.province,
                zipcode: req.body.zipcode
            })
            .then(newUser => {
              res.status(201).json(newUser);
              return Cart.create({
                listsProduct: [],
                userId: newUser._id})
                .then(newCart => {
                    console.log("Hasil cart baru", newCart)
                    res.status(201).json(newUser)
                    
                })
            })
            .catch(err => {
              console.log("terjadi error add users", err)  
              if (err.errors.email) {
                    res.status(409).json(err);
                } else if(err.errors.phone) {
                    res.status(409).json(err);
                } else {
                    res.status(500).json(err);
                }
            }) 
    }

    static login (req,res) {
        if (req.body.loginVia == 'website') {
          console.log("masuk ke login", req.body)  
          User
                .findOne({
                    email: req.body.email
                })
                .then(user => {
                    if(!user) {
                        res.status(403).json({
                            message: `Wrong Email/Password`
                        })
                    } else {
                        let isValid = bcrypt.compareSync(req.body.password, user.password)
                        console.log("Cek validity==>", isValid)
                        if(isValid) {
                            let token = jwtConvert.sign({id: user._id, email: user.email}, process.env.JWT_SECRET)
                            console.log("Token dihasilkan token", token)
                            res.status(200).json({
                                token: token
                            })
                        } else {
                            res.status(403).json({
                                message: 'Wrong Email/Password'
                            })
                        }
                    }
                })
        } else if (req.body.loginVia == 'googleSignIn') {
          console.log("masuk googlesign in", req.body)
          
        }
    }

    static getUserDetail (req,res) {
        User
          .findOne({
              email: req.loggedInUser.email
            })
          .populate('listArticle')
          .then(user =>{
            console.log("hasil getuserdetail: ", user)
            res.status(200).json({
                msg: `Detail of user ${user.name}`,
                data: user
            })
          })
          .catch(error =>{
            res.status(500).json({
                msg: 'ERROR: ',error
            })
          })
    }
    static verifyToken (req,res) {
      console.log("masuk ke token verification", req.headers)
      try {
        let result = jwtConvert.jwtVerification(req.headers)
        console.log("hasil token verification", result)
        res.status(200).json({
          msg: `JWT Verification Result`,
          data: result
        })
      } catch (err) {
          res.status(409).json({
            msg: 'ERROR: ',error
        })
      }

    } 

    static editUser (req,res) {
      console.log("Masuk ke edit user", req.body, req.loggedInUser)
      User.findOne({
          "_id": req.loggedInUser.id
      })
      .then (user => {
          // let editDate = checkDate(req.body.updatedAt)
          console.log("Hasil pencarian user: ", user)
          User.findOneAndUpdate({
              _id: req.loggedInUser.id
          }, {
              name: req.body.name,
              email: req.body.email,
              price: req.body.price,
              password: user.password,
              role: 'Customer',
              address: req.body.address,
              city: req.body.city,
              province: req.body.province,
              zipcode: req.body.zipcode,
          }, {new: true})
          .then(userupdate => {
              console.log("Hasil Edit", userupdate)
              res.status(200).json(userupdate)
          })
          .catch (error => {
              res.status(500).json({
                  msg: 'ERROR: ',error
              })
          }) 
      })
      .catch(error=>{
          res.status(500).json({
              msg: 'ERROR in finding user to edit ',error           
          }) 
          console.log(error)
      })
    }
    static loginAdmin (req,res) {
      console.log("Masuk ke login admin, input:", req.body)
      User
          .findOne({
              email: req.body.email
          })
          .then(user => {
              if(!user) {
                  res.status(400).json({
                      message: `Wrong Email/Password`
                  })
              } else {
                  console.log("Admin berhasil ditemukan ====>", user)
                  if(user.email == 'admin@gmail.com') {
                      let isValid = bcrypt.compareSync(req.body.password, user.password)
                      console.log("Cek validity", isValid)
                      if(isValid) {
                          let token = jwtConvert.sign({email: user.email}, process.env.SECRET)
                          res.status(200).json({
                              adminToken: token,
                              id: user._id,
                          })
                      } else {
                          res.status(400).json({
                              message: 'Wrong Email/Password'
                          })
                      }
                  } else {
                      res.status(400).json({
                          message: 'Not Registered as Admin'
                      })
                  }
                  
              }
          })
  }
}

module.exports = UserController;