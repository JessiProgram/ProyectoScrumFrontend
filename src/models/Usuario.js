class Usuario {
    constructor (data = {}) {
        const { uid, email, username, displayName, isActive, createdAt, lastLogin } = data

        this.uid = uid ? uid : ''
        this.email = email ? email : ''
        this.username = username ? username : ''
        this.displayName = displayName ? displayName : ''
        this.isActive = isActive !== undefined ? isActive : false
        this.createdAt = createdAt ? createdAt : null
        this.lastLogin = lastLogin ? lastLogin : null
    }

    getUsuario () {
        return {
            uid: this.uid, 
            email: this.email, 
            username: this.username, 
            displayName: this.displayName, 
            isActive: this.isActive, 
            createdAt: this.createdAt, 
            lastLogin: this.lastLogin, 
        }
    }

    setUsuario (data = {}) {
        const { uid, email, username, displayName } = data

        this.setUid(uid)
        this.setEmail(email)
        this.setUsername(username)
        this.setDisplayName(displayName)
    }

    setUid (uid = '') {
        this.uid = uid
    }

    setEmail (email = '') {
        this.email = email
    }

    setUsername (username = '') {
        this.username = username
    }

    setDisplayName (displayName = '') {
        this.displayName = displayName
    }
}

export default Usuario