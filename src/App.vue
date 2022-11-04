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

<style>
::-webkit-scrollbar {
  width: 9px;
}

::-webkit-scrollbar-track {
  background-color: #dbdbdb;
}

::-webkit-scrollbar-thumb {
  background-color: #3e9e4f;
  border-radius: 20px;
}

::-webkit-scrollbar:horizontal{
  height: 9px;
  background-color: blue;
}
</style>