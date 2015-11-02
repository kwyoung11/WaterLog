schemas = {  
    user: {
        id: null,
        email: null,
        password_digest: null,
        auth_token: null,
        salt: null,
        password_reset_token: null,
        password_reset_sent_at: null
       },
    device: {
        id: null,
        device_id:null,
        nickname: null
       }
}

module.exports = schemas;  