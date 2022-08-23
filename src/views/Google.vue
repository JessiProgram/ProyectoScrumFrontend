<template>

    <div class="btn-cont">
      <div><h2>vue-google-identity-login-btn</h2></div>
      <div id="google-login-btn" v-google-identity-login-btn="{ clientId, locale:'en' }">
          Continuar con google
      </div>

      <hr>

      {{ profileData }}
    </div>

</template>

<script>
import env from '@/configs/env';
import GoogleSignInButton from 'vue-google-identity-login-btn';

export default {
  
  directives: {
    GoogleSignInButton
  },

  data() {
    return {
      clientId: env.GOOGLE_CLIENT_ID,
      profileData: null,
    }
  },

  methods: {
    onGoogleAuthSuccess (jwtCredentials) {
      console.log(jwtCredentials);
      const profileData = JSON.parse( atob(jwtCredentials.split('.')[1]) );
      const { name, picture, email } = profileData;
      this.profileData = profileData
      console.table({ name, picture, email });
    }
  },
}
</script>

<style scoped>
.btn-cont {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 500px;
}
.btn-cont > div {
  width: 300px;
  text-align: center;
}
</style>
