<template>
    <LayoutDefault>

        <v-container>
            <h3>Tipo Historias de Usuario</h3>

            <v-text-field
            v-model="nombre"
            label="Nombre Tipo Historia Usuario"
            required
            ></v-text-field>
           
            <v-btn
            class="ma-2"
            outlined
            :disabled="!nombre"
            @click="crear()"
            color="indigo">
            Crear Tipo Historia Usuario
            </v-btn>

            {{listaTiposHU}}
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
            idProyeto: 0,
            proyecto: null,

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
                    text: 'Tipo historias usuarios',
                    disabled: true,
                    href: '/tipo-historias-usuarios',
                },
            ],

            nombre:'',
            listaTiposHU:[]
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

        // listamos tipos de HU
        // llamamos al backend y solicitamos lo proyectos del usuario
        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}` 
            }
        }

        let res = await axios.get(`/tipoHistoriaUsuario?idproyecto=${this.idProyecto}`, config)

        this.listaTiposHU = res.data
    },
    methods:{
        async crear(){
            const idToken = this.$store.state.usuario.idToken

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}` 
                    }
                }

                const body = {
                    nombre: this.nombre,
                    id_proyecto: this.idProyecto,
                    columnas: ['Todo', 'Doing','Done']
                }

                const response = await this.axios.post(`/tipoHistoriaUsuario`, body, config)
                alert("Tipo Historia Usuario Creada")
            }

    }
    
}
</script>

<style>

</style>