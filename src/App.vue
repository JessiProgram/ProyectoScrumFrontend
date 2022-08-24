<template>
  <div>

    <div v-if="$store.state.loading">
      Loading...
    </div>
    
    <div v-else>
      <router-view/>
    </div>

  </div>
</template>

<script>

export default {
  name: 'App',

  mounted () {
    
  }
};
</script>
