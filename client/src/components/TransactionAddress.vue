<template>
    <div>
        <h1><center> Thank you for shopping with us </center></h1>
        <button type="submit" class="btn btn-primary" @click.prevent="goToCart">Continue to Shopping</button>
        <button type="submit" v-if="isAddress && isDeliveryProvider && isTransactionExist" class="btn btn-success float-right" :currentTransaction="currentTransaction" @click.prevent="finishTransaction"> Finish Transaction </button>
        <hr>
        <div class="d-flex">
            <div class="col-6">
                <h3><center> Please input your delivery detail </center></h3>
                <form style="border:1px solid black" @submit.prevent="adminLogin">
                    <div class="form-group row" >
                        <div class="col-sm-6 offset-sm-3" style="padding-top:15px;">
                            <center>Street Address</center>
                            <input type="text" class="form-control" id="inputStreet" placeholder="Street Address Here" v-model="userDetail.address" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 offset-sm-3">
                            <center>City <p style="color:red"> <i class="fas fa-exclamation"></i> for delivery charge calculation </p></center>
                            <input type="text" class="form-control" id="inputCity" placeholder="Your City Here" v-model="userDetail.city" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 offset-sm-3">
                            <center>Province</center>
                            <input type="text" class="form-control" id="inputCity" placeholder="Your Province Here" v-model="userDetail.province" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class="col-sm-6 offset-sm-3">
                            <center>Zip Code</center>
                            <input type="text" class="form-control" id="inputZipCode" placeholder="Your Zipcode Here" v-model="userDetail.zipcode" required>
                        </div>
                    </div>
                    <div class="form-group row">
                        <div class=" col-sm-6 offset-sm-3" v-if="!isAddress">
                            <center><button type="submit" class="btn btn-primary" @click.prevent="updateAddress">Save Address</button></center><br>
                        </div>
                        <div class=" col-sm-6 offset-sm-3" v-if="isAddress">
                            <center><button type="submit" class="btn btn-primary" @click.prevent="updateAddress">Use This Address</button></center><br>
                        </div>
                    </div>
                    <div v-if="!isAddress">
                        <p> We need your address for delivery your item.</p>
                    </div>
                    <div v-if="isAddress">
                        <p> Your address data has been updated. Please continue to select payment type and provider on the right side</p>
                    </div>
                </form>
            </div>
            <div class="col-6">
                <form v-if="isAddress">
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Payment Type</label>
                        <select class="form-control" id="exampleFormControlSelect1" v-model="paymentType">
                            <option>Bank Transfer</option>
                            <option>Credit Card</option>
                            <option>Cash on Delivery</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlSelect1">Delivery Provider</label>
                        <select class="form-control" id="exampleFormControlSelect1" v-model="deliveryProvider">
                            <option>JNE</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary" @click.prevent="editTransactionPaymentType">Save Delivery</button>
                </form>
                <h3><center> Payment Detail </center></h3>
                <div v-if="isTransactionExist">
                    <table v-if="transaction" style="border: 1px solid black; width:100%">
                        <thead>
                            <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Sub Total</th>
                            </tr>
                        </thead>
                        <tbody v-for="(product,index) in productsCart" :key="index">
                            <tr>
                            <td>{{ product.productId.name }}</td>
                            <td>{{ product.qty }}</td>
                            <td>{{ (product.productId.price * product.qty).toLocaleString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <table style="border: 1px solid black; width:100%">
                        <tbody>
                            <tr>
                                <td> Sub-Total </td>
                                <td v-if="!transaction"> 0 </td>
                                <td v-if="transaction">IDR {{ transaction.productCharge.toLocaleString() }}</td>
                            </tr>
                            <tr>
                                <td> Delivery Charge </td>
                                <td v-if="!transaction"> Please check your address </td>
                                <td v-if="transaction"> IDR {{ transaction.deliveryCharge.toLocaleString() }}</td>
                            </tr>
                            <tr>
                                <td> Total </td>
                                <td v-if="!transaction"> 0 </td>
                                <td v-if="transaction">IDR {{ transaction.totalCharge.toLocaleString() }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <p v-if="transaction.paymentType == null"> Please select and update your payment type  and delivery provide above to continue </p>
                    <p v-if="transaction.paymentType != null"> Payment Type: {{ transaction.paymentType }} </p>
                </div>
                <button type="submit" v-if="isAddress && isDeliveryProvider && isTransactionExist" class="btn btn-success" :currentTransaction="currentTransaction" @click.prevent="finishTransaction"> Finish Transaction </button>
            </div>
        </div>
    </div>
</template>


<script>
import server from "@/api/server.js";
import axios from 'axios'
import Swal from 'sweetalert2';
import { mapState } from 'vuex'

export default {
    name: 'transactions-address',
    data() {
        return {
            paymentType: '',
            deliveryProvider: '',
            isAddress: false,
            isDeliveryProvider: false,
            isTransactionExist: false,
            currentUser:'',
            currentTransaction: ''
        }
    },
    created() {
        this.currentUser = this.userDetail
        this.$store.dispatch('getUserDetail');
    },
    computed: {
        ...mapState(['userDetail', 'productsCart', 'transaction'])
    },
    methods: {
        createTransaction () {
            server
                .post('/transactions/create', '', {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(response => {
                    console.log('new transaction berhasil dibuat', response)
                    this.$store.commit('mutateCurrentTransactionState', response.data)
                    this.currentTransaction = response.data._id
                    this.isTransactionExist = true
                })
                .catch(err => {
                    console.log("terjadi error create transaction", err)
                    Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You cant make transaction with empty cart. Shop first',
                    showConfirmButton: false,
                    timer: 1500
                    })
                })
        },
        updateAddress () {
            console.log("masuk ke update user address", this.userDetail)
            let updatedData = {
                name: this.userDetail.name,
                email: this.userDetail.email,
                address: this.userDetail.address,
                city: this.userDetail.city,
                province: this.userDetail.province,
                zipcode: this.userDetail.zipcode,
                }
            server
                .put('/users/edit', updatedData, {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(response => {
                    this.isAddress = true;
                    console.log("berhasil update data address", response.data, this.isAddress)
                    Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You have successfully updated your address to continue',
                    showConfirmButton: false,
                    timer: 1500
                    })
                    this.$store.commit('mutateUserDetailState', response.data)
                    if(!this.isTransactionExist) {
                        this.createTransaction();
                    } else {
                        this.editTransactionAddress();
                    }
                    
                })
                .catch(err => {
                    console.log(err)
                    this.isAddress = false;
                })
        },
        editTransactionAddress() {
            console.log("masuk ke update transaction karena address berubah")
            let updatedData = {changeAddress: true}
            server
                .put(`/transactions/edit/${this.currentTransaction}`, updatedData , {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(({data}) => {
                    console.log('transaction berhasil diupdate', data)
                    this.isDeliveryProvider = true;
                    this.$store.commit('mutateCurrentTransactionState', data)
                })
                .catch(err =>{
                    console.log("gagal edit transaksi", err)
                })
        },
        editTransactionPaymentType() {
            console.log("masuk ke update transaction and invoke transaction confirmation", this.paymentType, this.deliveryProvider)
            let updatedData = {}
            if (this.paymentType == 'Credit Card') {
                updatedData = {
                    paymentType: this.paymentType,
                    transactionStatus: 'Paid',
                }
            } else if (this.paymentType == 'Cash on Delivery') {
                updatedData = {
                    paymentType: this.paymentType,
                    transactionStatus: 'Waiting for Payment'
                }
            } else {
                updatedData = {
                    paymentType: this.paymentType,
                    transactionStatus: 'Waiting for Payment'
                }
            }
            
            server
                .put(`/transactions/edit/${this.currentTransaction}`, updatedData , {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(({data}) => {
                    console.log('transaction berhasil diupdate', data)
                    this.isDeliveryProvider = true;
                    this.$store.commit('mutateCurrentTransactionState', data)
                })
                .catch(err =>{
                    console.log("gagal edit transaksi", err)
                })
        },
        finishTransaction() {
            console.log("pindah ke payment")
            this.$router.push({ path: `/transactions/finish` })
            this.$store.dispatch('getAllTransactions')
        },
        goToCart() {
            console.log("balik ke payment")
            this.$router.push({ path: `/carts` })
            
        }
    }
}
</script>
