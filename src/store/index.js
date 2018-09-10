import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    registerUserForMeetup(state, payload) {
      const id = payload.id
      if(state.user.registeredMeetups.findIndex(meetup => {meetup.id === id}) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbkey
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
    },
    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id
      })
      if(payload.title) {
        meetup.title = payload.title
      }
      if(payload.description) {
        meetup.description = payload.description
      }
      if(payload.date) {
        meetup.date = payload.date
      }
    },
    setUser (state, payload) {
      state.user = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setError (state, payload) {
      state.error = payload
      console.log("error set!!!" + state.error);
    },
    clearError(state) {
      state.error = null
    }
  },
  actions: {
    registerUserForMeetup({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user;
      firebase.database().ref('/users/' + user.id).child('/registrations/')
        .push(payload)
        .then(data => {
          commit('setLoading', false)
          commit('registerUserForMeetup', {id: payload, fbkey: data.key})
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false)
        })
    },
    unregisterUserFromMeetup({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if(!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
        .remove()
        .then(() => {
          commit('setLoading', false)
          commit('unregisterUserFromMeetup', payload)
        })
        .catch(error => {
          console.log(error);
          commit('setLoading', false)
        })
    },
    loadMeetups({commit}) {
      commit('setLoading', true)
      firebase.database().ref('meetups').once('value')
        .then((data) => {
          const meetups = []
          const obj = data.val()
          for(let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              location: obj[key].location,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
          commit('setLoading', false)

        })
        .catch((error) => {
          commit('setLoading', false)
          console.log(error);
        })
    },
    createMeetup ({commit, getters}, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrlTemp
      let key
      let storageRef = firebase.storage().ref()
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('meetups/' + key + ext).put(payload.image)
        })
        .then(imageRef  => {
          debugger
          return firebase.storage().ref().child(imageRef.metadata.fullPath).getDownloadURL()
        })
        .then(imageUrl => {
          imageUrlTemp = imageUrl
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
        })
        .then(() => {
          console.log(imageUrlTemp);
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrlTemp,
            id: key
          })
        })
        .catch((error) => {
          console.log(error);
        })
      // reach out to firebase and store it
    },
    updateMeetupData({commit}, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if(payload.title) {
        updateObj.title = payload.title
      }
      if(payload.description) {
        updateObj.description = payload.description
      }
      if(payload.date) {
        updateObj.date = payload.date
      }
      firebase.database().ref('meetups').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateMeetup', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading',false)
        })
    },
    signUserUp({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then( response =>  {
        commit('setLoading', false)
          const newUser = {
            id: response.user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        })
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error.message)
          }
        )
      },
      signUserIn({commit}, payload) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then( response => {
            commit('setLoading', false)
              const signedInUser = {
                id: response.user.uid,
                registeredMeetups: [],
                fbKeys: {}
              }
              commit('setUser', signedInUser)
            })
            .catch(
              error => {
                commit('setLoading', false)
                commit('setError', error)
                //console.log(error)
              }
            )
      },
      clearError({commit}) {
        commit('clearError');
      },
      autoSignIn({commit}, payload) {
        commit('setUser', {
          id: payload.uid,
          registeredMeetups:[],
          fbKeys: {} })
      },
      fetchUserData({commit, getters}) {
        commit('setLoading', true)
        firebase.database().ref('/users/' + getters.user.id + '/registrations').once('value')
          .then(data => {
            const dataPairs = data.val()
            let registeredMeetups = []
            let swappedPairs = {}
            for (let key in dataPairs) {
              registeredMeetups.push(dataPairs[key])
              swappedPairs[dataPairs[key]] = key
            }
            const updatedUser = {
              id: getters.user.id,
              registeredMeetups: registeredMeetups,
              fbKeys: swappedPairs
            }
            commit('setLoading', false)
            commit('setUser', updatedUser)
          })
          .catch(error=> {
            commit('setLoading', false)
            console.log(error);
          })
      },
      logout({commit}) {
        firebase.auth().signOut()
        commit('setUser', null)
      }
  },

  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date
      })
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0,5)
    },
    loadedMeetup(state) {
      return(meetupId) => {
        return state.loadedMeetups.find((meetup) => {
          return meetup.id == meetupId
        })
      }
    },
    user(state) {
      return state.user
    },
    loading(state) {
      return state.loading
    },
    error(state) {
      return state.error
    }
  }
})
