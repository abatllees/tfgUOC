import { createStore } from 'vuex'
import axios from "axios"

import router from '../router'

const API_URL = "https://weekob4y.directus.app/"

export default createStore({
	state: {
		Category: null,
		element: null
	},
	getters: {
		getLogin(state) {
			return state.login
		},
		getCategories(state) {
			return state.Category
		}
	},
	mutations: {
		login(state, payload) {
			return axios.post(API_URL + "auth/login", {
				email: payload.email,
				password: payload.password
			})
				//.then(this.handleResponse)
				.then(response => {
					if (response.data.data.access_token) {
						localStorage.setItem('token', JSON.stringify(response.data.data))
						this.commit("getUser")
						router.push("/")
					}
				})
				.catch(e => console.log(e.response.data))
		},
		//Get the current logged in user
		async getUser() {
			let URL = API_URL + "users/me?access_token=" + JSON.parse(localStorage.getItem('token')).access_token
			await axios.get(URL)
				.then(response => {
					localStorage.setItem("user", response.data.data)
				})
				.catch(error => console.log(error.message))
		},
		async getItem(state, item) {
			let URL = API_URL + "items/" + item + "?access_token=" + JSON.parse(localStorage.getItem('token')).access_token
			await axios.get(URL)
				.then(response => {
					this.state.item = response.data.data
					console.log(this.state.item)
					console.log("item", item)
				})
				.catch(error => console.log(error.message))
		},
		logout(state, payload) {
			axios.post(API_URL + "auth/logout", {
				refresh_token: payload
			})
				.then(response => {
					console.log(response)
					localStorage.removeItem('token')
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
