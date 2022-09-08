<template>
    <LayoutDefault>
        <v-container>
            <h3>Participantes</h3>

            <v-text-field label="Correo" v-model="correoAgregar"></v-text-field>

            <v-btn v-if="$store.getters['usuario/estaAutenticado']" class="blue--text mr-2 mb-2" outlined 
            v-on:click="agregarParticipante()"
            >
                Agregar
            </v-btn>
        
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
            idProyecto:0,
            proyecto:null,
            correoAgregar:''
        }
    },
    components: {
        LayoutDefault,
    },
    async mounted() {
        this.idProyecto = this.$route.params.idProyecto
        

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
        }
    }
    
}
</script>

<style>

</style>