import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import api from "@/api"

//The directus API defines tables as collections

/* eslint-disable */

export default createStore({
	state: {
		user: null, //Information about the logged user

		GettedElement: null,

		//Lliurament de material
		llistatLliurament: [],
		destinacio: null,

		Element: [], //It must be this name according to the collection name
		Category: null, //Category collection
		Subcategory: null, //Category collection
		Delegacions: null, //Delegacio collection


		Moviment: [],
		//Color for the tables
		themeColor: "#bb0000"

	},
	getters: {
		getUser: state => {
			return state.user
		},
		getCategory: state => {
			return state.Category
		},
		getSubcategory: state => {
			return state.Subcategory
		},
		getDelegacions: state => {
			return state.Delegacions
		},
		getSingleDelegacio: (state, DelegacioID) => {
			return state.Delegacions.filter(Delegacio => Delegacio.ID = DelegacioID)
		}
	},
	mutations: {
		//Get the current logged in user
		SET_LOGGED_USER(state, payload) {
			state.user = payload
		},
		async GET_USERS(state, payload) {
			await api.get("/users" + payload.sort)
				.then(response => {
					state.users = response.data.data
				})
				.catch(error => console.log(error.message))
		},
		ADD_ELEMENTS_LLIURAMENT(state, payload) {
			console.log("PAYLOAD_ADDELEMENTSLLIURAMENT:", payload)
			payload.forEach(element => {
				console.log("ELEMENT_TO_ADD", element)
			});
		},
		async GET_HEADERS(state, payload) {
			console.log(payload)
			await api.get("fields/" + payload)
				.then(response => {
					state[payload.collection] = response.data.data
					console.log("GET_COLLECTION_FIELDS", state[payload.collection])

				})
				.catch(error => console.log(error.message))
		},
		async CREATE_MOVIMENT_LLIURAMENT(state, payload) {
			console.log("ITEMS SELECTED TO UPDATE:", payload)
			this.commit("SET_UPDATE_KEYS", payload)

			let keys = [] //Create an array with serialNum values to update them
			const iterator = state.llistatConfigurat.values()

			for (const value of iterator) {
				console.log(value.Element)
				keys.push(value.Element)
			}
			console.log(state.llistatConfigurat)
			console.log(keys)

			//await this.commit("UPDATE_ELEMENT", keys)
			await this.commit("CREATE_ITEM", { elements: keys, collection: "Moviment" })
			state.llistatLliurament = []
		},
		async CREATE_ITEM(state, payload) {
			console.log("CREATE", payload.collection, ":", payload.elements)
			console.log("Llistat configurat", state.llistatConfigurat)

			await api.post("items/" + payload.collection, state.llistatConfigurat)
				.then(response => {
					console.log(response)
					console.log("Moviment creat")
				})
				.catch(error => console.log(error))

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
					alert("Elements updated")
				})
				.catch(error => console.log(error.message))
		},
		async REFRESH_TOKEN() {
			await api.post("auth/refresh")
				.then(response => {
					sessionStorage.setItem("refresh_token", response.data.data.refresh_token)
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
					Origen: payload[i].DelegacioActual.ID, //We need to get the INT value of the real warehouse
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
		getUser({ commit }) {
			return new Promise((resolve, reject) => {
				api.get("users/me")
					.then(response => {
						commit('SET_LOGGED_USER', response.data.data)
						sessionStorage.setItem("user", JSON.stringify(response.data.data))
						resolve(response.data.data)
					})
					.catch(error => reject(error.message))
			})
		},
		getCollection({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("items/" + payload.collection + payload.fields + payload.filter + payload.sort)
					.then(response => {
						console.log(response.data.data)
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		getHeaders({ commit }, payload) {
			commit('GET_HEADERS', payload)
		},
		getUsers({ commit }, sortingOrder) {
			return new Promise((resolve, reject) => {
				api.get("users/" + sortingOrder)
					.then(response => {
						console.log(response.data.data)
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		addElementLliurament({ commit }, element) {
			commit("ADD_ELEMENTS_LLIURAMENT", element)
		},
		realitzarLliurament({ commit }, llistatEntrega) {
			commit("CREATE_MOVIMENT_LLIURAMENT", llistatEntrega)
		},
		getElement({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("items/" + payload.collection + "/" + payload.item + payload.fields)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		}
	},
	plugins: [
		new VuexPersistence({
			storage: window.sessionStorage,
			reducer: (state) => ({
				user: state.user,
				Subcategory: state.Subcategory,
				Delegacions: state.Delegacions
			})
		}).plugin
	]
})