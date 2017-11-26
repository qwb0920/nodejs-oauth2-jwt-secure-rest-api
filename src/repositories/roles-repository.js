export const RolesRepository = {
	getRolesByName: async (client, name) => {
		const res = await client.query('SELECT * FROM roles WHERE (ro_name=$1)', [name]);

		return res.rows;
	}
};
