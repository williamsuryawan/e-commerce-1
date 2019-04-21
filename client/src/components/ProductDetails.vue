<template>
    <div>
        Masuk product detail
        <div v-if="isLoading">
            <p>Please wait</p>
        </div>
        <div class="container" v-else>
            <div>
                <img :src="product.link">
                <h1> Product Name: {{ product.name }} </h1>
                <h3> Price: {{ product.price }} </h3>
                <h3> Stock Available: {{ product.stock }} </h3>
            </div>
            <div>
            <button class="btn btn-primary" id="buy_button"> <router-link to="/products"> Back </router-link></button>
            <button class="btn btn-primary" id="buy_button" @click.prevent="addToCart(product)">Buy</button>
            <router-view />
            </div>
        </div>
    </div>
</template>

<script>
import server from '@/api/server.js';

export default {
    name: 'product-details',
    data() {
        return {
            product: {},
            isLoading: true,
            tempPage: ''
        }
    },
    methods: {
        fetchProduct() {
            this.isLoading = true
            server
                .get(`/products/${this.$route.params.id}`)
                .then(({ data }) => {
                    console.log("berhasil fetch detail product")
                    // this.$store.dispatch('offAllProductsStatus')
                    this.product = data;
                    this.isLoading = false;
                })
                .catch((err) => {
                    console.log("error fetch detail product", err);
                })
        }
    },
    mounted() {
        this.fetchProduct();
        this.$store.commit('updateAllProductsState', {boolean: false})
        console.log("masuk ke product detail")
        this.tempPage = this.$route.path
        console.log("cek halaman", this.tempPage)
    }
}
</script>
