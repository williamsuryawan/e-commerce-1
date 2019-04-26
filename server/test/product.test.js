const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app.js');
const { user, loginUser } = require('./public')
const Product = require('../models/product');
const User = require('../models/user');
const jwt = require('../helpers/jwtConvert')

chai.use(chaiHttp);

console.log("masuk awal testing product")

let token = '';
let adminToken = '';

before(done => {
    let adminUser = {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: '1234',
        role: 'admin',
        city: 'Jakarta'
    }
  
    User.create(adminUser)
     .then(user => {
       let signUser = {
          id: user._id,
          email: user.email
       };
  
       adminToken = jwt.sign(signUser);
       done()
     })
     .catch(err => {
       throw err
     })
  
})

after(done => {
    User
     .deleteMany({}, () => { done() });
})


describe('Products', function () {
    // describe('POST /products/register ', function() {
    //     it('should return status code 201 with response body created products', function(done) {
    //       let newProduct = {
    //         name: 'Hibiscus Print Sandal',
    //         stock: 10,
    //         price: 5000000,
    //         weight: 1000,
    //         image: "https://storage.googleapis.com/williambucket/1556258037676home-background2.jpg",
    //         brand: Versace,
    //         category: Sandal,
    //       }
    
    //       chai
    //        .request(app)
    //        .post('/products/register')
    //        .send(newProduct)
    //        .set('token', adminToken)
    //        .end(function(err, res) {
    //             expect(err).to.be.null;
    //             expect(res).to.have.status(201);
    //             expect(res.body).to.be.an('object');
    //             expect(res.body).to.have.property('_id')
    //             expect(res.body).to.have.property('link')
    //             expect(res.body).to.have.property('name');
    //             expect(res.body).to.have.property('stock');
    //             expect(res.body).to.have.property('weight')
    //             expect(res.body).to.have.property('category');
    //             expect(res.body).to.have.property('brand');
    //             done();
    //        })
    //     })
    // })

    describe('GET /Show All Products', function () {
      it('should return status code 200 with response body of array of all product list', function (done) {
        chai
        .request(app)
        .get(`/products`)
        .send(user)
        .end((err, res) => {
            console.log("hasil testing get all product", res.body)
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('_id')
            expect(res.body[0]).to.have.property('link')
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('stock');
            expect(res.body[0]).to.have.property('weight')
            expect(res.body[0]).to.have.property('category');
            expect(res.body[0]).to.have.property('brand');
            done();
        })
      })
    })
    describe('GET /Show One Product', function () {
        it('should return status code 201 with response body of new created user', function (done) {
            chai
                .request(app)
                .get(`/products/5cc29cf7ab9478174b33fb0d`)
                .end((err, res) => {
                    console.log("hasil testing get one product", res.body)
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('link')
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('stock');
                    expect(res.body).to.have.property('weight')
                    expect(res.body).to.have.property('category');
                    expect(res.body).to.have.property('brand');
                    
                    done();
        })
        })

        it('should return status code 404 response should be an objects', function (done) {
            chai
                .request(app)
                .get(`/products/111`)
                .end(function(err, res) {
                        console.log("hasil testing get one product, error", res.body)
                        expect(err).to.be.null;
                        expect(res).to.have.status(404);
                        expect(res.body).to.have.be.an('object');
                        expect(res.body).to.haveOwnProperty('msg');
                        expect(res.body.msg).to.be.an('string');
                        expect(res.body.msg).to.be.equal('Product Not Found');
                        done()
              })
          })
        
    })


})

