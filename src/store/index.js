import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import router from '../router'

import api from "@/api"

export default createStore({
	state: {
		auth: false,
		user: null, //Only if I can not save it to SessionStorage
		Category: null,
		Element: "",
		elementLliurament: [{
			NumMag: "NumMag",
			Subcategory: "Subcat",
			Marca: "Marca",
			Model: "Model",
			SerialNum: "SerialNum",
			DelegacioActual: "DelAct",
		}]
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
		async GET_USERS(state) {
			await api.get("/users")
				.then(response => state.users = response.data.data)
				.catch(error => console.log(error.message))
		},
		async logout(state, payload) {
			await api.post("auth/logout", {
				refresh_token: payload
			})
				.then(response => {
					console.log(response)
					localStorage.clear()
					state.auth = false
					state.user = null
					router.push("/login")
				})
				.catch(error => {
					if (error.response.data.errors[0].extensions.code == "TOKEN_EXPIRED") {
						console.log(error.response.data.errors[0].extensions.code)
						this.commit("REFRESH_TOKEN")
					}
				})
		},
		ADD_ELEMENTS_LLIURAMENT(state, payload) {
			console.log(state)
			console.log("GetList:", payload)
			this.commit("GET_ELEMENT", payload)
		},
		async GET_ELEMENT(state, array) {
			let params = {
				collection: null,
				fields: "?fields=*.*.*",
				filter: null
			}
			await array.forEach(element => {
				console.log("Element seleccionat:", element.SerialNum)
				api.get("items/Element/" + element.SerialNum + params.fields)
					.then(response => {
						console.log(response.data.data)
						state.elementLliurament.push({
							NumMag: response.data.data.NumMag,
							Subcategory: response.data.data.Model.Subcategory.SubcategoryName,
							Marca: response.data.data.Model.Brand.BrandName,
							Model: response.data.data.Model.ModelName,
							SerialNum: response.data.data.SerialNum,
							DelegacioActual: response.data.data.DelegacioActual.Name,
						})
						console.log("ElementLliurament", state.elementLliurament)

					})
					.catch(error => console.log(error.message))
			});
		},
		async GET_COLLECTION(state, payload) {
			await api.get("items/" + payload.collection + payload.fields + payload.filter)
				.then(response => {
					state[payload.collection] = response.data.data
					console.log(state[payload.collection])
				})
				.catch(error => console.log(error.message))
		},
		async REFRESH_TOKEN() {
			await api.post("auth/refresh")
				.then(response => {
					localStorage.setItem("refresh_token", response.data.data.refresh_token)
				})
				.catch(error => console.log(error.response.data.errors))
		},
	},
	actions: {
		getUser({ commit }, token) {
			commit('GET_USER', token)
		},
		handleLogin({ commit }, credentials) {
			commit('HANDLE_LOGIN', credentials)
		},
		getCollection({ commit }, payload) {
			commit('GET_COLLECTION', payload)
		},
		getUsers({ commit }) {
			commit("GET_USERS")
		},
		addElementLliurament({ commit }, element) {
			commit("ADD_ELEMENTS_LLIURAMENT", element)
		}
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