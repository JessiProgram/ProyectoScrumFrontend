<template>
    <LayoutDefault>
        <div class="container">
            <v-breadcrumbs :items="items">
                <template v-slot:divider>
                    <v-icon>mdi-forward</v-icon>
                </template>
            </v-breadcrumbs>
        </div>

        <v-container class="container" v-if="proyecto && proyecto.fields">
            <h3 class="mb-2">Burndonw Chart</h3>
            
            <LineChart v-if="x.length" :dataYreal="yreal" :dataX="x" :dataYideal="yideal"/>

            <div v-else class="text-center mt-15" >
                <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                v-if="!textoMostrar"
                ></v-progress-circular>
                <div v-else>
                    {{textoMostrar}}
                </div>
            </div>

        </v-container>
        
    </LayoutDefault>
</template>

<script>
import LayoutDefault from '@/layouts/Default.vue';
import axios from '@/plugins/axios'
import LineChart from '@/components/Line.vue'

export default {
    name: '',
    data() {
        return {
            idProyecto: 0,
            proyecto:null,
            
            puntos: [],
            yideal: [],
            yreal:[],
            x:[],

            textoMostrar:'',

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
                    text: `Reportes`,
                    disabled: true,
                    href: `/proyecto/${this.$route.params.idProyecto}/reportes`,
                },
            ],
        }
    },

    components: {
        LayoutDefault,
        LineChart,
    },

    
    methods:{
        async generarBurndownChart(){
            try{
                let idToken = this.$store.state.usuario.idToken

                // Llamamos al backend
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`
                    }
                }
                

                let res = await axios.get(`/sprints/burndown-chart?idProyecto=${this.idProyecto}`, config)

                this.puntos = res.data

                this.xreal = []
                this.yreal = []

                for (let i = 0; i < this.puntos.length/2; i++) {
                    const punto = this.puntos[i];
                    this.x.push('Sprint ' + punto[0])
                    this.yreal.push(punto[1] ? punto[1] : 0)
                }
                for (let i = this.puntos.length/2; i < this.puntos.length; i++) {
                    const punto = this.puntos[i];
                    this.yideal.push(punto[1] >= 0 ? punto[1] : 0)
                }

                console.log('this.x',this.x)

            } catch (error) {
                console.log(error)
                if (error.response.data.length <= 200) {
                    if(error.response.data.includes('No se pudieron obtener los puntos del Burndown Chart'))
                        this.textoMostrar = "Aun no se puede generar el reporte, no hay datos"
                    else
                        alert(error.response.data)
                } else {
                    alert("Ha ocurrido un error inesperado")
                }
            }

        },
    },

    async created() {
        this.idProyecto = this.$route.params.idProyecto
        let idToken = this.$store.state.usuario.idToken

        // Llamamos al backend
        let config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${idToken}`
            }
        }
        
        let res = await axios.get(`/proyecto/?q=${this.idProyecto}`, config)

        this.proyecto = res.data[0]

        this.generarBurndownChart()
    },

}
</script>
<style>

</style>