<template>
    <div class="col-4 mb-3" >
        <div class="card mx-auto">
            <h5> Brand: {{ product.brand }} </h5>
            <center><p style="padding:5px"><strong>{{ product.name }}</strong></p></center>
            <div class="card-body">
                <img width="310" height="220" v-bind:src="product.link">

                <div class="row" style="padding:5px">
                    <div class="col-sm-6">
                        <p> IDR {{product.price}}</p>
                    </div>
                    <!-- <div class="col-sm-3">
                        <router-link class="btn btn-primary" id="detail_button" :to="{name: 'product-details', params: {id: product.id}}">Coba</router-link>
                    </div> -->
                    <div class="col-sm-3">
                        <router-link class="btn btn-primary" id="detail_button" :to="'/products/' + product._id ">Detail</router-link>
                    </div>
                    <div class="col-sm-3">
                        <button class="btn btn-primary" id="buy_button" @click.prevent="addToCart(product)">Buy</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import server from '@/api/server.js';
import swal from 'sweetalert';

export default {
    props: ['product'],
    name: 'product',
    data() {
        return {
            tempPage: ''
        }
    },
    created() {
        this.tempPage = this.$route.path
        console.log("cek halaman", this.tempPage)
    },
    methods: {
        addToCart(product) {
            console.log("masuk ke methods add to cart", product)
            if (!localStorage.getItem("token")) {
                
                swal("you have to login first!", {
                buttons: ["continue browsing", "login now"]
                })
                .then(value => {
                    if (value) {
                        console.log("lokasi routing", this.tempPage)
                        this.$router.push("/login");
                    }
                });
            } else {
                this.$store.dispatch('addOneProductToCart', product)
                this.$store.dispatch('getUserCart')
            }
        },
        showDetail (input) {
            console.log("masuk ke show detail", input)
            
            this.$router.push({ path: `/${input}`  });
            server
                .get(`/products/${input}`)
                .then(({ data }) => {
                    console.log("berhasil fetch products")
                    // this.product = data;
                    this.isLoading = false;
                    // this.$store.commit('updateAllProductsState', {boolean: false})
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
};
</script>

