dataRanges = {  
	//id: null,
	//device_id: 1,
	//data_type: 1,
	//created_at: null,
	//collected_at:null,
	water:{
		pH: {
			type: 0,
			min: 0,
			max: 14,
		},
		temperature: {
			type: 0
		},
		turbidity: {
			type: 0
		}
	},
	air:{
		carbon_monoxide: {
			type: 0
		},
		nitrogen_dioxide: {
			type: 0
		},
		ozone: {
			type: 0
		},
		sulphur_dioxide: {
			type: 0
		}
	},
	soil:{
		pH: {
			type: 0,
			min: 0,
			max: 14
		},
		soil_nitrate: {
			type: 0
		},
		electrical_conductivity: {
			type: 0
		}
	},
	latitude: {
				type: 0
			},
	longitude: {
				type: 0
			}
}

module.exports = dataRanges; 