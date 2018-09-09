import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loadedMeetups: [
      { imageUrl: 'https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1517869165%2Fsakura-temple-pagoda-japan-VISITJP0218.jpg',
        id: 'adfasdfasdf123',
        title: 'Meetup in Japan',
        location: 'Japan',
        date: new Date()
      },
      { imageUrl: 'https://sonicjobs.co.uk/wp-content/uploads/2017/11/how-to-find-a-job-in-london-quickly.jpg',
        id: 'sudhfausfdf234',
        title: 'Meetup in London',
        location: 'London',
        date: new Date()
      }
    ],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload
    },
    createMeetup (state, payload) {
      state.loadedMeetups.push(payload)
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
    loadMeetups({commit}) {
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
              date: obj[key].date,
              creatorId: obj[key].creatorId
            })
          }
          commit('setLoadedMeetups', meetups)
        })
        .catch((error) => {
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
      let imageUrl
      let key
      firebase.database().ref('meetups').push(meetup)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          firebase.storage().ref('meetups/' + key + ext).put(payload.image)
          let pathReference = firebase.storage().ref('meetups/' + key + ext).getDownloadURL()
          console.log(pathReference);
          debugger
        })
        .then(imageUrl  => {
          debugger
          return firebase.database().ref('meetups').child(key).update({imageUrl: imageUrl})
          debugger
        })
        .then(() => {
          console.log(imageUrl);
          commit('createMeetup', {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error);
        })
      // reach out to firebase and store it
    },
    signUserUp({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
      .then( response =>  {
        commit('setLoading', false)
          const newUser = {
            id: response.user.uid,
            registeredMeetups: []
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
                registeredMeetups: []
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
        commit('setUser', {id: payload.uid, registeredMeetups:[] })
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
