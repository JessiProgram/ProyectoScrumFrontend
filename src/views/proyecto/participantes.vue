<template>
    <LayoutDefault>
        <v-container>
            <h3>Participantes</h3>

            <v-text-field label="Correo" v-model="correoAgregar"></v-text-field>

            <div v-if="rolesInternosNombre.length!=0">
                <v-combobox
                v-model="select"
                :items="rolesInternosNombre"
                label="Roles"
                multiple
                outlined
                dense
                
                ></v-combobox>
            </div>

            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="agregarParticipante()"
            >
                Agregar
            </v-btn>

            <v-data-table 
            :headers="Cabeceras" 
            :items="participantes" 
            :items-per-page="5" 
            class="elevation-1">
                <template v-slot:item.acciones="{ item }">
                    <v-icon class="mr-3" @click="editar(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon @click="borrar(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>

            <v-dialog
                v-model="dialog"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition"
            >
                <div class="container mt-5">
                    <h2>
                        Roles:
                    </h2>

                    <v-checkbox
                        v-for="(item, index) in rolesInternos" :key="index"
                        v-model="listaRolesSeleccionados[index]"
                        :label="`${item.uid} - ${item.nombre}`"
                    ></v-checkbox>

                    <v-divider class="mb-6" />

                    <v-btn
                        @click="actualizarRolesDelUsuario"
                        class="mr-2"
                        outlined
                        color="green"
                    >
                        Actualizar roles
                    </v-btn>
                </div>
        </v-dialog>
        
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
            listaUsuarios: [],
            listaRoles: [],
            dialog: false,
            usuarioSeleccionado: null,
            rolesDelUsuario: [],
            listaRolesSeleccionados: [],

            idProyecto:0,
            proyecto:null,
            correoAgregar:'',
            Cabeceras: [
                { text: 'Email', value: 'fields.email' },
                { text: 'Nombres', value: 'fields.nombres' },
                { text: 'Apellidos', value: 'fields.apellidos' },
                //{ text: 'Roles', value: 'roles' },
                { text: 'Acciones', value: 'acciones' }
            ],
            participantes:[],
            rolesInternosNombre:[],
            rolesInternosId:[],
            select: [],
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

        let config0 = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}` 
            }
        }


        let resParticipantes = await axios.get(`/proyecto/listar-participantes?idproyecto=${this.idProyecto}`, config0)

        let participantes = resParticipantes.data
        this.participantes = participantes

        console.log('participantes',participantes)

        // obtenemos los roles internos
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        // Listar roles externos
        const response = await this.axios.get(`/rol/listar?tipo=Internos&idproyecto=${this.idProyecto}`, config)
        let roles = response.data

        for (let i = 0; i < roles.length; i++) {
            const element = roles[i];
            this.rolesInternos.push({id:element.pk,nombre:element.fields.nombre})
        }


    },
    methods:{
        async agregarParticipante(){
            let idToken = this.$store.state.usuario.idToken


            console.log(this.correoAgregar)

            let config0 = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }


            let resUsuario = await axios.get(`/usuario/existe?email=${this.correoAgregar}`, config0)

            let usuario = resUsuario.data[0]

            console.log('usuario',usuario)

            if (!usuario){
                alert("No existe el usuario")
                return
            }

            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            let body = {
                idProyecto: Number(this.idProyecto),
                idUsuario: usuario.pk
            }

            console.log("body",body)

            let res = await axios.post('/participantes', body, config)
            
            console.log(res.data)

            this.participantes.push(usuario)

        },

        async actualizarRolesDelUsuario () {
            const listaRolesSeleccionadosActual = this.getListaRolesSeleccionados()

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }

            const idsRolAdd = []
            const idsRolDelete = []
            for (let i = 0; i < listaRolesSeleccionadosActual.length; i++) {
                const elementActual = listaRolesSeleccionadosActual[i]
                const elementNuevo = this.listaRolesSeleccionados[i]

                if (elementNuevo) {
                    idsRolAdd.push( this.listaRoles[i].uid )
                }
                
                if (elementActual && !elementNuevo) {
                    idsRolDelete.push( this.listaRoles[i].uid )
                }
            }

            // Eliminacion de roles
            const body2 = {
                email: this.usuarioSeleccionado.email,
                accion: 'eliminar', 
                roles: idsRolDelete
            }
            await this.axios.put(`/usuario/admin`, body2, config)

            // Agregar roles
            const body1 = {
                email: this.usuarioSeleccionado.email,
                accion: 'agregar', 
                roles: idsRolAdd
            }
            await this.axios.put(`/usuario/admin`, body1, config)
            
        },
        getListaRolesSeleccionados () {
            const listaRolesSeleccionadosAux = Array.from({length: this.listaRoles.length}, (v, i) => false)
            for (let i = 0; i < this.listaRoles.length; i++) {
                const rol = this.listaRoles[i]
                listaRolesSeleccionadosAux[i] = this.rolesDelUsuario.includes(rol.uid)
            }

            return listaRolesSeleccionadosAux
        },

        async editar(participante){
            this.esAgregar = false
            // ponemos los valores
            
            this.dialog = true

        },
        async borrar(){
            
        }
    }
    
}
</script>

<style>

</style>