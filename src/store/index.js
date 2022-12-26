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
						console.log(response)
						resolve(response)
					})
					.catch(error => {
						console.log(error.response)
						resolve(error.response)
					})
			})
		},
		//Realitza un moviment, tant un enviament com un retorn de material
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
					.catch(error => resolve(error.response))
			})
		},
		//Exporta a PDF un element HTML amb identificat amb un ID
		exportToPDF({ commit }, payload) {
			html2pdf(document.getElementById(payload.idItem), payload.options);
		},
		handlingError({ commit }, response) {
			let responseMessage = {
				"alertType": "",
				"message": []
			}
			//Comprova el codi d'error per prendre una acció o una altra
			switch (response.status) {

				case 403: {
					responseMessage.alertType = "alert-danger"
					//Genera un string amb tots els errors que retorna la API
					for (let error = 0; error < response.data.errors.length; error++) {
						responseMessage.message.push(response.data.errors[error].message)
					}
					break;
				}
				case 400: {
					responseMessage.alertType = "alert-danger"
					//Genera un string amb tots els errors que retorna la API
					for (let error = 0; error < response.data.errors.length; error++) {
						responseMessage.message.push(response.data.errors[error].message)
					}
					break;
				}

				case 200: {
					responseMessage.alertType = "alert-success"
					responseMessage.message = "Element actualtizat amb èxit"
					break;
				}

				default:
					responseMessage.alertType = "alert-info"
					responseMessage.message = "No s'ha obtingut cap codi d'error"
					break;
			}
			return responseMessage
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