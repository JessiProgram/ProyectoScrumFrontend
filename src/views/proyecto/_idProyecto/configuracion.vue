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
            <h3>Configuración del proyecto</h3>

            <v-text-field
            v-model="nombre"
            label="Nombre Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="descripcion"
            label="Descripcion Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="scrumMaster"
            :readonly="true"
            label="Correo Scrum Master Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="fechaInicio"
            :readonly="true"
            label="Fecha Inicio del Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="fechaFin"
            :readonly="true"
            label="Fecha Fin del Proyecto"
            required
            ></v-text-field>

            <v-text-field
            v-model="estado"
            :readonly="true"
            label="Estado del Proyecto"
            required
            ></v-text-field>

            <v-btn
            class="ma-2"
            outlined
            :disabled="!nombre || !descripcion || !scrumMaster"
            @click="actualizar()"
            color="indigo">
            Actualizar Proyecto
            </v-btn>
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

            idProyeto:0,
            proyecto:null,
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
                    text: 'Configuración',
                    disabled: true,
                    href: '/configuracion',
                },
            ],

            nombre: "",
            descripcion: "",
            fechaInicio: null,
            fechaFin: null,
            estado:"",
            scrumMaster: ""

        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken


        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }

        try {
            let res = await axios.get(`proyecto/?q=${this.idProyecto}`, config)

            let proyecto = res.data[0]

            this.nombre = proyecto.fields.nombre
            this.descripcion = proyecto.fields.descripcion
            this.fechaInicio = proyecto.fields.fechaInicio ? new Date(proyecto.fields.fechaInicio).toLocaleString() : null
            this.fechaFin = proyecto.fields.fechaFin ? new Date(proyecto.fields.fechaFin).toLocaleString() : null
            this.estado = proyecto.fields.estado
            this.scrumMaster = proyecto.fields.scrumMaster 
        } catch (error) {
            alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
        }

    },
    methods:{
        async actualizar(){
            
            const idToken = this.$store.state.usuario.idToken

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}` 
                }
            }
            const body1 = {
                id: this.idProyecto,
                nombre: this.nombre,
                descripcion:this.descripcion
            }
            
            try {
                await this.axios.put(`/proyecto/`, body1, config)

                alert("Proyecto Actualizado")
            } catch (error) {
                alert("No tienes los permisos necesarios para realizar esta acción, consulta con el Scrum Master del proyecto")
            }
                
        }
    }
    
}
</script>

<style>

</style>