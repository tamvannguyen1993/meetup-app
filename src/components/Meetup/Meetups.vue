<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12  sm10 md8 offset-sm1 offset-md2>
          <v-card>
            <v-container fluid>
              <v-layout row class="">
                <v-flex xs5 sm4 md3>
                  <v-card-media
                    src="https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1517869165%2Fsakura-temple-pagoda-japan-VISITJP0218.jpg"
                    heigh="130px">

                  </v-card-media>
                </v-flex>
                <v-flex xs7 sm8 md9>
                  <v-card-title>
                    <div>
                      <h3> My Meetup</h3>
                      <div>17th July 2017</div>
                    </div>
                  </v-card-title>
                  <v-card-actions>
                    <v-btn flat to="/meetups/1">
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
