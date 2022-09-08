<template>
    <LayoutDefault>
        <v-container>
            <h3>Roles Internos</h3>
        </v-container>
    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '../../plugins/axios'

export default {
    name: '',
    data() {
        return {
            idProyeto:0,
            proyecto:null
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

    },
    
}
</script>

<style>

</style>