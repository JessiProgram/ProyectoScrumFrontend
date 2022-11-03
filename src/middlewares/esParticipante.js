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

        let permisosDelRol = []
        // vemos si tiene ya guardados los permisos
        
        if(store.getters['usuario/getProyectoID'] != to.params.idProyecto) {
            // buscamos los roles del proyecto
            const rolesInternosProyecto = (await axios.get(`/rol/listar?tipo=Internos&idproyecto=${to.params.idProyecto}`, config)).data

            // buscamos los roles internos del usuario
            const rolesUsuarioInternos = (await axios.get(`/usuario/admin/roles?email=${usuario.email}`, config)).data
            
            // buscamos los permisos
            let permisosRes = []
            for (let i = 0; i < rolesUsuarioInternos.length; i++) {
                const rol = rolesUsuarioInternos[i];
                
                if(rolesInternosProyecto.map(e => e.pk).indexOf(Number(rol)) !== -1){

                    const response = await axios.get(`/rol/?id=${rol}&tipo=Interno`, config)
                    permisosRes = response.data
                    for (let i = 1; i < permisosRes.length; i++) {
                        const element = permisosRes[i].fields.codename;
                        permisosDelRol.push(element)
                    }
                }
            }

            // set permisos y idproyecto
            store.commit('usuario/setProyectoID',to.params.idProyecto)
            store.commit('usuario/setPermisosProyecto', permisosDelRol)
        }
        
        
    } catch (error) {
        console.log('error',error)
        redirect('/')
    }

}