<template>
    <LayoutDefault>
        <v-container>
            <h3>LISTA DE MIS PROYECTOS</h3> 

            <div v-for="proyecto of listaProyectos">
                <v-card class="mx-auto" max-width="344" outlined>
                    <v-list-item three-line>
                        <v-list-item-content>
                            <div class="text-overline mb-4">
                                Proyecto Scrum
                            </div>
                            <v-list-item-title class="text-h5 mb-1">
                                {{proyecto.fields.nombre}}
                            </v-list-item-title>
                            <v-list-item-subtitle>{{proyecto.fields.descripcion}}</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-avatar tile size="80" color="grey">
                            <v-img
                            src="https://source.unsplash.com/random/900x900?sig=16"
                            ></v-img>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-card-actions>
                        <v-btn outlined rounded text v-on:click="irAProyecto(proyecto.pk)">
                            Ir al proyecto
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
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
            listaProyectos: []
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