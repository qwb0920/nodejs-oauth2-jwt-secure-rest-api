import bcrypt from 'bcrypt';

import { config } from './../config/config';
import { UsersRepository } from './../repositories/users-repository';
import { RolesRepository } from './../repositories/roles-repository';

export const UserService = {
	login: async (client, username, password) => {
		let obj = undefined;

		const rows = await UsersRepository.getUsersByLogin(client, username);
		if (rows.length == 1) {
			const compare = await bcrypt.compare(password, rows[0].us_password);
			if (compare) {
				obj = rows[0];
			}
		}

		return obj;
	},
	save: async (client, username, password) => {
		let obj = undefined;
		let rows = [];

		rows = await UsersRepository.getUsersByLogin(client, username);
		if (rows.length == 0) {
			// login użytkownika musi być unikalny
			const hash = await bcrypt.hash(password, config.bcrypt.saltRounds);
			const temp = await UsersRepository.save(client, username, hash);
			rows = await UsersRepository.getUsersById(client, temp[0].us_id);
			obj = rows[0];
			rows = await RolesRepository.getRolesByName(client, 'ROLE_USER'); // ro_id = 1
			if (rows.length === 1) {
				rows = await UsersRepository.saveUserRole(client, obj.us_id, rows[0].ro_id);
			}
		}

		return obj;
	},
	getUsersRoles: async (client, userId) => {
		return await UsersRepository.getUsersRoles(client, userId);
	},
	getUserByLogin: async (client, username) => {
		let obj = undefined;

		const rows = await UsersRepository.getUsersByLogin(client, username);
		if (rows.length == 1) {
			obj = rows[0];
		}

		return obj;
	}
};
