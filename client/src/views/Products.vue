<template>
    <div class="d-flex">
      <div class="bg-light border-right col-sm-2 scrollable-menu" id="sidebar">
          Available Products:
          <ul class="list-group" v-for="product in products" :key="product.id">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              {{ product.name }}
              <span class="badge badge-primary badge-pill"> {{ product.stock }}</span>
            </li>
          </ul>
      </div>
      <div class="col-sm-10" id="page-content">
        <h3>Our Product List:</h3>
        <router-view />
        <div class="row" v-if="showAllProducts">
            <product
                v-for="product in products"
                :product="product"
                :key="product.id" />
        </div>
      </div>
    </div>
</template>

<script>
import Product from '@/components/Product.vue';
import { mapState } from 'vuex'

export default {
    name: 'products',
    components: {
        Product,
    },
    created() {
        this.$store.dispatch('getAllProducts')
        this.$store.commit('updateAllProductsState', {boolean: true})
    },
    computed: {
        ...mapState(['products', 'showAllProducts'])
    }
}
</script>


