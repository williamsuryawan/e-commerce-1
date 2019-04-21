require('dotenv').config();
const axios = require('axios')
const User = require('../models/user');

module.exports = {

    getTotalWeight: function (productInCart) {
        console.log("masuk ke helper weightTotal", productInCart)
        let weightTotal = Number;
        weightTotal = 0;
        productInCart.forEach(product => {
            // console.log("looping hitung weight", product.productId.weight)
            if(!product.productId.weight) {
                weightTotal += 1000
            } else {
                weightTotal += (Number(product.productId.weight))
            }
            
        })
        console.log("hasil looping hitung weight", weightTotal)
        return weightTotal
    },
    getDeliveryCost: async function (inputUser, inputWeight) {
        console.log("masuk ke perhitungan helper delivery cost", inputUser, inputWeight)
        try {
            var foundUser = await User.findOne({email: inputUser.email})

            if(!foundUser) {
                res.status(404).jsonn('User not found')
            } else {
                console.log("User ditemukan", foundUser)
                let deliverycostperkg = 0
                let result = await axios.get('https://api.rajaongkir.com/starter/city', {headers: {key: '65635a5c803af47af63f9af29fc7acd5'}})
                // console.log("city list dari rajaongkit ditemukan", result.data)

                let cityId = 0
                result.data.rajaongkir.results.forEach(citylist => {
                    if (foundUser.city.toString() == citylist.city_name) {
                        // console.log("city user dan city database ditemukaan", citylist.city_id)
                        cityId = citylist.city_id
                    }
                })
                if ( cityId == 0) {
                    throw new Error ("Can't find the city")
                }
                console.log("setelah berhasil dapat city id", cityId)

                let costresult =  await axios
                .post('https://api.rajaongkir.com/starter/cost', 
                    {origin: 153, destination: cityId, weight: inputWeight, courier: 'jne'}, 
                    {headers: {key: '65635a5c803af47af63f9af29fc7acd5'}})

                    console.log("hasil cari delivery cost", costresult.data.rajaongkir.results)
                    let deliverycost = Number;
                    deliverycost = 0
                    costresult.data.rajaongkir.results[0].costs.forEach(pricelist => {
                        if(pricelist.service == 'REG') {
                            console.log("harga REG JNE ditemukan", pricelist.cost[0].value)
                            deliverycost = Number(pricelist.cost[0].value)
       
                        }
                    })
                    return deliverycost
            }
        } catch (err) {
            console.log("terjadi error calculation delivery cost", err)
            res.status(400).json(err)
        }
    },
    getProductCost: function (productInCart) {
        console.log("masuk ke helper total cost", productInCart)
        let chargeTotal = Number;
        chargeTotal = 0;
        productInCart.forEach(product => {
            let chargeTemp = 0
            // console.log("looping hitung weight", product.productId.weight)
            chargeTemp = product.productId.price * product.qty
            chargeTotal += chargeTemp
            console.log("looping calculate value", chargeTotal)
        })
        console.log("hasil looping hitung value", chargeTotal)
        return chargeTotal
    }
}