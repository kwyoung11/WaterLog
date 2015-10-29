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
	   },
	data: {
		id: null,
		device_id: null,
		data_type: null,
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