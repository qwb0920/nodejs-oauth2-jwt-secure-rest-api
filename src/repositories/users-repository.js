export const UsersRepository = {
	getUsersById: async (client, id) => {
		const res = await client.query('SELECT * FROM users WHERE (us_id=$1)', [id]);
	
		return res.rows;
	},
	getUsersByLogin: async (client, login) => {
		const res = await client.query('SELECT * FROM users WHERE (us_login=$1)', [login]);
	
		return res.rows;
	},
	save: async (client, login, password) => {
		const res = await client.query('INSERT INTO users (us_login, us_password) VALUES ($1, $2) RETURNING us_id', [login, password]);
	
		return res.rows;
	},
	getUsersRoles: async (client, userId) => {
		const res = await client.query('SELECT * FROM user_roles JOIN roles ON (ur_ro_id=ro_id) WHERE (ur_us_id=$1) ORDER BY ro_name', [userId]);

		return res.rows;
	},
	saveUserRole: async (client, userId, roleId) => {
		const res = await client.query('INSERT INTO user_roles (ur_us_id, ur_ro_id) VALUES ($1, $2) RETURNING ur_id', [userId, roleId]);

		return res.rows;
	}
};
