import store from '@/store'
import axios from 'axios'

export default async ({ to, from, redirect }) => {
    if (!store.getters['usuario/estaAutenticado']) 
        redirect('/')
  
    // vemos si el usuario es participante
    const idToken = store.getters['usuario/getIdToken']
    const usuario = store.getters['usuario/getDatosUsuario']
    
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}` 
        }
    }

    try {
        let res = await axios.get(`/proyecto/participante?correo=${usuario.email}&idProyecto=${to.params.idProyecto}`, config)
        
        if(res.data === 'NoExiste') redirect('/')
    
    } catch (error) {
        redirect('/')
    }

}