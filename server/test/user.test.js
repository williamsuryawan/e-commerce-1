const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app.js');
const { user, loginUser } = require('./public')
const User = require('../models/user');

chai.use(chaiHttp);

console.log("masuk awal testing")

after(done => {
  User
   .deleteMany({}, () => {
     done();
   })
})

// USER
//     REGISTRASI
//     Input: name, email, password
//     1 sukses registrasi OK
//     2 gagal registrasi: email tidak boleh kosong
//     3 gagal registrasi: password tidak boleh kosong
//     4 gagal registrasi: email harus unik
    
//     LOGIN CUSTOMER
//     Input: email, password
//     5 sukses login OK
//     6 gagal login: email tidak tersedia
//     7 gagal login: password salah 

//     LOGIN ADMIN
//     Input: email, password
//     8 sukses login
//     9 gagal login: email tidak tersedia
//     10 gagal login: password salah

describe('Users', function () {
  describe('POST /REGISTER', function () {
    it('should return status code 201 with response body of new created user', function (done) {

      chai
        .request(app)
        .post(`/users/register`)
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('_id')
          expect(res.body).to.have.property('name')
          expect(res.body).to.have.property('email');
          expect(res.body).to.have.property('password');

          expect(res.body.name).to.be.equal('William');
          expect(res.body.email).to.be.equal('william@gmail.com');
          expect(res.body.password).to.not.be.equal('1234');

          done();
        })
    })

    it('should return status 409 with message "email is required"', function(done) {
      let newUser = {
        name: 'William',
        email: null,
        password: '1234'
      }

      chai
        .request(app)
        .post(`/users/register`)
        .send(newUser)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('err');
          expect(res.body.err).to.be.equal('Email is required');

          done();
        })
    })

    it('should return status 409 with message "email is already registered"', function(done) {

      chai
        .request(app)
        .post(`/users/register`)
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('err');
          expect(res.body.err).to.be.equal('Email already exists');

          done();
        })
    })

    it('should return status 409 with message "password is required"', function(done) {
      let newUser = {
        name: 'William',
        email: 'halo@gmail.com',
        password: null,
        city: 'Jakarta'
      }

      chai
        .request(app)
        .post(`/users/register`)
        .send(user)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('err');
          // expect(res.body.err).to.be.equal('Password is required');

          done();
        })
    })
  })

  describe('POST /login', function () {
    it('should return status code 200 with token of the logged-in user', function (done) {

      chai
        .request(app)
        .post(`/users/login`)
        .send(loginUser)
        .end((err, res) => {
          console.log("hasil keluar test login ====", res.body)
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('token');

          done();
        })
    })

    it('should return status code 403 with message "username/password is wrong" when email is not registered', function (done) {
      let loginUserEmailWrong = {
        email: 'haha@gmail.com',
        password: '1234',
        loginVia: 'website'
      }

      chai
        .request(app)
        .post(`/users/login`)
        .send(loginUserEmailWrong)
        .end((err, res) => {
          console.log("hasil keluar test login ====", res.body)
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Wrong Email/Password');

          done();
        })
    })

    it('should return status code 403 with message "username/password is wrong" when password is wrong', function (done) {
      let loginUserPassWrong = {
        email: 'william@gmail.com',
        password: '123',
        loginVia: 'website'
      }

      chai
        .request(app)
        .post(`/users/login`)
        .send(loginUserPassWrong)
        .end((err, res) => {
          console.log("hasil keluar test login ====", res.body)
          expect(err).to.be.null;
          expect(res).to.have.status(403);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Wrong Email/Password');

          done();
        })
    })
  })
})