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
        user_id:null
       },
	data: {
		/* 1 is used to mark a required field */
		id: null,
		device_id: 1,
		data_type: 1,
		created_at: null,
		data_params: {
			water:{
				pH: null,
				temperature: null,
				water_flow: null,
				turbidity: null
			},
			air:{},
			soil:{}
		}
	}
}

module.exports = schemas;  