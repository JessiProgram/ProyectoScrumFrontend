<template>
    <LayoutAdmin>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <div class="container">
            <v-card 
                v-for="item in listaUsuarios" :key="item.uid" 
                class="mx-auto"
                width="600"
            >
                <v-img
                    height="120px"
                    :src="`https://source.unsplash.com/random/1440x900?sig=${item.uid}`"
                >
                    <v-card-title class="white--text mt-8">
                        <v-avatar size="56">
                        <img
                            alt="user"
                            :src="`https://robohash.org/${item.email}?set=set4`"
                        >
                        </v-avatar>
                        <p class="ml-3">
                            {{ item.username }}
                        </p>
                    </v-card-title>
                </v-img>

                <v-card-text class="text-center">
                    <div class="">
                        <v-btn
                            @click="verUsuario(item)"
                            color="blue"
                            text
                            outlined
                        >
                            Ver usuario
                        </v-btn>
                    </div>
                </v-card-text>
            </v-card>
        </div>

        <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
        >
            <v-card v-if="usuarioSeleccionado">
                <v-toolbar
                    dark
                    color="primary"
                >
                    <v-btn
                        icon
                        dark
                        @click="dialog = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>
                        {{usuarioSeleccionado.username}}
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <!-- <v-btn
                        dark
                        text
                        @click="dialog = false"
                        >
                        Save
                        </v-btn> -->
                    </v-toolbar-items>
                </v-toolbar>

                <div class="container my-5 px-10">
                    <h2>Correo</h2>
                    <v-divider />
                    {{usuarioSeleccionado.email}}

                    <v-row class="mt-3">
                        <v-col cols="12" md="6">
                            <h2>Nombre de usuario</h2>
                            <v-divider />
                            {{usuarioSeleccionado.username}}
                        </v-col>
                        <v-col cols="12" md="6">
                            <h2>Nombre completo</h2>
                            <v-divider />
                            {{usuarioSeleccionado.nombres}} {{usuarioSeleccionado.apellidos}}
                        </v-col>
                    </v-row>

                </div>

                <v-divider></v-divider>

                <div class="container mt-5">
                    <h2>
                        Roles:
                    </h2>

                    <v-checkbox
                        v-for="(item, index) in listaRoles" :key="index"
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
    </LayoutAdmin>
  </template>
  
  <script>
  import LayoutAdmin from '@/layouts/Admin.vue'
  
  export default {
    name: 'HomeView',
    data() {
        return {
            listaUsuarios: [],
            listaRoles: [],

            dialog: false,
            usuarioSeleccionado: null,
            rolesDelUsuario: [],
            listaRolesSeleccionados: [],

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
                    text: 'Administración',
                    disabled: false,
                    href: '/administracion',
                },
                {
                    text: 'Usuarios',
                    disabled: true,
                    href: '/administracion/usuarios',
                },
            ],
        }
    },
    components: {
        LayoutAdmin,
    },
    methods: {
        verUsuario (data) {
            this.dialog = true
            this.usuarioSeleccionado = data
        },
        async actualizarRolesDelUsuario () {
            this.processing = {
                value: true,
                message: `Actualizando roles del usuario.`,
            }

            try {
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
            } catch (error) {
                console.log('error', error)
                
            } finally {
                this.processing = {
                    value: false,
                    message: ``,
                }
            }
            
        },
        getListaRolesSeleccionados () {
            const listaRolesSeleccionadosAux = Array.from({length: this.listaRoles.length}, (v, i) => false)
            for (let i = 0; i < this.listaRoles.length; i++) {
                const rol = this.listaRoles[i]
                listaRolesSeleccionadosAux[i] = this.rolesDelUsuario.includes(rol.uid)
            }

            return listaRolesSeleccionadosAux
        }
    },
    watch: {
        usuarioSeleccionado: async function () {
            if (!this.usuarioSeleccionado) return

            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            
            const response = await this.axios.get(`/usuario/admin/roles?email=${this.usuarioSeleccionado.email}`, config)
            this.rolesDelUsuario = response.data.map(v => parseInt(v))

            this.listaRolesSeleccionados = this.getListaRolesSeleccionados()
        },
        dialog: function () {
            if (this.dialog) return 
            this.usuarioSeleccionado = null
            this.rolesDelUsuario = []
            this.listaRolesSeleccionados = []
        },
    },
    async created () {
        const idToken = this.$store.state.usuario.idToken

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}` 
            }
        }

        const response = await this.axios.get('/usuario/admin', config)
        const listaResponse = response.data

        this.listaUsuarios = listaResponse
        .filter(v => v.fields.email !== 'AnonymousUser')
        .map(v => {
            const model = {
                uid: v.pk,
                ...v.fields,
            }

            delete model.user_permissions
            delete model.is_active
            delete model.is_superuser
            delete model.is_staff

            return model
        })

        // Lista de roles
        const response1 = await this.axios.get('/rol/listar?tipo=Externos', config)
        const listaResponse1 = response1.data

        this.listaRoles = listaResponse1
        .map(v => {
            const model = {
                uid: v.pk,
                ...v.fields,
            }

            return model
        })
    }
  }
  </script>
  
<style scoped>
.cardItem {
    width: 300px;
}

@media (max-width: 959px) {
    .cardItem {
        width: 100%;
    }
}
</style>