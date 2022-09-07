<template>
    <LayoutDefault>
        <div class="container">
            {{$store.state.usuario.rolesUsuario}}
            {{$store.state.usuario.permisosUsuario}}
            <div v-if="$store.state.usuario.permisosUsuario.includes('crear_rol_externo')">Esta vista solo se muestra si eres usuario ADMIN</div> 
            <div v-else-if="$store.state.usuario.rolesUsuario.length !== 0">Esta vista solo se muestra si eres usuario NORMAL</div> 
            <div v-else-if="$store.state.usuario.rolesUsuario.length === 0">Esta vista solo se muestra si eres un INVITADO</div> 
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