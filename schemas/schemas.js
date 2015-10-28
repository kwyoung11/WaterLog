schemas = {  
    user: {
        id: null,
        email: null,
        password_digest: null,
        auth_token: null,
        salt: null
       },
    device: {
        id: null,
        user_id:null
       }
}

module.exports = schemas;  