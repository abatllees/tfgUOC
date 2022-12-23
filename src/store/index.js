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
		llistatMoviment: [],
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


		},
		ADD_ELEMENTS_MOVIMENT(state, payload) {
			console.log("PAYLOAD ADDELEMENTS MOVIMENT:", payload)
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
		async CREATE_MOVIMENT(state, payload) {
			this.commit("SET_UPDATE_KEYS", payload)

			let keys = [] //Create an array with serialNum values to update them
			const iterator = state.llistatConfigurat.values()

			for (const value of iterator) {
				console.log(value.Element)
				keys.push(value.Element)
			}
			console.log("keys", keys)

			await this.commit("CREATE_ITEM", "Moviment")
			state.llistatMoviment = []
		},
		async CREATE_ITEM(state, collection) {
			console.log("CREATE", collection, ":", state.llistatConfigurat)

			return new Promise((resolve, reject) => {
				api.post("items/" + collection, state.llistatConfigurat)
					.then(response => {
						console.log(response)
						console.log("Nou registre afegit a " + collection)
						resolve(response)
					})
					.catch(error => reject(error.message))
			})

		},
		//Defines the payload to the POST request to create data
		SET_UPDATE_KEYS(state, payload) {

			//Per a crear elements a la taula de lliurament cal especificar l'element, l'origen i el destí
			let llistatConfigurat = []
			for (let i = 0; i < payload.length; i++) {
				llistatConfigurat[i] = {
					Element: payload[i].SerialNum,
					Origen: payload[i].DelegacioActual.ID, //We need to get the INT value of the warehouse
					Desti: state.destinacio //Define the destination of the element
				};

			}
			state.llistatConfigurat = llistatConfigurat
			console.log("Llistat configurat moviment: ", llistatConfigurat)
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
		getFields({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("fields/" + payload.collection + "/" + payload.field)
					.then(response => {
						//console.log(response.data.data)
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		getUsers({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("users/" + payload.fields + payload.filter + payload.sort)
					.then(response => {
						console.log(response.data.data)
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		addElementLliurament({ commit }, element) {
			commit("ADD_ELEMENTS_MOVIMENT", element)
		},
		realitzarMoviment({ commit }, llistatEntrega) {
			commit("CREATE_MOVIMENT", llistatEntrega)
		},
		getElement({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("items/" + payload.collection + "/" + payload.item + payload.fields)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		createItem({ commit }, payload) {
			console.log("CREATE", payload.collection, ":", payload.values)
			return new Promise((resolve, reject) => {
				api.post("items/" + payload.collection, payload.values)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error.message))
			})
		},
		updateItem({ commit }, payload) {
			console.log("Update item:", payload)
			const newValues = {
				"NumMag": payload.NumMag,
				"status": payload.status,
				"Observacions": payload.Observacions
			}
			return new Promise((resolve, reject) => {
				api.patch("items/" + payload.collection + "/" + payload.SerialNum, newValues)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => {
						reject(error)
						console.log(error.response.data.errors)
					})
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