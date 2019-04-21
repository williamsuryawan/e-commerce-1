<template>
    <div>
        <h1><center> Your Transaction Detail </center></h1>
        <div class="d-flex">
            <div class="col-6">
                <h3><center> Your Delivery Detail </center></h3>
                
            </div>
            <div class="col-6">
                <h3><center> Payment Detail </center></h3>
                <table style="border: 1px solid black; width:100%">
                    <thead>
                        <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Sub Total</th>
                        </tr>
                    </thead>
                    <tbody v-for="product in products" :key="product._id">
                        <tr>
                        <td>{{ product.productId.name }}</td>
                        <td>{{ product.qty }}</td>
                        <td>{{ product.productId.price * product.qty }}</td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <table style="border: 1px solid black; width:100%">
                    <tbody>
                        <tr>
                            <td> Sub-Total </td>
                            <td>IDR {{totalBill}}</td>
                        </tr>
                        <tr>
                            <td> Delivery Charge (Free) </td>
                            <td> IDR 0 </td>
                        </tr>
                        <tr>
                            <td> Total </td>
                            <td> IDR {{totalBill}} </td>
                        </tr>
                    </tbody>
                </table>
                <br>
                <div class="col-6 offset-sm-3">
                    <center><button type="submit" class="btn btn-primary" @click.prevent="goToCart">Continue to Shopping</button></center><br>
                    <center><button type="submit" class="btn btn-primary" @click.prevent="payNow">Pay Now</button></center><br>
                    <center><button type="submit" class="btn btn-primary" @click.prevent="emptyCart">Empty Cart</button></center>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import server from "@/api/server.js";
import swal from 'sweetalert';

export default {
    name: "transaction",
    data() {
        return {
            cart: '',
            products: [],
            totalBill: 0,
        }
    },
    created() {
        this.getOneTransaction();
    },
    methods: {
        getOneTransaction() {
            this.isLoading = true
            server
                .get(`/transaction/${this.$route.params.id}`)
                .then(({ data }) => {
                    console.log("berhasil fetch detail transaction")
                    // this.$store.dispatch('offAllProductsStatus')
                    this.product = data;
                    this.isLoading = false;
                })
                .catch((err) => {
                    console.log("error fetch detail product", err);
                })
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
    emptyCart() {
      console.log('masuk sini')
      swal({
        title: "Are you sure you want to cancel your order and clear your cart?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      })
        .then(agree => {
          if (agree) {
            return server
              .put("carts/empty",{}, {
                    headers: { token: localStorage.getItem("token")}
                    })
              .then(() => {
                this.$router.push({ path: "/carts" });
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

