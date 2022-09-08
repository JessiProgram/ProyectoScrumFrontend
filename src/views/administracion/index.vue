<template>
    <LayoutAdmin>
        <v-row class="container">
            <v-col cols="12" md="4">
                <v-card
                    class="cardItem mx-auto"
                >
                    <v-card-text>
                        <div>Administración ScrumLAB</div>
                        <p class="text-h4 text--primary">
                            Usuarios
                        </p>
                        <p>
                            "Agiliza tus procesos"
                        </p>
                        <div class="text--primary">
                            relating to or dependent on charity; charitable.<br>
                            "an eleemosynary educational institution."
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            to="/administracion/usuarios"
                            text
                            color="teal accent-4"
                        >
                            Comenzar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card
                    class="cardItem mx-auto"
                >
                    <v-card-text>
                        <div>Administración ScrumLAB</div>
                        <p class="text-h4 text--primary">
                            Roles
                        </p>
                        <p>
                            "Agiliza tus procesos"
                        </p>
                        <div class="text--primary">
                            relating to or dependent on charity; charitable.<br>
                            "an eleemosynary educational institution."
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text
                            color="teal accent-4"
                        >
                            Comenzar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card
                    class="cardItem mx-auto"
                >
                    <v-card-text>
                        <div>Administración ScrumLAB</div>
                        <p class="text-h4 text--primary">
                            Proyectos
                        </p>
                        <p>
                            "Agiliza tus procesos"
                        </p>
                        <div class="text--primary">
                            relating to or dependent on charity; charitable.<br>
                            "an eleemosynary educational institution."
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text
                            color="teal accent-4"
                        >
                            Comenzar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </LayoutAdmin>
  </template>
  
  <script>
  import LayoutAdmin from '@/layouts/Admin.vue';
  
  export default {
    name: 'HomeView',
    data() {
      return {

      }
    },
    components: {
        LayoutAdmin,
    },
    methods: {
  
      
    },
    created () {
      
    },
    mounted () {
      
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