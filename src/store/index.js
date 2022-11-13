import { createStore } from 'vuex'
import axios from "axios"
import router from '../router'

const API_URL = "https://weekob4y.directus.app/"

/*const debugLog = (msg)=>{
	if(env.var.NODE_ENV ==='DEV') console.log(...msg)
}*/


export default createStore({
	state: {
		item: {
			Category: [],
			Subcategory: []
		},
		auth: false,
		user: null //Only if I can not save it to SessionStorage
	},
	getters: {
		getAuth: state =>{
			return state.auth
		},
		getCategories: state =>{
			return state.Category
		}		
	},
	mutations: {
		HANDLE_LOGIN(state, payload) {
			return axios.post(API_URL + "auth/login", {
				email: payload.email,
				password: payload.password
			})
				//.then(this.handleResponse)
				.then(response => {
					if (response.data.data.access_token) {

						sessionStorage.setItem("access_token", response.data.data.access_token)
						sessionStorage.setItem("expires", response.data.data.expires)
						sessionStorage.setItem("refresh_token", response.data.data.refresh_token)

						state.auth = true
						
						router.push("/")
					}
				})
				.catch(e => console.log(e.response.data))
		},
		//Get the current logged in user
		async GET_USER(state,token) {
			let URL = API_URL + "users/me?access_token=" + token
			await axios.get(URL)
				.then(response => {
					console.log(response.data.data)
					sessionStorage.setItem("user", JSON.stringify(response.data.data))
					console.log("UserObject",JSON.parse(sessionStorage.user))
				})
				.catch(error => console.log(error.message))
		},
		logout(state, payload) {
			axios.post(API_URL + "auth/logout", {
				refresh_token: payload
			})
				.then(response => {
					console.log(response)
					sessionStorage.clear()
					state.auth = false
					console.log(sessionStorage)
					router.push("/login")
				})
				.catch(error => console.log(error))
		},
		async GET_ITEM(state, payload){
			console.log("Collection to get:", payload)
			if(!state.item[payload]) return false
			const url = API_URL + "items/" + payload + "?access_token=" + sessionStorage.getItem('access_token')
			console.log(url)
			await axios.get(url)
				.then(response => {
					state.item[payload] = response.data.data
					//console.log(response.data.data)
				})
				.catch(error => console.log(error.message))
		},
	},
	actions: {
		getItem({commit}, payload, collection) {
			commit('GET_ITEM', payload, collection)
		},
		getUser({commit}, token) {
			commit('GET_USER', token)
		},
		handleLogin({commit}, credentials){
			commit('HANDLE_LOGIN',credentials)
		}
	},
	modules: {

	}
})
