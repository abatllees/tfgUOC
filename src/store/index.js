import { createStore } from 'vuex'
import VuexPersistence from 'vuex-persist'
import api from "@/api"

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
		//Obté l'usuari logat i el desa a l'state i al sessionStorage
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
		//Obté els valors d'un camp d'una col·lecció
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
			return new Promise((resolve) => {
				api.get("items/" + payload.collection + payload.fields + payload.filter + payload.sort)
					.then(response => {
						resolve(response.data.data)
					})
					.catch(error => resolve(error))
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
			console.log("Update payload:", payload)
			return new Promise((resolve) => {
				api.patch("items/" + payload.collection + "/" + payload.item, payload)
					.then(response => {
						resolve(response)
					})
					.catch(error => {
						resolve(error.response)
					})
			})
		},
		//Actualitza més d'un element
		updateMultipleItems({ commit }, payload) {
			console.log("Update payload:", payload)
			return new Promise((resolve) => {
				api.patch("items/" + payload.collection, payload.data)
					.then(response => {
						resolve(response)
					})
					.catch(error => {
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
			})
		},
		//Configura el llistat per als moviments
		async SET_UPDATE_PAYLOAD({ state }, payload) {

			//Per a crear elements a la taula de lliurament cal especificar l'element, l'origen i el destí
			console.log("DESTINACIO", state.destinacio)
			let payloadMoviment = []
			for (let i = 0; i < payload.length; i++) {
				payloadMoviment[i] = {
					Element: payload[i].SerialNum,
					Origen: payload[i].DelegacioActual.ID,
					Desti: state.destinacio,
					MovimentVigent: false,

				};

				if (state.dataRetorn) {
					console.log("DATA RETORN:", state.dataRetorn)
					payloadMoviment[i].DataRetorn = await this.dispatch("formatdate", new Date(state.dataRetorn))
					payloadMoviment[i].MovimentVigent = true
				}

			}
			console.log("Llistat configurat moviment: ", payloadMoviment)

			return payloadMoviment
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
		//Comprova si hi ha algun error
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
				//No funciona!!!!
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
				case 204: {
					responseMessage.alertType = "alert-success"
					responseMessage.message.push("Sessió tancada correctament")
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
		},
		ShortDate({ commit }, date) {
			let dateFromatted = new Date(date)
			const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
			return dateFromatted.toLocaleDateString('ca-ES', options);
		},
		async exportPDF({ commit, state }, data) {
			console.log(data)
			const doc = new jsPDF()

			//Capçaleres de la taula
			let head = []
			//Array d'elements. 
			let rows = []
			//Omplena les dades de la taula
			data.table.headers.forEach(titol => {
				head.push(titol.text)
			})
			data.table.data.forEach(element => {
				switch (data.tipusMoviment) {
					case "Entrada de material":
						rows.push([
							element.NumMag,
							element.Model.Subcategory.SubcategoryName,
							element.Model.Brand.BrandName,
							element.Model.ModelName,
							element.SerialNum,
							element.DelegacioActual.Name
						])

						break;
					case "Lliurament de material":
						rows.push([
							element.Model.Subcategory.SubcategoryName,
							element.Model.Brand.BrandName,
							element.Model.ModelName,
							element.NumMag,
							element.SerialNum
						])
						break;
					default:

						break;
				}


			})

			const amplada = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
			let params = {
				collection: "Delegacio",
				item: data.destinacio,
				fields: "?fields=*.*.*lo",
				filter: ""
			}
			const desti = await this.dispatch("getElement", params)


			const today = await this.dispatch("formatdate", new Date())

			//Realitzat per
			doc.setFontSize(8)
			doc.text("Realitzat per: " + data.realitzatPer, 10, 10)

			//Títol
			doc.setFontSize(22)
			doc.text("Magatzem de rodatges", amplada / 2, 40, { align: "center" })
			//Subtítol
			doc.setFontSize(15)
			doc.text(data.tipusMoviment, amplada / 2, 48, { align: "center" })

			//Informació del moviment
			doc.setFontSize(12)
			console.log(state)
			if (state.dataRetorn) {
				const dataRetorn = await this.dispatch("formatdate", new Date(this.$store.state.dataRetorn))
				doc.text("Data de retorn: " + dataRetorn, amplada / 2, 65)
			}
			doc.text("Data: " + today, 10, 65)
			doc.text("Destinació: " + desti.Name, 10, 77)
			doc.text("Entregat a: " + desti.ResponsableDelegacio.first_name + " " + desti.ResponsableDelegacio.last_name, amplada - amplada / 2, 77)


			//Mostra la taula
			autoTable(doc, {
				head: [head],
				body: rows,
				startY: 80,
				margin: 10,
				headStyles: { fillColor: [187, 0, 0] },
				bodyStyles: { textColor: [0, 0, 0] }
			},)
			doc.save('table.pdf')
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