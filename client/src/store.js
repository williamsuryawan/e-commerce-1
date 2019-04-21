import Vue from 'vue';
import Vuex from 'vuex';
import server from '@/api/server.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
    showAllProducts: true,
    showProductsDetail: false,
    products: [],
    carts: '',
    productsCart: [],
    userDetail: {},
    transaction: {},
    allTransactions: [],
    showAllTransactions: true
  },
  mutations: {
    updateLoginState(state, payload) {
      state.isLogin = payload.boolean;
    },
    updateAllProductsState(state, payload) {
      state.showAllProducts = payload.boolean
    },
    updateProductsDetailState(state, payload) {
      state.showProductsDetail = payload.boolean
    },
    mutateProductsState(state, payload){
      console.log("dalam mutation get all products", payload)
      state.products = payload
    },
    mutateCartState(state, payload){
      console.log("dalam mutation manage cart", payload)
      state.carts = payload
    },
    mutateCartProductState(state, payload){
      console.log("dalam mutation manage product dalam cart", payload.data[0].listsProduct)
      state.productsCart = payload.data[0].listsProduct
    },
    mutateUserDetailState(state, payload){
      console.log("dalam mutation user detail", payload)
      state.userDetail = payload
    },
    mutateCurrentTransactionState(state, payload){
      console.log("dalam mutation current transaction", payload)
      state.transaction = payload
    },
    mutateAllTransactionsState(state, payload){
      console.log("dalam mutation get all transactions", payload)
      state.allTransactions = payload
    },
    updateAllTransactionsState(state, payload) {
      state.showAllTransactions = payload.boolean
    },
  },
  actions: {
    getAllProducts({ commit }) {
      // state.products=[]
        server
          .get('/products')
          .then(({ data }) => {
              console.log("berhasil get all products", data)
              commit('mutateProductsState', data)
          })
          .catch(err => {
              console.log("terjadi error get all products", err)
              console.log(err)
          })
    },
    getUserCart({commit}) {
      console.log("masuk action ke show cart")
      server
        .get("/carts", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log("cart ditemukan dari server", data)
          commit('mutateCartProductState', data)
          // this.carts = data.data;
          // this.products = data.data[0].listsProduct;
          // this.products.forEach(product => {
          //     console.log("Hasil looping===> ", product.productId.price * product.qty)
          //     this.totalBill += product.productId.price * product.qty;
          // })
        })
        .catch(({ response }) => {
          console.log(response);
        });
    },
    getAllTransactions({commit}) {
      server
        .get("/transactions", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log("transaction ditemukan dari server", data)
          commit('mutateAllTransactionsState', data.data)
        })
        .catch(err => {
          console.log(err);
        });
    },
    getAllTransactionsAdmin({commit}) {
      server
        .get("/transactions/all", {
          headers: {
            token: localStorage.getItem("token")
          }
        })
        .then(({ data }) => {
          console.log("transaction ditemukan dari server", data)
          commit('mutateAllTransactionsState', data.data)
        })
        .catch(err => {
          console.log(err);
        });
    },
    addOneProductToCart ({commit}, payload) {
      console.log("masuk ke action add to cart", commit, payload)
      server
        .post("/carts", {
            _id: payload._id,
            amount: 1 },
            { headers: {
                token: localStorage.getItem("token")
            }})
        .then(({ data }) => {
            console.log("Action Add to Cart: berhasil add to cart", data)
            commit('mutateCartState', data)
            // this.$router.push({ path: "/carts" });
        })
        .catch(({ response }) => {
            console.log(response);
        });
    },
    addManyProductToCart ({commit}, payload) {

    },
    getUserDetail ({commit}) {
      console.log("masuk action ke user detail")
      server
        .get("/users/detail", {headers: {
            token: localStorage.getItem("token")}
        })
        .then(({ data }) => {
          console.log("berhasil get user detail", data.data)
          commit('mutateUserDetailState', data.data)
        })
        .catch(err => {
          console.log("terjadi error get user detail", err)
          console.log(err)
      })
    },
  },
});
