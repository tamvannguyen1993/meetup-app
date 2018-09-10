import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import * as firebase from 'firebase'
import router from './router'
import {store} from './store'
import DateFilter from './filters/date'
import AlertCmp from './components/Shared/Alert.vue'
import EditMeetupDetailsDialog from './components/Meetup/Edit/EditMeetupDetailsDialog'
import EditMeetupDateDialog from './components/Meetup/Edit/EditMeetupDateDialog'
import RegisterDialog from './components/Meetup/Registration/RegisterDialog.vue'

Vue.config.productionTip = false


Vue.filter('date', DateFilter)
Vue.component('app-alert', AlertCmp)
Vue.component('app-edit-meetup-details-dialog', EditMeetupDetailsDialog)
Vue.component('app-edit-meetup-date-dialog', EditMeetupDateDialog)
Vue.component('app-meetup-register-dialog', RegisterDialog)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAKhVfrHe96zQW6O-hh0GmyH24pLUGh95E',
      authDomain: 'meetup-app-a0055.firebaseapp.com',
      databaseURL: 'https://meetup-app-a0055.firebaseio.com',
      projectId: 'meetup-app-a0055',
      //storageBucket: 'meetup-app-a0055.appspot.com',
      storageBucket: 'meetup-app-a0055.appspot.com',

    }),
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.dispatch('autoSignIn', user)
      this.$store.dispatch('fetchUserData')
    }),
    this.$store.dispatch('loadMeetups')
  }
})
