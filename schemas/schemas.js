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
        user_id: null,
        latitude: null,
        longitude: null,
        name: null,
        mode: null
       },
	data: {
		/* 1 is used to mark a required field */
		id: null,
		device_id: 1,
		data_type: 1,
		created_at: null,
		time_stamp:null,
		data_params: {
			water:{
				pH: null,
				temperature: null,
				turbidity: null
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
		}
	}
}

module.exports = schemas; 