<template>
    <v-app-bar
        app
        absolute
        color="#683bce"
        src="@/assets/images/laptop.png"
        height="50"
        dark
    >
        <template v-slot:img="{ props }">
            <v-img
            v-bind="props"
            gradient="to top left, rgba(78, 221, 68, 0.8), rgba(62, 66, 244, 0.8)"
            ></v-img>
        </template>

        <div class="ml-4">
            <h3 class="title">Login With Google</h3>
        </div>
    </v-app-bar>
</template>

<script>
export default {

}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');

.title {
    font-family: 'Silkscreen', cursive !important;
}
</style>