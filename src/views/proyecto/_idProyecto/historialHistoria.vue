<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>
        <v-container v-if="proyecto">
            <h3>Historial de la Historia de usuario</h3>
            <v-simple-table class="mt-5">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Nombre
                            </th>
                            <th class="text-left">
                                Descripcion
                            </th>
                            <th class="text-left">
                                Prioridad Tecnica
                            </th>
                            <th class="text-left">
                                Prioridad de Negocio
                            </th>
                            <th class="text-left">
                                Horas estimadas
                            </th>
                            <th class="text-left">
                                Horas Trabajadas
                            </th>
                            <th class="text-left">
                                Prioridad
                            </th>
                            <th class="text-left">
                                Estado
                            </th>
                            <th class="text-left">
                                Tipo Historia de Usuario
                            </th>
                            <th class="text-left">
                                Desarrollador Asignado
                            </th>
                            <th class="text-left">
                                Restaurar Historia
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in historial"
                            :key="index"
                        >
                            <td>{{ item.fields.nombre }}</td>
                            <td>{{ item.fields.descripcion }}</td>
                            <td>{{ item.fields.prioridad_tecnica }}</td>
                            <td>{{ item.fields.prioridad_negocio }}</td>
                            <td>{{ item.fields.estimacion_horas }}</td>
                            <td>{{ item.fields.horas_trabajadas }}</td>
                            <td>{{ item.fields.prioridad_final }}</td>
                            <td>{{ item.fields.estado }}</td>
                            <td>{{ item.fields.tipo_historia_usuario }}</td>
                            <td>{{ item.fields.desarrollador_asignado }}</td>
                            <td>
                                <v-btn
                                    class="mr-3"
                                    fab
                                    dark
                                    x-small
                                    color="green"
                                    @click="openDialogRestaurarHistoria(item)"
                                >
                                    <v-icon dark>
                                        mdi-restore
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            <v-row justify="center">
                    <v-dialog
                    v-model="dialogRestaurar"
                    persistent
                    max-width="350"
                    >
                    <v-card>
                        <v-toolbar
                        color="green"
                        class="mb-5"
                        dark
                        >
                            <h4>¿Está seguro que desea restaurar la historia de usuario?</h4>
                        </v-toolbar>
                        <v-card-text>Al restaurar esta historia, se restauran los datos seleccionados y se perderan los actuales</v-card-text>
                        <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="red darken-1"
                            text
                            @click="dialogRestaurar = false"
                        >
                            Cancelar
                        </v-btn>
                        <v-btn
                            color="green darken-1"
                            text
                            @click="restaurar()"
                        >
                            Estoy seguro
                        </v-btn>
                        </v-card-actions>
                    </v-card>
                    </v-dialog>
                </v-row>

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

            idProyecto:0,
            proyecto:null,
            idHistoria: -1,
            historial: [],

            dialogRestaurar: false,

            historialSeleccionado: null,

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
                    text: `Product Backlog`,
                    disabled: false,
                    href: `/proyecto/${this.$route.params.idProyecto}/product-backlog`,
                },
                {
                    text: `Historial ${this.$route.params.idHistoria}`,
                    disabled: true,
                    href: '/configuracion',
                },
            ],
        }
    },
    components: {
        LayoutDefault
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        this.idHistoria = this.$route.params.idHistoria
        let idToken = this.$store.state.usuario.idToken


        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        try {

            let resP = await this.axios.get(`/proyecto/?q=${this.idProyecto}`, config)
            this.proyecto = resP.data[0]

        } catch (error) {
            console.log(error)
            if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
        }
        this.obtenerHistorial()

    },
    methods:{
        openDialogRestaurarHistoria(data){
            this.historialSeleccionado = data
            this.dialogRestaurar = true
        },

        async obtenerHistorial(){
            let idToken = this.$store.state.usuario.idToken


        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        try {


            let res = await axios.get(`/historiasUsuario/historial/listar?idProyecto=${this.idProyecto}&idHistoria=${this.idHistoria}`, config)

            this.historial = res.data

        } catch (error) {
            console.log(error)
            if (error.response.data.length <= 200) {
                alert(error.response.data)
            } else {
                alert("Ha ocurrido un error inesperado")
            }
        }
        },

        async restaurar(){

            try {
                let idToken = this.$store.state.usuario.idToken


                // Llamamos al backend
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
                    }
                }

                // Agregar roles
                const body = {
                    idVersion: this.historialSeleccionado.pk,
                    idProyecto: this.idProyecto,
                    idHistoria: this.idHistoria,
                }
                
                await this.axios.put(`/historiasUsuario/historial`, body, config)

                this.dialogRestaurar = false

                this.obtenerHistorial()
                    
            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }

            } 

            

        }
    },

}
</script>

<style>

</style>