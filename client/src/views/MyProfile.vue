<template>
    <div class="container">
        My Profile List
        
        <form v-if="!isEditProfile">
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.name">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                <input type="email" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.email">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Address</label>
                <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.address">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">City</label>
                <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.city">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Province</label>
                <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.province">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Zip Code</label>
                <div class="col-sm-10">
                <input type="text" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.zipcode">
                </div>
            </div>
            <router-link to="/products/" style="color:black"> <button type="submit" class="btn btn-warning">Shop Again </button> </router-link>
            <button type="submit" class="btn btn-primary" @click.prevent="goToEdit">Edit Profile </button>
        </form>

        <form v-if="isEditProfile">
            <div class="form-group row">
                <label for="staticName" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                <input type="text" class="form-control" id="staticName" v-model="userDetail.name">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Email <i class="fas fa-exclamation"></i> You need to contact us to change this </label> 
                <div class="col-sm-10">
                <input type="email" readonly class="form-control-plaintext" id="staticEmail" v-model="userDetail.email">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticAddress" class="col-sm-2 col-form-label">Address</label>
                <div class="col-sm-10">
                <input type="text" class="form-control" id="staticAddress" v-model="userDetail.address">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticCity" class="col-sm-2 col-form-label">City</label>
                <div class="col-sm-10">
                <input type="text" class="form-control" id="staticCity" v-model="userDetail.city">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticProvince" class="col-sm-2 col-form-label">Province</label>
                <div class="col-sm-10">
                <input type="text" class="form-control" id="staticProvince" v-model="userDetail.province">
                </div>
            </div>
            <div class="form-group row">
                <label for="staticZipcode" class="col-sm-2 col-form-label">Zip Code</label>
                <div class="col-sm-10">
                <input type="text" class="form-control" id="staticZipcode" v-model="userDetail.zipcode">
                </div>
            </div>
            
            <router-link to="/myprofile/" style="color:black"> <button type="submit" class="btn btn-danger"> Cancel </button> </router-link>
            <button type="submit" class="btn btn-primary" @click.prevent="updateProfile">Edit Profile </button>
        </form>
    </div>
</template>

<script>
import server from "@/api/server.js";
import Swal from 'sweetalert2';
import Transaction from '@/components/Transaction.vue';
import { mapState } from 'vuex'

export default {
    name: 'myprofile',
    created() {
        this.$store.dispatch('getUserDetail');
    },
    data() {
        return {
            isEditProfile: false
        }
    },
    computed: {
        ...mapState(['userDetail'])
    },
    methods: {
        goToEdit() {
            this.isEditProfile= true;
        },
        updateProfile () {
            console.log("masuk ke update user address", this.userDetail)
            let updatedData = {
                name: this.userDetail.name,
                email: this.userDetail.email,
                address: this.userDetail.address,
                city: this.userDetail.city,
                province: this.userDetail.province,
                zipcode: this.userDetail.zipcode,
                }
            server
                .put('/users/edit', updatedData, {headers: {
                        token: localStorage.getItem("token")
                    }
                })
                .then(response => {
                    this.$store.commit('mutateUserDetailState', response.data)
                    console.log("berhasil update data address", response.data)
                    Swal.fire({
                        position: 'top-end',
                        type: 'info',
                        title: 'You have successfully updated your profile.',
                        showConfirmButton: false,
                        timer: 1500
                        })
                    this.isEditProfile= false;
                    
                })
                .catch(err => {
                    console.log(err)
                    Swal.fire({
                        position: 'top-end',
                        type: 'error',
                        title: 'You have not successfully updated your profile.',
                        showConfirmButton: false,
                        timer: 1500
                        })
                    this.isEditProfile= false;
                })
        }
    }
}
</script>
