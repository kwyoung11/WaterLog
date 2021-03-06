schemas = {  
	user: {
        id: null,
        email: null,
        password_digest: null,
        auth_token: null,
        salt: null,
        password_reset_token: null,
        password_reset_sent_at: null,
        public_key: null,
        private_key: null,
		shared_private_key: null,
        email_confirmation_token: null,
        email_confirmed: null,
        private_profile: null,
        invites_active: null,
        failed_login_attempts: null,
        last_failed_login: null,
				is_admin: null
       },
    device: {
        id: null,
        user_id: null,
        latitude: null,
        longitude: null,
        name: null,
        mode: null,
        type_of_data: null,
        keys:[],
        units:[],
        ignore_post_requests: null,
       },
    invitation: {
    	id: null,
      	user_id: null,
        token: null,
        recipient_email: null
    },
	data: {
		/* 1 is used to mark a required field in a data post*/
		id: null,
		device_id: 1,
		data_type: 1,
		created_at: null,
		collected_at:null,
		data_params: {
			water:{
				ph: null,
				temperature: null,
				turbidity: null,
				water_flow: null
			},
			air:{
				carbon_monoxide: null,
				nitrogen_dioxide: null,
				ozone: null,
				sulphur_dioxide: null
			},
			soil:{
				pH: null,
				soil_nitrate: null,
				electrical_conductivity: null
			}
		},
		latitude: null,
		longitude: null
	}
}

module.exports = schemas; 
