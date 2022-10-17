<template>
    <LayoutDefault>
        <v-parallax src="https://pbs.twimg.com/media/Fb8MIjeWAAAxytl?format=jpg&name=large" height="550">
            <v-layout column align-center justify-center class="white--text">
                <h1 class="title_presentation" style="font-weight: 1000; text-shadow: 3px 2px #000000">El mejor administrador de Proyectos SCRUM</h1>
                <div class="white--text subheading mb-3 text-xs-center" style="font-weight: 900; text-shadow: 2px 2px #000000">
                    <h3>
                        <div v-if="$store.state.usuario.permisosUsuario.includes('crear_rol_externo')">Bienvenido ADMIN</div> 
                        <div v-else-if="$store.state.usuario.rolesUsuario.length !== 0">Bienvenido</div> 
                        <div v-else-if="$store.state.usuario.rolesUsuario.length === 0">Bienvenido INVITADO, comuniquese a la administracion en proyectoscrum@gmail.com para formar parte de los usuarios</div> 
                    </h3>
                </div>
                <v-btn class="blue lighten-2 mt-5" dark large to="/proyectos">
                    Proyectos
                </v-btn>
            </v-layout>
        </v-parallax>

        <div class="container mt-10">
            <h2 style="font-size: 40px;">
                Noticias:
            </h2>
            <v-divider class="mb-10" />

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
    </LayoutDefault>
</template>

<script>
import LayoutDefault from '@/layouts/Default.vue';

export default {
    name: '',
    data() {
        return {
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
        LayoutDefault,
    },
    methods: {
        async logout() {
            await this.$store.dispatch('usuario/logout')
            this.$router.push('/')
        },
        getColorTitulo (item) {
            if (item.type === 1) {
                return 'color: #3e42f4;'
            }

            else if (item.type === 2) {
                return 'color: #4edd44;'
            }

            return '#000000'
        },
    },
}
</script>

<style scoped>
.contenedor_informacion {
    margin-bottom: 110px;
}
</style>