<template>
    <div style="text-align:center;">
        <h3 v-if="!transaction.deliveryCharge">  </h3>
        <h3 v-if="transaction.deliveryCharge"> Thank you for buying the product from us. We have confirmed your transaction. </h3>


        <h5 v-if="!transaction._id" >Your Order Id: Not Exist </h5>
        <h5 v-if="transaction._id" >Your Order Id: {{ transaction._id }} </h5>
        <div v-if="transaction.paymentType == 'Bank Transfer'">
            <i class="far fa-smile-beam fa-10x"></i> <br>
            <p> Your Selected Payment Type: {{ transaction.paymentType }} </p>
            <p> Your Payment Status: {{ transaction.transactionStatus }} </p>
            
            Please transfer <strong> IDR {{ transaction.totalCharge.toLocaleString() }} </strong> to the following account: <br>
            BCA <br>
            Account Name: William Suryawan <br>
            Account Number: XXXX <br>

        </div>
        <div v-else-if="transaction.paymentType == 'Credit Card'">
            <i class="far fa-smile-beam fa-10x"></i> <br>
            Your Selected Payment Type: {{ transaction.paymentType }}<br>
            Your Payment Status: {{ transaction.transactionStatus }}<br>
            We have accepted your payment.
        </div>
        <div v-else-if="transaction.paymentType == 'Cash on Delivery'">
            <i class="far fa-smile-beam fa-10x"></i> <br>
            Your Selected Payment Type: {{ transaction.paymentType }} <br>
            Your Payment Status: {{ transaction.transactionStatus }} <br>
            
            Our delivery man will deliver your product and collect the money. <br>
            Please prepare <strong> IDR {{ transaction.totalCharge.toLocaleString() }} </strong>in cash. <br>
        </div>
        <div v-else>
            <i class="far fa-frown fa-10x"></i> <br><br>
            We can't verify your payment type and payment status.<br>
            Please review your transaction by clicking 'My Order' or contact our customer service for any assistance.
        </div>
        <hr>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'transactions-finish',
    props: ['currentTransaction'],
    computed: {
        ...mapState(['transaction'])
    },
    data() {
        return {

        }
    },
    
}
</script>
