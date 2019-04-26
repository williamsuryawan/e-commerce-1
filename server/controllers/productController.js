// const User = require('../models/user')
const Product = require('../models/product')
// const checkDate = require('../helpers/checkarticleDate')

class productController {
    //create product
    static createProduct(req,res) {
        console.log("Masuk ke function create", req.body)
                let obj = {
                link: req.file.cloudStoragePublicUrl,
                name: req.body.name,
                stock: req.body.stock,
                price: req.body.price,
                weight: req.body.weight,
                category: req.body.category,
                brand: req.body.brand
                }

            Product
                .create(obj)
                .then(newProduct => {
                    console.log("hasil create new product:", newProduct)
                    
                    Product.findOne({
                        _id: newProduct._id
                    })
                    .then(product => {
                        res.status(201).json (newProduct)
                    })
                    .catch (error => {
                        res.status(error).json({
                            msg: 'ERROR Display details of Product ',error
                        })
                    })
                })
                .catch(error => {
                    res.status(500).json(error)
                }) 
    }
    static displayProductAll (req,res) {
        console.log("masuk ke display all products")
        Product.find({})
        .then(lists => {
            // console.log("hasil pencarian all products", lists)
            res.status(200).json(lists)
        })
        .catch(error => {
            res.status(500).json({
                msg: 'ERROR Display list of products ', error
            })
        })
    }

    static displayProductDetail (req,res) {
        console.log("masuk ke detail product", req.params)
        Product.findOne({
            _id: req.params.id
        })
        .then(product => {
            res.status(200).json (product)
        })
        .catch (error => {
            res.status(404).json({
                msg: 'Product Not Found',
                error: error
            })
        })
    }

    //edit product (admin only)
    static editProduct (req,res) {
        console.log("Masuk ke edit product", req.body, req.loggedInUser, req.params.id)
        Product.findOne({
            "_id": req.params.id
        })
        .then (product => {
            // let editDate = checkDate(req.body.updatedAt)
            console.log("Hasil pencarian product: ", product)
            Product.findOneAndUpdate({
                _id: req.params.id
            }, {
                name: req.body.name,
                stock: req.body.stock,
                price: req.body.price,
                weight: req.body.weight,
                category: req.body.category,
                brand: req.body.brand
            }, {new: true})
            .then(productupdate => {
                console.log("Hasil Edit", productupdate)
                res.status(200).json(productupdate)
            })
            .catch (error => {
                res.status(500).json({
                    msg: 'ERROR: ',error
                })
            }) 
        })
        .catch(error=>{
            res.status(500).json({
                msg: 'ERROR in finding your product to edit ',error           
            }) 
            console.log(error)
        })
    }
    //delete product (admin only)
    static deleteProduct(req,res) {
        console.log("masuk ke delete product")
        Product.findOne({
            _id: req.params.id
        })
        .then(productlist =>{
            console.log("Product yang akan didelete ditemukan:", productlist, req.loggedInUser)
            Product.findOneAndDelete({
                _id: req.params.id
            })
            .then(productDelete => {
                console.log("Hasil delete: ", productDelete)
                res.status(200).json({
                    msg: 'Product has been deleted',
                    data: productDelete
                })
            })
            .catch (error => {
                res.status(500).json({
                    msg: "Error Delete Product", error
                })
            })
        })
        .catch( error =>{
            res.status(500).json({
                msg: 'ERROR finding products to delete ',error
            })
        })
    }

}

module.exports = productController;