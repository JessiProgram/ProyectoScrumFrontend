<template>
    <LayoutDefault>
        <div class="container">
            <v-btn @click="logout">
                Cerrar sesión
            </v-btn>
        </div>
    </LayoutDefault>
</template>

<script>
import LayoutDefault from '@/layouts/Default.vue';

export default {
    name: '',
    data() {
        return {
            
        }
    },
    components: {
        LayoutDefault,
    },
    methods: {
        async logout() {
            await this.$store.dispatch('usuario/logout')
            this.$router.push('/')
        }
    },
}
</script>

<style>

</style>