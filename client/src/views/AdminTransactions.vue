<template>
    <div>
        <div v-if="userDetail.role == 'admin'">
            <router-view />
            <h2> Welcome to Admin Page </h2>

            <h1><center> Your Transaction List ({{allTransactions.length}}) </center></h1>

                <div class="row pl-5 pr-5">
                    <div class="col-md-12"> 
                        <table style="border: 1px solid black; width:100%">
                            <thead>
                                <tr>
                                <th> Order ID</th>
                                <th> Customer Name</th>
                                <th> Products</th>
                                <th> City </th>
                                <th> Product Cost (IDR) </th>
                                <th> Delivery Cost (IDR) </th>
                                <th> Total Cost (IDR) </th>
                                <th> Payment Type </th>
                                <th> Payment Status </th>
                                <th> Delivery Status </th>
                                </tr>
                            </thead>
                            <tbody v-for="transaction in allTransactions"
                                    :key="transaction._id" >
                                <tr>
                                    <td>{{ transaction._id }}</td>
                                    <td>{{ transaction.userId.name }}</td>
                                    <td> <ul v-for="product in transaction.listsProduct" :key="product._id" style="margin:0"> <li>{{product.productId.name}} (Qty: {{ product.qty }})</li> </ul> </td>
                                    <td>{{ transaction.userId.city }}</td>
                                    <td>{{ transaction.productCharge }}</td>
                                    <td>{{ transaction.deliveryCharge }}</td>
                                    <td>{{ transaction.totalCharge }}</td>
                                    <td>{{ transaction.paymentType }}</td>
                                    <td>{{ transaction.transactionStatus }}</td>
                                    <td>{{ transaction.deliveryStatus }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

        </div>
        <div v-else style="text-align: center">
            <i class="far fa-smile-wink fa-10x"></i> <br>
            <h1>Only admin can access this page </h1>
        </div>
    </div>
</template>

<script>
import server from "@/api/server.js";
import { mapState } from 'vuex'

export default {
    name: "admintransactions",
    data() {
        return {
        }
    },
    created() {
        this.$store.dispatch('getUserDetail')
        // if (this.userDetail.role == 'admin') {
            this.$store.dispatch('getAllTransactionsAdmin')
            this.$store.commit('updateAllTransactionsState', {boolean: true})
        // }
        
    },
    computed: {
        ...mapState(['userDetail', 'allTransactions', 'showAllTransactions'])
    },
}
</script>

<style scoped>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

</style>