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
		destinacio: undefined, //Destinació del moviment
		dataRetorn: null, //Data de retporn del moviment


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
				api.get("users/" + payload.id + payload.fields + payload.filter + payload.sort)
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
						console.log(response)
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
		async realitzarMoviment({ commit, getters, state }, payload) {

			let keys = [] //Create an array with serialNum values to update them

			const iterator = await this.dispatch("SET_UPDATE_PAYLOAD", payload)
			for (const value of iterator) {
				keys.push(value.Element)  //Element és el camp ID de la taula Element (que conté el s/n)
			}
			console.log("Update payload keys", keys)

			//Crear multiples elements a la categoria moviment
			console.log("CREATE", "Moviment", ":", iterator)

			return new Promise((resolve, reject) => {
				api.post("items/" + "Moviment", iterator)
					.then(response => {
						console.log("Nou registre afegit a " + "Moviment")
						resolve(response)
					})
					.catch(error => reject(error.message))
					.finally(
						state.llistatMoviment = [],
						state.dataRetorn = null
					)
			})
		},
		//Defines the payload to the POST request to create data
		async SET_UPDATE_PAYLOAD({ state }, payload) {

			//Per a crear elements a la taula de lliurament cal especificar l'element, l'origen i el destí
			console.log("DESTINACIO", state.destinacio)
			let updateKeysMoviment = []
			for (let i = 0; i < payload.length; i++) {
				updateKeysMoviment[i] = {
					Element: payload[i].SerialNum,
					Origen: payload[i].DelegacioActual.ID,
					Desti: state.destinacio,
					MovimentVigent: false,

				};

				if (state.dataRetorn) {
					console.log("DATA RETORN:", state.dataRetorn)
					updateKeysMoviment[i].DataRetorn = await this.dispatch("formatdate", new Date(state.dataRetorn))
					updateKeysMoviment[i].MovimentVigent = true
				}

			}
			console.log("Llistat configurat moviment: ", updateKeysMoviment)

			return updateKeysMoviment
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
				case 401: {
					alert("Token expired")
					this.$router.push("/")
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
					responseMessage.message.push("No s'ha obtingut cap codi d'error")
					break;
				}

				default:
					responseMessage.alertType = "alert-success"
					responseMessage.message.push("No s'ha obtingut cap codi d'error")
					break;
			}
			return responseMessage
		},
		formatdate({ commit }, date) {
			let month = date.getMonth() + 1
			let day = date.getDate()
			let year = date.getFullYear()
			console.log(day, month, year)

			if (month < 10)
				month = '0' + month;
			if (day < 10)
				day = '0' + day;
			console.log("FORMATED", day, month, year)

			return [year, month, day].join('-');
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