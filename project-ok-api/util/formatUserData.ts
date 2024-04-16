interface UserData {
	user_id: number;
	name: string;
	username: string;
	email: string;
	address_street: string;
	address_suite: string;
	address_city: string;
	address_zipcode: string;
	address_lat: string;
	address_lng: string;
	phone: string;
	website: string;
	company_name: string;
	catch_phrase: string;
	bs: string;
	created_at: Date;
	modified_at: Date;
}

function formatUserData(userData: UserData) {
	return {
		id: userData.user_id,
		name: userData.name,
		username: userData.username,
		email: userData.email,
		address: {
			street: userData.address_street,
			suite: userData.address_suite,
			city: userData.address_city,
			zipcode: userData.address_zipcode,
			geo: {
				lat: userData.address_lat,
				lng: userData.address_lng,
			},
		},
		phone: userData.phone,
		website: userData.website,
		company: {
			name: userData.company_name,
			catchPhrase: userData.catch_phrase,
			bs: userData.bs,
		},
		created_at: userData.created_at,
		modified_at: userData.modified_at,
	};
}

module.exports = formatUserData;
