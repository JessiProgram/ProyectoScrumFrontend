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
            <h3 class="ml-2" style="display: inline;">Participantes</h3>
            <v-btn
                outlined
                text
                rounded
                small
                color="blue"
                class="ml-3"
                @click="openDialogAgregarParticipante"
            >
                <v-icon left>
                    mdi-plus
                </v-icon>
                Agregar
            </v-btn>
            
            <v-simple-table class="mt-5">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="text-left">
                                Correo
                            </th>
                            <th class="text-left">
                                Nombre completo
                            </th>
                            <th class="text-left">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, index) in participantes"
                            :key="index"
                        >
                            <td>{{ item.email }}</td>
                            <td>{{ item.nombres }} {{ item.apellidos }}</td>
                            <td>
                                <v-btn
                                    class="mr-3"
                                    fab
                                    dark
                                    x-small
                                    color="green"
                                    @click="openDialogActualizarParticipante(item)"
                                >
                                    <v-icon dark>
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                                <v-btn
                                    class="mr-3"
                                    fab
                                    dark
                                    x-small
                                    color="red"
                                    @click="openDialogEliminarParticipante(item)"
                                >
                                    <v-icon dark>
                                        mdi-delete
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        
        </v-container>

        <v-dialog
            v-model="dialogAgregarParticipante"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card>
                <v-toolbar
                    dark
                    color="primary"
                >
                    <v-btn
                        icon
                        dark
                        @click="dialogAgregarParticipante = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        Agregar participante
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    </v-toolbar-items>
                </v-toolbar>

                <div class="container my-5 px-10">
                    <div class="">
                        <h2>Correo del participante:</h2>
                        <v-divider class="mb-5" />
                        <v-text-field
                            v-model="correoNuevo"
                            label="Correo del participante"
                            required
                        ></v-text-field>
                    </div>

                    <v-btn
                        @click="agregarParticipante"
                        class="mt-3 mr-2"
                        outlined
                        color="blue"
                    >
                        Agregar participante
                    </v-btn>

                </div>
                
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogActualizarParticipante"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card v-if="participanteSeleccionado">
                <v-toolbar
                    dark
                    color="primary"
                >
                    <v-btn
                        icon
                        dark
                        @click="dialogActualizarParticipante = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        {{participanteSeleccionado.email}}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                    </v-toolbar-items>
                </v-toolbar>

                <div class="container my-5 px-10">
                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <h2>Nombre completo:</h2>
                            <v-divider class="mb-5" />
                            <p>
                                {{participanteSeleccionado.nombres}} {{participanteSeleccionado.apellidos}}
                            </p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <h2>Nombre de usuario:</h2>
                            <v-divider class="mb-5" />
                            <p>
                                {{participanteSeleccionado.username}}
                            </p>
                        </v-col>
                    </v-row>

                </div>

                <v-divider></v-divider>

                <div class="container mt-5">
                    <h2>
                        Roles del proyecto:

                    </h2>

                    <v-checkbox
                        v-for="(item, index) in rolesInternos" :key="index"
                        v-model="rolesInternosDeParticipante[index]"
                        :label="`${item.nombre}`"
                    ></v-checkbox>

                    <v-btn
                        @click="actualizarParticipante"
                        class="mt-3 mr-2"
                        outlined
                        color="green"
                    >
                        Actualizar participante
                    </v-btn>
                </div>
                
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="dialogEliminarParticipante"
            v-if="participanteSeleccionado"
            max-width="800px"
        >
            <v-card>
                <v-card-title class="informacionAccion textoInformacionAccion">
                    ¿Quieres eliminar este participante?
                </v-card-title>
                <v-card-text class="informacionAccion textoInformacionAccion">
                    Esta acción eliminará el participante de forma permanente.
                </v-card-text>
                <v-card-text class="mt-5">
                    Para confirmar que deseas eliminar este participante, escribe su nombre de usuario: 
                    <b>{{ participanteSeleccionado.username }}</b>
                </v-card-text>

                <div class="container text-center" max-width="400px">
                    <v-text-field
                        class="inputConfirmacionAccion"
                        v-model="confirmacionEliminacionParticipante"
                        :label="`Escribe: ${participanteSeleccionado.username}`"
                        required
                    ></v-text-field>
                </div>

                <v-card-actions class="d-flex flex-row-reverse pb-5 pt-5">
                    <v-btn
                        class="ml-4 mr-3"
                        :disabled="confirmacionEliminacionParticipante !== participanteSeleccionado.username"
                        color="red"
                        text
                        @click="eliminarParticipante"
                    >
                        Eliminar participante
                    </v-btn>

                    <v-btn
                        color="grey darken-2"
                        text
                        @click="dialogEliminarParticipante = false"
                    >
                        Cerrar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
            v-model="processing.value"
            persistent
            width="300"
        >
            <v-card
                color="#683bce"
                dark
            >
                <v-card-text class="pt-3">
                    {{ processing.message }}
                    <v-progress-linear
                        indeterminate
                        color="white"
                        class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '@/plugins/axios'

export default {
    name: '',
    data() {
        return {
            idProyecto: this.$route.params.idProyecto,
            participantes: [],
            rolesInternos: [],

            dialogAgregarParticipante: false,
            correoNuevo: '',

            participanteSeleccionado: null,

            dialogActualizarParticipante: false,
            rolesInternosDeParticipante: [],
            dialogEliminarParticipante: false,
            confirmacionEliminacionParticipante: '',

            processing: {
                value: false,
                message: '',
            },

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
                    text: 'Participantes',
                    disabled: true,
                    href: '/participantes',
                },
            ],
        }
    },
    components: {
        LayoutDefault,
    },


    methods: {
        async openDialogAgregarParticipante () {
            this.dialogAgregarParticipante = true
        },

        async openDialogActualizarParticipante (data) {
            this.dialogActualizarParticipante = true
            this.participanteSeleccionado = data
            this.rolesInternosDeParticipante = Array.from({
                length: this.rolesInternos.length
            }, (v, i) => false)
        },

        async openDialogEliminarParticipante (data) {
            this.dialogEliminarParticipante = true
            this.participanteSeleccionado = data
            this.confirmacionEliminacionParticipante = ''
        },

        async agregarParticipante () {
            this.processing = {
                value: true,
                message: `Agregando participante.`,
            }

            try {
                const correo = this.correoNuevo

                const idToken = this.$store.state.usuario.idToken
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const responseUsuario = await axios.get(`/usuario/existe?email=${correo}`, config)
                const usuario = responseUsuario.data[0]
                
                if (!usuario){
                    alert(`No existe el usuario ${correo}.`)
                    return
                }

                const body = {
                    idProyecto: Number(this.idProyecto),
                    idUsuario: usuario.pk
                }

                await axios.post('/participantes', body, config)

                this.participantes.push({
                    uid: usuario.pk,
                    ...usuario.fields
                })

            } catch (error) {
                console.log('error', error)

            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },

        async actualizarParticipante () {
            this.processing = {
                value: true,
                message: `Actualizando participante.`,
            }

            try {
                const idToken = this.$store.state.usuario.idToken
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const idsRolAdd = []
                const idsRolDelete = []
                for (let i = 0; i < this.rolesInternosDeParticipante.length; i++) {
                    const element = this.rolesInternosDeParticipante[i]
                    const rolInterno = this.rolesInternos[i]

                    if (element) idsRolAdd.push(rolInterno.uid)
                    else idsRolDelete.push(rolInterno.uid)
                }

                // Eliminacion de roles
                const bodyEliminacion = {
                    email: this.participanteSeleccionado.email,
                    accion: 'eliminar', 
                    roles: idsRolDelete
                }
                await this.axios.put(`/usuario/admin`, bodyEliminacion, config)

                // Agregar roles
                const bodyAgregacion = {
                    email: this.participanteSeleccionado.email,
                    accion: 'agregar', 
                    roles: idsRolAdd
                }
                await this.axios.put(`/usuario/admin`, bodyAgregacion, config)
            
            } catch (error) {
                console.log('error', error)

            } finally {
                this.dialogEliminarParticipante = false
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },

        async eliminarParticipante () {
            this.processing = {
                value: true,
                message: `Eliminando participante.`,
            }

            try {
                const idToken = this.$store.state.usuario.idToken
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                await axios.delete(`/participantes?email=${this.participanteSeleccionado.email}&idproyecto=${this.idProyecto}`, config)

                const indexDeleted = this.participantes.findIndex(v => v.uid === this.participanteSeleccionado.uid)
                this.participantes.splice(indexDeleted, 1)

            } catch (error) {
                console.log('error', error)

            } finally {
                this.dialogEliminarParticipante = false
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
        },
    },

    watch: {
        dialogAgregarParticipante: function () {
            this.correoNuevo = ''
        },
        dialogActualizarParticipante: function () {
            if (this.dialogActualizarParticipante) {
                
                
                return
            }

            this.participanteSeleccionado = null
            this.rolesInternosDeParticipante = Array.from({
                length: this.rolesInternos.length
            }, (v, i) => false)
        },
        dialogEliminarParticipante: function () {
            if (this.dialogEliminarParticipante) return

            this.participanteSeleccionado = null
            this.confirmacionEliminacionParticipante = ''
        },
    },
    
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        const idToken = this.$store.state.usuario.idToken

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}` 
            }
        }

        const responseParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, config)
        this.participantes = responseParticipantes.data
        .map(v => {
            return {
                uid: v.pk,
                ...v.fields
            }
        })

        // [
        //     {
        //         "model": "usuarios.usuario",
        //         "pk": 2,
        //         "fields": {
        //             "password": "!XqQhgH6XGumcq0xNR7Izm4s1Lr5Hd6EU8nRBpt9G",
        //             "last_login": null,
        //             "is_superuser": false,
        //             "email": "jessiprogram182@gmail.com",
        //             "username": "jessiprogram182",
        //             "nombres": "Jessica",
        //             "apellidos": "Alarcon",
        //             "is_staff": false,
        //             "is_active": true,
        //             "date_joined": "2022-09-09T01:47:50.919Z",
        //             "groups": [
        //                 1,
        //                 2,
        //                 3
        //             ],
        //             "user_permissions": []
        //         }
        //     }
        // ]

        // Listar roles externos
        const responseRolesInternos = await this.axios.get(`/rol/listar?tipo=Internos&idproyecto=${this.idProyecto}`, config)
        this.rolesInternos = responseRolesInternos.data
        .map(v => {
            return {
                uid: v.pk,
                ...v.fields
            }
        })

        // [
        //     {
        //         "model": "roles.rol",
        //         "pk": 3,
        //         "fields": {
        //             "nombre": "Srum Master",
        //             "tipo": "Interno",
        //             "descripcion": null,
        //             "rolGrupo": 3,
        //             "proyecto": 2
        //         }
        //     }
        // ]

    },
    
}
</script>

<style scoped>
.informacionAccion {
    /* rgba(230, 62, 62, 0.159) */
    background-color: rgba(255, 29, 137, 0.159);
}

.textoInformacionAccion {
    color: rgb(197, 52, 52);
}

.inputConfirmacionAccion {
    margin-left: 12px;
    margin-right: 12px;
}

</style>