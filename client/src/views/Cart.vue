<template>
    <div>
        <br>
        <div class="container">
            <div class="row">
                <div class="col-sm-4">
                    <h2>Cart Summary</h2>
                </div>
                <div class="col-sm-4">
                    
                </div>
                <div class="col-sm-4">
                    <button type="button" class="btn btn-outline-danger" data-toggle="modal" @click.prevent="emptyCart">Empty Cart</button>
                    <button type="button" class="btn btn-success" data-toggle="modal" data-target="#checkOutModal">Check-Out</button>
                </div>
            </div>
        </div>
        
        <ul>
            <li style="list-style-type:none">
                <div v-for="product in productsCart" :key="product._id">
                <div class="container col-12" style="background-color: rgb(209, 209, 209); color: black; padding:10px">    
                    <div class="row">
                        <div class="col-sm-2">
                            <img v-bind:src="product.productId.link" width="130" height="100">
                        </div>
                        <div class="col-sm-5 offset-sm-2" style="padding:0px">
                            <a href="#">
                            <h5>{{product.productId.name}}</h5></a>
                            <h6>Amount to Buy: {{product.qty}}</h6>
                            <h6>SubTotal: {{product.productId.price * product.qty}} </h6>

                        </div>
                        
                        <div class="col-sm-3" style="padding:30px">
                            
                            <button class="btn btn-primary" id="add_button" @click.prevent="addAmount(product.productId)">+</button>
                            <button class="btn btn-primary" id="add_button" @click.prevent="redAmount(product.productId)">-</button>
                        </div>   
                    </div>
                </div>

                </div>
            </li>
        </ul>

        <!-- Modal for CheckOut and Emptying Cart -->
        <div class="modal fade" id="checkOutModal" tabindex="-1" role="dialog" aria-labelledby="newTaskCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">Checkout to Payment</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                </div>
                <div class="modal-body">
                    <p> You will be directed to payment page (Please do not refresh on payment page)</p> <br>
                    <button type="submit" class="btn btn-primary" @click.prevent="goToCheckOut" data-dismiss="modal">Continue to Payment</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Continue Shopping</button>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import server from "@/api/server.js";
import swal from 'sweetalert';
import Swal from 'sweetalert2';
import { mapState } from 'vuex'

export default {
    name: 'cart',
    data() {
        return {
            carts: '',
            products: [],
        }
    },
    computed: {
        ...mapState(['productsCart', 'userDetail']),
    },
    created() {
        this.$store.dispatch('getUserCart')
        this.$store.commit('updateAllProductsState', {boolean: false})
    },
    methods: {
        addAmount (product) {
            console.log("masuk sini ke method add produk:", product)
            if (!localStorage.getItem("token")) {
                swal("you have to login first!", {
                buttons: ["continue browsing", "login now"]
                }).then(value => {
                if (value) this.$router.push("/login");
                });
            } else {
                server
                .post("/carts", {
                        _id: product._id,
                        amount: 1},
                    { headers: {
                        token: localStorage.getItem("token")
                    }})
                .then(({ data }) => {
                    console.log("berhasil nambah barang")
                    this.$store.dispatch('getUserCart')
                    this.calculateTotalBill();
                })
                .catch(({ response }) => {
                    console.error(response);
                });
            }
        },
        redAmount (product) {
            console.log("masuk sini ke method minus produk:", product)
                if (!localStorage.getItem("token")) {
                    swal("you have to login first!", {
                    buttons: ["continue browsing", "login now"]
                    }).then(value => {
                    if (value) this.$route.push("/login");
                    });
                } else {
                    server
                        .post("/carts", {
                            _id: product._id,
                            amount: -1
                            },
                            {headers: {
                                token: localStorage.getItem("token")
                            }})
                        .then(({ data }) => {
                            console.log("berhasil kurangi barang")
                            this.$store.dispatch('getUserCart')
                        })
                        .catch(({ response }) => {
                            console.error(response);
                        });
                }
        },
        goToCheckOut () {
            this.$store.dispatch('getUserDetail')
            if (!this.userDetail.address || !this.userDetail.city || !this.userDetail.province) {
                Swal.fire({
                    position: 'top-end',
                    type: 'info',
                    title: 'You need to update your address to continue',
                    showConfirmButton: false,
                    timer: 1500
                })
                console.log("masuk ke edit address sebelum finish transaction")
                this.$router.push({ path: "/transactions/address" })
            } else {
                this.$router.push({ path: "/transactions/address" });
            }
        },
        emptyCart() {
            console.log('masuk method empty cart')
            swal({
                title: "Are you sure you want to cancel your order and clear your cart?",
                icon: "warning",
                buttons: true,
                dangerMode: true
            })
                .then(agree => {
                if (agree) {
                    return server
                                .put("carts/empty", '', {
                                        headers: { token: localStorage.getItem("token")}
                                        })
                                .then(() => {
                                    this.$store.dispatch('getUserCart')
                                    Swal.fire({
                                        position: 'top-end',
                                        type: 'success',
                                        title: 'You have emptied your cart',
                                        showConfirmButton: false,
                                        timer: 1500
                                    })
                                });
                }
                })
                .catch(({ response }) => {
                console.error(response);
                });
        },
    }
}
</script>