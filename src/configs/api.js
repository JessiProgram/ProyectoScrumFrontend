const api = {
    url: process.env.NODE_ENV !== 'development' ? 
        'http://localhost:8000/api/v1' : 
        'https://proyectoscrumgrupo5.herokuapp.com/api/v1'
}

export default api