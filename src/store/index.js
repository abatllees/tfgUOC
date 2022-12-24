import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import api from "@/api"

import html2pdf from "html2pdf.js";

/* eslint-disable */

export default createStore({
	state: {
		user: null, //Information about the logged user

		GettedElement: null,

		//Moviment
		llistatMoviment: [], //Elements a la taula de LliuramentView
		llistatConfiguratMoviment: [], //La mateixa llista però configurada per a la càrrega de dades a la API
		destinacio: null, //Destinació del moviment


		/*START COLLECTIONS*/
		Element: [], //Element collection
		Category: null, //Category collection
		Subcategory: null, //Category collection
		Delegacions: null, //Delegacio collection
		/*END COLLECTIONS*/


		//Styling elements
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
		},
		getLlistatConfiguratMoviment: state => {
			return state.llistatConfiguratMoviment
		}

	},
	mutations: {
		SET_LOGGED_USER(state, payload) {
			state.user = payload
		},
		//Defines the payload to the POST request to create data
		SET_UPDATE_KEYS(state, payload) {

			//Per a crear elements a la taula de lliurament cal especificar l'element, l'origen i el destí
			let updateKeysMoviment = []
			for (let i = 0; i < payload.length; i++) {
				updateKeysMoviment[i] = {
					Element: payload[i].SerialNum,
					Origen: payload[i].DelegacioActual.ID,
					Desti: state.destinacio
				};

			}
			state.llistatConfiguratMoviment = updateKeysMoviment
			console.log("Llistat configurat moviment: ", state.llistatConfiguratMoviment)
		},
	},
	actions: {
		//Obté l'usuari logat i el desa a l'state
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
		//Obté el llistat d'usuaris
		getUsers({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("users/" + payload.fields + payload.filter + payload.sort)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		getFields({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("fields/" + payload.collection + "/" + payload.field)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		//Obté els elements dins d'una col·lecció
		getCollection({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("items/" + payload.collection + payload.fields + payload.filter + payload.sort)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		//Obté només un element d'una col·lecció
		getElement({ commit }, payload) {
			return new Promise((resolve, reject) => {
				api.get("items/" + payload.collection + "/" + payload.item + payload.fields)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => reject(error))
			})
		},
		//Actualitza un únic element
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
		},
		realitzarMoviment({ commit, getters, state }, payload) {
			commit("SET_UPDATE_KEYS", payload)

			let keys = [] //Create an array with serialNum values to update them

			const iterator = getters.getLlistatConfiguratMoviment
			for (const value of iterator) {
				keys.push(value.Element)
			}
			console.log("keys", keys)

			//Crear multiples elements a la categoria moviment
			console.log("CREATE", "Moviment", ":", state.llistatConfiguratMoviment)

			return new Promise((resolve, reject) => {
				api.post("items/" + "Moviment", state.llistatConfiguratMoviment)
					.then(response => {
						console.log("Nou registre afegit a " + "Moviment")
						resolve(response)
					})
					.catch(error => reject(error.message))
					.finally(
						state.llistatMoviment = []
					)
			})
		},
		//Crea un element a una col·lecció indicada per l'usuari
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
		exportToPDF({ commit }, payload) {
			html2pdf(document.getElementById(payload.idItem), payload.options);
		},
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