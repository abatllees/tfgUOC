import { createStore } from 'vuex'
import axios from "axios"

import router from '../router'

const API_URL = "https://weekob4y.directus.app/"

export default createStore({
  state: {
	login: false

  },
  getters: {
	getLogin(state){
		return state.login
	}
  },
  mutations: {
	login(state, payload){
		return axios.post(API_URL+"auth/login",{
			email: payload.email,
			password: payload.password
		})
		//.then(this.handleResponse)
		.then(response =>{
			if(response.data.data.access_token){
				localStorage.setItem('user',JSON.stringify(response.data.data))
				this.state.login = true
				router.push("/")
			}
		})
		.catch(e => console.log(e.response.data))
	},
	logout(state, payload){
		axios.post(API_URL+"auth/logout",{
			refresh_token: payload
		})
		.then(response => {
			console.log(response)
			localStorage.removeItem('user')
			this.state.login = false
			router.push("/login")
		})
		.catch(error => console.log(error))
	}
  },
  actions: {

  },
  modules: {

  }
})
