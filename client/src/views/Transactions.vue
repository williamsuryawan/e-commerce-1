<template>
    <div>
        <router-view />
        <h1><center> Your Transaction List ({{allTransactions.length}}) </center></h1>
        <div class="container">
            <div class="row">
                <div class="col-md-12"> 
                    <div class="card bg-transparent">
                        <div class="card-body" > 
                            <transaction
                                v-for="transaction in allTransactions"
                                        :transaction="transaction"
                                        :key="transaction._id" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import server from "@/api/server.js";
import swal from 'sweetalert';
import Transaction from '@/components/Transaction.vue';
import { mapState } from 'vuex'

export default {
    name: "transactions",
    components: {
        Transaction,
    },
    data() {
        return {
            cart: '',
            products: [],
            totalBill: 0,
        }
    },
    created() {
        this.$store.dispatch('getAllTransactions')
        this.$store.commit('updateAllTransactionsState', {boolean: true})
    },
    computed: {
        ...mapState(['allTransactions', 'showAllTransactions'])
    },
    methods: {
        getUserCart() {
        console.log("masuk ke show cart for checkout")
        server
            .get("/carts", {
            headers: {
                token: localStorage.getItem("token")
            }
            })
            .then(({ data }) => {
            this.totalBill = 0;
            console.log("cart ditemukan dari server")
            this.carts = data.data;
            this.products = data.data[0].listsProduct;
            this.products.forEach(product => {
                console.log("Hasil looping===> ", product.productId.price * product.qty)
                this.totalBill += product.productId.price * product.qty;
            })
            })
            .catch(({ response }) => {
            console.error(response);
            });
    },
    goToCart () {
        this.$router.push({ path: "/carts" });
    },
    payNow () {
        swal({
            position: 'top-end',
            icon: 'success',
            title: `Thank you for shopping with us. Please transfer IDR ${this.totalBill} to our bank account BCA William Suryawan 4731019481`,
            button: true,
        })
    },
    }
}
</script>

