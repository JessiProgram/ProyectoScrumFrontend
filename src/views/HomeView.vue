<template>
  <div class="home">
    <h1>Google Identity Services Authorization Token model</h1>
    <button @click="getToken">Get access token</button><br><br>
    <button @click="loadCalendar">Load Calendar</button><br><br>
    <button @click="revokeToken">Revoke token</button>

    <hr>

    {{ access_token }}
  </div>
</template>

<script>
import env from '@/configs/env';

export default {
  name: 'HomeView',
  data() {
    return {
      client: null,
      access_token: '',  
      list: [],   
    }
  },
  methods: {
    initClient() {
      this.client = google.accounts.oauth2.initTokenClient({
        client_id: env.GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        ux_mode: 'popup',
        callback: (tokenResponse) => {
          console.log('tokenResponse', tokenResponse)
          this.access_token = tokenResponse.access_token;
        },
      });
    },
    getToken() {
      this.client.requestAccessToken()
    },
    revokeToken() {
      google.accounts.oauth2.revoke(this.access_token, () => {
        console.log('access token revoked')
      });
    },
    loadCalendar() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.googleapis.com/calendar/v3/calendars/primary/events');
      xhr.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
      xhr.send();
    }
  },
  created () {
    this.initClient()
  }
}
</script>
