<template>
  <v-dialog width="350px" persistent v-model="registerDialog">
    <v-btn accent slot="activator">
      {{userIsRegistered ? 'Unregister' : 'Register'}}
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title v-if="userIsRegistered">Unregister from Meetup?</v-card-title>
            <v-card-title v-else>Register for Meetup?</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row grap>
          <v-flex xs12>
            <v-card-text>You can alwasy change your decision later on.</v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row grap>
          <v-flex xs12>
            <v-btn @click="registerDialog = false">Cancel</v-btn>
            <v-btn @click="onAgree">Confirm</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        registerDialog: false,
      }
    },
    props: ['meetupId'],
    computed: {
      userIsRegistered() {
        return this.$store.getters.user.registeredMeetups.findIndex(meetupId => {
          return meetupId === this.meetupId
        }) >= 0
      }
    },
    methods: {
      onAgree() {
        if(this.userIsRegistered) {
          this.$store.dispatch('unregisterUserFromMeetup', this.meetupId)
        }else {
          this.$store.dispatch('registerUserForMeetup', this.meetupId)
        }
      }
    }
  }
</script>
