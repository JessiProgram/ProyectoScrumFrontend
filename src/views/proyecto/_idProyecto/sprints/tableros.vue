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
            <h3>Tipo Historias de Usuario</h3>

            <v-simple-table>
                <thead>
                    <tr>
                        <th class="text-left">
                            ID
                        </th>
                        <th class="text-left">
                            Nombre
                        </th>
                        <th class="text-left">
                            Fecha Creación
                        </th>
                        <th class="text-left">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="tipoHU in listaTiposHU" :key="tipoHU.pk">
                        <td>{{ tipoHU.pk }}</td>
                        <td>{{ tipoHU.fields.nombre }}</td>
                        <td>{{ new Date(tipoHU.fields.fechaCreacion).toLocaleString() }}</td>
                        <td>
                            <v-btn class="mr-3" fab dark x-small color="green"
                                @click="$router.push(`/proyecto/${idProyecto}/sprints/${idSprint}/tableros/${tipoHU.pk}`)">
                                <v-icon dark>
                                    mdi-eye
                                </v-icon>
                            </v-btn>
                        </td>
                    </tr>
                </tbody>
            </v-simple-table>
        </v-container>

        

    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '@/plugins/axios'

export default {
    name: '',
    data() {
        return {
            idProyecto: 0,
            idSprint: 0,
            proyecto: null,
            listaTiposHU: [],

            tipoHUSeleccionado: null,

            columnas: [],
            items: [
                {
                    text: 'Inicio',
                    disabled: false,
                    href: '/inicio',
                },
                {
                    text: 'Proyectos',
                    disabled: false,
                    href: '/proyectos',
                },
                {
                    text: `Proyecto ${this.$route.params.idProyecto}`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}`,
                },
                {
                    text: `Sprints`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints`,
                },
                {
                    text: `Sprint ${this.$route.params.idSprint}`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}`,
                },
                {
                    text: 'Tableros',
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/sprints/${this.$route.params.idSprint}/tableros`,
                },
            ],
        }
    },

    components: {
        LayoutDefault,
    },

    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.idSprint = this.$route.params.idSprint
        await this.inicializarLista()
    },

    methods: {
        async inicializarLista() {
            
            let idToken = this.$store.state.usuario.idToken
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`/sprints/listar-tipos?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, config)

                console.log("res.data", res.data)
                this.listaTiposHU = res.data
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },
        async inicializarLista() {
            
            let idToken = this.$store.state.usuario.idToken
            // listamos tipos de HU
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            try {
                let res = await axios.get(`/sprints/listar-tipos?idProyecto=${this.idProyecto}&idSprint=${this.idSprint}`, config)

                console.log("res.data", res.data)
                this.listaTiposHU = res.data
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }
        },

    }

}
</script>

<style scoped>
</style>