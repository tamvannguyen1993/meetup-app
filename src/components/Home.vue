<template>
  <v-container>
    <v-layout row wrap class="mb-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large router to="/meetups">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large router to="/meetup/new">Orginize Meetup</v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-carousel style="cursor: pointer;">
          <v-carousel-item
            v-for="meetup in meetups"
            :key="meetup.id"
            :src="meetup.imageUrl"
            @click="onLoadMeetup(meetup.id)">
            <div class="title">
              {{  meetup.title }}
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>
          Join our awesome meetups!
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
  export default {
    data() {
      return {
        meetups: [
          {imageUrl: 'https://imagesvc.timeincapp.com/v3/mm/image?url=https%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1517869165%2Fsakura-temple-pagoda-japan-VISITJP0218.jpg', id: 'adfasdfasdf123', title: 'Meetup in Japan'},
          {imageUrl: 'https://sonicjobs.co.uk/wp-content/uploads/2017/11/how-to-find-a-job-in-london-quickly.jpg', id: 'sudhfausfdf234', title: 'Meetup in London'}
        ]
      }
    },
    methods: {
      onLoadMeetup(id) {
        this.$router.push('/meetups/' + id)
      }
    }
  }
</script>

<style scoped>
  .title {

    position: absolute;
    bottom: 50px;
    background-color:rgba(0,0,0,0.5);
    padding:20px;
    color: white;
  }
</style>
