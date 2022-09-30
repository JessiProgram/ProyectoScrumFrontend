<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <v-container>
            <h3 class="text-center mb-7">LISTA DE MIS PROYECTOS</h3> 

                <v-card 
                    v-for="(proyecto, index) of listaProyectos" :key="index" 
                    class="mx-auto mb-7"
                    width="600"
                >
                    <v-img
                        height="120px"
                        :src="`https://source.unsplash.com/random/1440x900?sig=${index}`"
                    >
                        <v-card-title class="white--text mt-8">
                            <v-avatar size="56">
                            <img
                                alt="user"
                                :src="`https://robohash.org/${index}?set=set4`"
                            >
                            </v-avatar>
                        
                            <h4 class="ml-3" style="text-shadow: 3px 2px #000000;">
                                {{proyecto.fields.nombre}}
                            </h4>
                        </v-card-title>
                    </v-img>

                    <v-card-text class="text-center">
                        <div class="">
                            <v-btn
                                @click="irAProyecto(proyecto.pk)"
                                color="green"
                                text
                                outlined
                                class="mr-2"
                            >
                                Ir al Proyecto
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
        </v-container>
    </LayoutDefault>
</template>

<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '../plugins/axios'

export default {
    name: '',
    data() {
        return {
            listaProyectos: [],
            items: [
                {
                    text: 'Inicio',
                    disabled: false,
                    href: '/inicio',
                },
                {
                    text: 'Proyectos',
                    disabled: true,
                    href: '/proyectos',
                },
            ],
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {


        let idToken = this.$store.state.usuario.idToken
        // llamamos al backend y solicitamos lo proyectos del usuario
        // Llamamos al backend
        let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

        let body = {}

        let res = await axios.get('/usuario/proyectos', config)

        this.listaProyectos = res.data

        console.log(this.listaProyectos)

    },
    methods: {
        async irAProyecto(idProyecto) {
            this.$router.push(`/proyecto/${idProyecto}`)
        }
    },
}

</script>

<style>

</style>