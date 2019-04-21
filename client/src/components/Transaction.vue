<template>
    <div>
        <div class="row rounded border-success" style="background: rgba(105,105,105, 0.8)">    
            <br>
            <div class="col-md-2 col-sm-3 text-center" >
                <a class="story-img" href="#">
                    <img v-if="transaction.listsProduct[0].productId.link" :src="transaction.listsProduct[0].productId.link" style="width:120px;height:120px; padding-top: 20px" class="rounded-circle">
                    <img v-if="!transaction.listsProduct[0].productId.link" src="../assets/no_img.jpg" style="width:120px;height:120px; padding-top: 20px" class="rounded-circle">
                </a>
            </div>
            <div class="col-md-10 col-sm-9" style="color:white">
                <h3>Order Id: {{transaction._id}}</h3>
                <div class="row">
                    <div class="col-sm-12">
                        <p><strong>Products:</strong> <p v-for="(product,index) in transaction.listsProduct" :key="index">{{ product.productId.name }}</p>
                        <p><strong>Delivery Charge:</strong> {{ transaction.deliveryCharge }} </p>
                        <p><strong>Payment Type:</strong> {{ transaction.paymentType }} </p>
                        
                        <p><strong>Transaction Status:</strong> {{ transaction.transactionStatus }} </p>
                        <p><strong>Delivery Status:</strong> {{ transaction.deliveryStatus }} </p>
                        <ul class="list-inline">
                            <li class="list-inline-item" v-if="transaction.transactionStatus == 'Waiting for Payment' || transaction.transactionStatus == null"><button type="button" class="btn btn-warning btn-sm" @click.prevent="updateTransactionStatus(transaction._id)"> <i class="fas fa-comment-dollar"></i> Pay Now</button> </li>
                            <li class="list-inline-item"><router-link class="btn btn-primary btn-sm" id="detail_button" :to="'/transactions/' + transaction._id "> <i class="fas fa-info-circle"></i> See Detail </router-link></li>
                            <li class="list-inline-item"><a target="_blank" class="fb-xfbml-parse-ignore" style="color:white"><button type="button" class="btn btn-primary btn-sm" @click.prevent="updateDeliveryStatus(transaction)"><i class="fas fa-calendar-check"></i> Confirm Accept </button> </a></li>
                        </ul>
                    </div>
                </div>
                <br><br>
            </div>
        </div>
        <hr style="background-color:black; height: 2px;">   
    </div>
</template>

<script>
import server from "@/api/server.js";
import Swal from 'sweetalert2';

export default {
    name: 'transaction',
    props: ['transaction'],
    methods: {
        updateTransactionStatus(inputId) {
            console.log("masuk ke update transaction status", inputId)
            let updatedData = {transactionStatus: 'Paid'}
            server
                .put(`/transactions/edit/${inputId}`, updatedData , {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(({data}) => {
                    console.log('transaction berhasil update payment status', data)
                    Swal.fire({
                    position: 'top-end',
                    type: 'success',
                    title: 'Thank you for paying!',
                    showConfirmButton: false,
                    timer: 1500
                    })
                    this.$store.dispatch('getAllTransactions')
                })
                .catch(err =>{
                    console.log("gagal edit transaksi", err)
                })
        },
        updateDeliveryStatus(input) {
            if (input.transactionStatus == 'Paid') {
                let updatedData = {deliveryStatus: 'Received'}
                server
                    .put(`/transactions/edit/${input._id}`, updatedData , {headers: {
                            token: localStorage.getItem("token")
                        }
                    })
                    .then(({data}) => {
                        console.log('transaction berhasil update delivery status', data)
                        Swal.fire({
                        position: 'top-end',
                        type: 'success',
                        title: 'Thank you for shopping us!',
                        showConfirmButton: false,
                        timer: 1500
                        })
                        this.$store.dispatch('getAllTransactions')
                    })
                    .catch(err =>{
                        console.log("gagal edit transaksi", err)
                    })
            } else {
                Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You need to pay first! Please click Pay Now if you have paid.',
                    showConfirmButton: false,
                    timer: 1500
                    })
            }
        }
    }
}
</script>


