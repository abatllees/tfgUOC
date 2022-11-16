import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import router from '../router'

import api from "@/api"

//const API_URL = "https://weekob4y.directus.app/"
//axios.baseURL = "https://weekob4y.directus.app/"
/*const debugLog = (msg)=>{
	if(env.var.NODE_ENV ==='DEV') console.log(...msg)
}*/


export default createStore({
	state: {
		auth: false,
		user: null //Only if I can not save it to SessionStorage
	},
	getters: {
		getAuth: state => {
			return state.auth
		},
		getCategories: state => {
			return state.Category
		}
	},
	mutations: {
		HANDLE_LOGIN(state, payload) {
			return api.post("auth/login", {
				email: payload.email,
				password: payload.password
			})
				//.then(this.handleResponse)
				.then(response => {
					if (response.data.data.access_token) {

						localStorage.setItem("access_token", response.data.data.access_token)
						localStorage.setItem("expires", response.data.data.expires)
						localStorage.setItem("refresh_token", response.data.data.refresh_token)
						state.auth = true
						this.commit("GET_USER")
						router.push("/")
					}
				})
				.catch(e => console.log(e.response.data))
		},
		//Get the current logged in user
		async GET_USER(state) {
			let URL = "users/me"
			await api.get(URL)
				.then(response => {
					state.user = response.data.data
					localStorage.setItem("user", JSON.stringify(state.user))

				})
				.catch(error => console.log(error.message))
		},
		logout(state, payload) {
			api.post("auth/logout", {
				refresh_token: payload
			})
				.then(response => {
					console.log(response)
					localStorage.clear()
					state.auth = false
					state.user = null
					router.push("/login")
				})
				.catch(error => console.log(error))
		},
		async GET_ITEM(state, payload) {
			console.log("Collection to get:", payload["collection"])

			let parameters = {
				collection: payload,
				filter: "?filter[status][_eq]=published"
			}

			await api.get("items/" + parameters["collection"] + parameters["filter"])
				.then(response => {
					state[payload] = response.data.data
					console.log(response.data.data)
				})
				.catch(error => console.log(error.message))
		},
	},
	actions: {
		getItem({ commit }, payload) {
			commit('GET_ITEM', payload)
		},
		getUser({ commit }, token) {
			commit('GET_USER', token)
		},
		handleLogin({ commit }, credentials) {
			commit('HANDLE_LOGIN', credentials)
		}
	},
	modules: {

	},
	plugins: [
		new VuexPersistence({
			storage: window.localStorage,
			reducer: (state) => ({
				auth: state.auth,
				user: state.user
			})
		}).plugin
	]
})
