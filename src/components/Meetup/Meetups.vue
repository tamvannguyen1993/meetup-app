<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12  sm10 md8 offset-sm1 offset-md2>
          <v-card v-for="meetup in meetups" :key="meetup.id">
            <v-container fluid>
              <v-layout row class="">
                <v-flex xs5 sm4 md3>
                  <v-card-media
                    :src=meetup.imageUrl
                    heigh="130px">

                  </v-card-media>
                </v-flex>
                <v-flex xs7 sm8 md9>
                  <v-card-title>
                    <div>
                      <h3> {{meetup.title}}</h3>
                      <div>{{meetup.date | date}}</div>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn flat :to="'/meetups/' + meetup.id">
                      <v-icon left>arrow_forward</v-icon>
                      View Meetup</v-btn>
                  </v-card-actions>
                </v-flex>

              </v-layout>
            </v-container>
          </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    computed: {
      meetups() {
        return this.$store.getters.loadedMeetups;
      }
    }
  }
</script>
