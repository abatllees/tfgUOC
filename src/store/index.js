import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import router from '../router'

import api from "@/api"

//The directus API defines tables as collections

export default createStore({
	state: {
		auth: false, //Logged?
		user: "", //Information about the logged user

		GettedElement: null,

		//Lliurament de material
		llistatLliurament: [],
		destinacio: null,

		Element: [], //It must be this name according to the collection name
		Category: null, //Category collection
		Delegacio: null, //Delegacio collection

	},
	getters: {
		getAuth: state => {
			return state.auth
		},
		getUser: state => {
			return state.user
		},
		getCategories: state => {
			return state.Category
		},
	},
	mutations: {
		HANDLE_LOGIN(state, payload) {
			return api.post("auth/login", {
				email: payload.email,
				password: payload.password
			})

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
			console.log("PAYLOAD_ADDELEMENTSLLIURAMENT:", payload)


			payload.forEach(element => {
				console.log("ELEMENT_TO_ADD", element)
			});
		},
		//Get a single item from a collection (table)
		async GET_ELEMENT(state, element) {
			let params = {
				collection: null,
				fields: "?fields=*.*.*",
				filter: null
			}
			console.log("Eement a obtenir:", element)

			await api.get("items/Element/" + element["SerialNum"] + params.fields)
				.then(response => state.GettedElement = response.data.data)
				.catch(error => console.log(error.message))
		},
		//Get all the items from a Directus collection (table)
		async GET_COLLECTION(state, payload) {
			await api.get("items/" + payload.collection + payload.fields + payload.filter)
				.then(response => {
					state[payload.collection] = response.data.data
					console.log("GET_COLLECTION", state[payload.collection])
				})
				.catch(error => console.log(error.message))
		},
		async CREATE_MOVIMENT_LLIURAMENT(state, payload) {
			console.log("ITEMS SELECTED TO UPDATE:", payload)
			this.commit("SET_UPDATE_KEYS", payload)

			//Create an array with serialNum values to update them
			let keys = []
			const iterator = state.llistatConfigurat.values()

			for (const value of iterator) {
				console.log(value.Element)
				keys.push(value.Element)
			}
			console.log(state.llistatConfigurat)
			console.log(keys)

			await this.commit("UPDATE_ELEMENT", keys)
			state.llistatLliurament = []
		},
		async UPDATE_ELEMENT(state, element) {
			console.log("UPDATE_PAYLOAD:", element)

			await api.patch("items/Element/", {
				keys: element,
				data: {
					"DelegacioActual": state.destinacio
				}
			})
				.then(response => {
					console.log(response)
					console.log("Elements updated")
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
		//Defines the payload to the POST request to create data
		SET_UPDATE_KEYS(state, payload) {
			console.log("Definint llista de lliurament:", payload)

			let llistatConfigurat = []
			for (let i = 0; i < payload.length; i++) {
				llistatConfigurat[i] = {
					Element: payload[i].SerialNum,
					Origen: payload[i].DelegacioActual.ID,  //state.llistatLliurament[i].SerialNum //We need to get the INT value of the real warehouse
					Desti: state.destinacio
				};

			}
			console.log("-------------")
			console.log(llistatConfigurat)
			console.log("-------------")
			state.llistatConfigurat = llistatConfigurat
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
		},
		handleEntrega({ commit }, llistatEntrega) {
			commit("CREATE_MOVIMENT_LLIURAMENT", llistatEntrega)
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