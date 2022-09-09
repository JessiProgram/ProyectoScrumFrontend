<template>
    <LayoutDefault>
        <v-container>
            <h3>Roles Internos</h3>

            <!--Crear un rol interno-->
            <v-btn
            class="ma-2"
            outlined
            color="indigo"
            v-on:click="dialog=true">
                Agregar Rol
            </v-btn>

            <v-divider class="my-10"></v-divider>

            <!--Tabla datos-->
            <v-data-table :headers="Cabeceras" :items="rolesInternos" :items-per-page="5" class="elevation-1">
                <template v-slot:item.acciones="{ item }">
                    <v-icon class="mr-3" @click="editar(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon @click="borrar(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>

        </v-container>
        
        <v-dialog 
        v-model="dialog" 
        persistent 
        max-width="600px"
        >
            <v-card>
                <v-card-title>
                    <span class="text-h5">
                        <h3>Rol: </h3>
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Nombre" required v-model="nombreAgregar"></v-text-field>
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field label="Descripción" required v-model="descripcionAgregar">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <h4>Lista de Permisos</h4>
                                <v-checkbox
                                    v-for="(item, index) in listaPermisosInternosTotal" :key="index"
                                    v-model="listaPermisosRol[index]"
                                    :label="`${item}`"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>

                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialog = false">
                        Cerrar
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="agregar();
                    dialog = false;">
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </LayoutDefault>
</template>
<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '../../plugins/axios'

export default {
    name: '',
    data() {
        return {
            idProyecto: 0,
            proyecto: null,
            rolesInternos: [],
            rolSeleccionado: {},
            dialog: false,
            esAgregar: true,
            Cabeceras: [
                { text: 'Nombre', value: 'fields.nombre' },
                { text: 'Descripcion', value: 'fields.descripcion' },
                { text: 'Acciones', value: 'acciones' },
            ],

            listaPermisosInternosTotal:[
            'proyectos.crear_proyecto',
            'proyectos.eliminar_proyecto',
            'proyectos.actualizar_proyecto',
            'proyectos.archivar_proyecto',
            'proyectos.cambiar_estado_proyecto',
            'proyectos.listar_proyectos',
            'proyectos.iniciar_proyecto',
            'proyectos.crear_tipo_HU',
            'proyectos.borrar_tipo_HU',
            'proyectos.importar_roles_internos',
            'proyectos.agregar_participante',
            'proyectos.modificar_participante',
            'proyectos.borrar_participante',
            'proyectos.listar_participante',
            'proyectos.listar_roles_internos',
            'proyectos.crear_rol_interno',
            'proyectos.actualizar_rol_interno',
            'proyectos.borrar_rol_interno',
            ],
            // para actualizacion o agregacion
            idRol:0,
            listaPermisosRol: [],
            nombre:'',
            descripcion:'',
            listaPermisosRolAgregar:[],
            nombreAgregar:'',
            descripcionAgregar:'',
            rolInterno:{}

        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        // Listar roles externos
        const response = await this.axios.get(`/rol/listar?tipo=Internos&idproyecto=${this.idProyecto}`, config)
        this.rolesInternos = response.data

        console.log("rolesInternos", this.rolesInternos)
    },

    methods:{
        async agregar(){

            if(this.esAgregar){
                // crear rol


            } else {

                const idToken = this.$store.state.usuario.idToken

                console.log('listaPermisosRol',this.listaPermisosRol)

                let nuevosPermisosi= []
                for (let i = 0; i < this.listaPermisosInternosTotal.length; i++) {
                    const element = this.listaPermisosRol[i];
                    if(!!element){
                        console.log("Se agrega ",i)
                        nuevosPermisosi.push(i)
                    }
                }

                let nuevosPermisos = []
                let num = 0
                for (let i = 0; i < this.listaPermisosInternosTotal.length; i++) {
                    if(i==nuevosPermisosi[num]){
                        console.log("this.listaPermisosInternosTotal[nuevosPermisosi[i]]",this.listaPermisosInternosTotal[i])
                        nuevosPermisos.push(this.listaPermisosInternosTotal[i])
                        num++
                    }
                }
                
                console.log('this.listaPermisosRolAgregar',nuevosPermisos)

                const config0 = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }


                // Eliminacion de roles
                const body2 = {
                    id: this.idRol,
                    idProyecto: this.idProyecto,
                    nombreNuevo: this.nombreAgregar,
                    descripcionNueva:this.descripcionAgregar,
                    tipo: 'Interno',
                    accion: 'eliminar',
                    permisos: this.listaPermisosInternosTotal
                }
                
                await this.axios.put(`/rol`, body2, config0)

                // Agregar roles
                const body1 = {
                    id: this.idRol,
                    idProyecto: this.idProyecto,
                    nombreNuevo: this.nombreAgregar,
                    descripcionNueva:this.descripcionAgregar,
                    tipo: 'Interno',
                    accion: 'agregar',
                    permisos: nuevosPermisos
                }
                
                let a = await this.axios.put(`/rol`, body1, config0)

                console.log('a',a)


            }

            this.esAgregar = true

        },
        async editar(rol){
            this.esAgregar = false
            // ponemos los valores
            this.listaPermisosRol = []
            this.nombreAgregar = rol.fields.nombre
            this.descripcionAgregar = rol.fields.descripcion
            this.idRol = rol.pk

            // leer todos los permisos del rol

            let idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }

            // Listar roles externos
            const response = await this.axios.get(`rol?id=${rol.pk}`, config)
            this.rolInterno = response.data
            for (let index = 1; index < this.rolInterno.length; index++) {
                let listaPermisos = this.rolInterno[index].fields.codename;
                this.listaPermisosRol.push(listaPermisos)
            }      
            console.log('listaPermisosRol',this.listaPermisosRol)

            this.dialog = true

        },
        async borrar(){
            
        }
    }

}
</script>

<style>

</style>