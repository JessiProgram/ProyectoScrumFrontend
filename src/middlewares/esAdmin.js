import store from '@/store'
 
export default ({ to, from, redirect }) => {
    if ( !store.getters['usuario/estaAutenticado'] ) {
        redirect('/')
    }

    if ( !store.getters['usuario/esAdministrador'] ) {
        redirect('/inicio')
    }
}