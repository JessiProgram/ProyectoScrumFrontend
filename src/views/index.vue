<template>
  <LayoutGuest>
    <div class="contenedor_inicio container">
      <div class="text-center">
        <h1 class="title_presentation">Login With Google</h1>

        <div class="container ml-5 mt-5 mb-15">
          <div v-if="!$store.getters['usuario/estaAutenticado']" id="signInDiv"></div>

          <v-btn v-else color="#3e41f4" x-large outlined text to="/inicio">
              Comenzar
          </v-btn>
        </div>
      </div>

      <v-divider class="my-15" />

      <v-row 
        v-for="item in items" :key="item.id"
        class="contenedor_informacion"
      >
        <v-col v-if="item.type === 2" cols="12" md="6">
          <v-img
            :src="item.img"
          ></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <h2 :style="getColorTitulo(item)"> {{item.title}} </h2>
          <v-divider class="mb-8" />
          <p>
            {{item.description}}
          </p>
        </v-col>
        <v-col v-if="item.type === 1" cols="12" md="6">
          <v-img
            :src="item.img"
          ></v-img>
        </v-col>
      </v-row>

    </div>
  </LayoutGuest>
</template>

<script>
import LayoutGuest from '@/layouts/Guest.vue';
import env from '@/configs/env';

export default {
  name: 'HomeView',
  data() {
    return {
      client: null,
      items: [
        {type: 1, title: 'Lorem ipsum dolor sit amet', description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec mi felis. 
            Praesent vitae congue mi. Sed efficitur ante sapien, eget tristique sapien 
            sollicitudin vitae. Aliquam vel tellus id diam pulvinar hendrerit eget 
            quis mi. Cras magna ligula, volutpat quis massa in, gravida laoreet magna. 
            In id nisi risus. Vestibulum bibendum maximus maximus. Sed porta mauris 
            eget dolor scelerisque feugiat. Ut odio mi, eleifend sed malesuada eu, 
            fringilla et urna. Donec luctus ex sed ligula auctor sagittis. Suspendisse 
            sit amet risus nibh. `, img: require('@/assets/images/trabajo_en_equipo.jpg')},
        {type: 2, title: 'Lorem ipsum dolor sit amet', description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec mi felis. 
            Praesent vitae congue mi. Sed efficitur ante sapien, eget tristique sapien 
            sollicitudin vitae. Aliquam vel tellus id diam pulvinar hendrerit eget 
            quis mi. Cras magna ligula, volutpat quis massa in, gravida laoreet magna. 
            In id nisi risus. Vestibulum bibendum maximus maximus. Sed porta mauris 
            eget dolor scelerisque feugiat. Ut odio mi, eleifend sed malesuada eu, 
            fringilla et urna. Donec luctus ex sed ligula auctor sagittis. Suspendisse 
            sit amet risus nibh. `, img: require('@/assets/images/trabajo_en_equipo.jpg')},
        {type: 1, title: 'Lorem ipsum dolor sit amet', description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut nec mi felis. 
            Praesent vitae congue mi. Sed efficitur ante sapien, eget tristique sapien 
            sollicitudin vitae. Aliquam vel tellus id diam pulvinar hendrerit eget 
            quis mi. Cras magna ligula, volutpat quis massa in, gravida laoreet magna. 
            In id nisi risus. Vestibulum bibendum maximus maximus. Sed porta mauris 
            eget dolor scelerisque feugiat. Ut odio mi, eleifend sed malesuada eu, 
            fringilla et urna. Donec luctus ex sed ligula auctor sagittis. Suspendisse 
            sit amet risus nibh. `, img: require('@/assets/images/trabajo_en_equipo.jpg')},
      ]
    }
  },
  components: {
    LayoutGuest,
  },
  methods: {

    getColorTitulo (item) {
      if (item.type === 1) {
        return 'color: #3e42f4;'
      }

      else if (item.type === 2) {
        return 'color: #4edd44;'
      }

      return '#000000'
    },
    async callbackLogin (response) {
      console.log('response', response)
        
      // Login
      const idToken = response.credential
      await this.$store.dispatch('usuario/login', { idToken })

      // Redireccionar
      this.$router.push('/inicio')
    },
    initClient() {
      console.log('google', google)

      this.client = google.accounts.id.initialize({
        client_id: env.GOOGLE_CLIENT_ID,
        callback: response => this.callbackLogin(response),
      })
    },
  },
  created () {
    this.initClient()
  },
  mounted () {
    const googleBtnConfigs = {
      theme: 'filled_blue',
      size: 'large',
      shape: 'pill',
      text: 'continue_with',
      width: '50'
    }

    google.accounts.id.prompt()
    
    google.accounts.id.renderButton(document.getElementById('signInDiv'), googleBtnConfigs)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');

#signInDiv {
  margin: auto;
  max-width: 250px;
  padding: 10px;
}

.title_presentation {
  font-family: 'Silkscreen', cursive;
  font-size: 120px;
  color: #3e41f4;
}

.contenedor_informacion {
  margin-bottom: 110px;
}

@media (max-width: 630px) {
  .title_presentation {
    font-size: 60px;
  }
}
</style>