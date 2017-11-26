import expressPromiseRouter from 'express-promise-router';

import { Errors } from './../lib/errors';
import { database } from './../lib/database';
import { UserService } from './../services/users-service';

export const router = expressPromiseRouter();

/**
 * Utworzenie nowego użytkownika.
 * Parametry typu POST: username, password
 */
router.route('/save').post(async (req, res, next) => {
	try {
		if (req.body.username && req.body.password) {
			let user = undefined;
			const client = await database.connect();
			try {
				await client.query('BEGIN');
				user = await UserService.save(client, req.body.username, req.body.password);
				await client.query('COMMIT');
				if (user) {
					res.send(`User "${req.body.username}" saved.`);
				}
				else {
					res.status(400).json(Errors.create(req, 400, 'user_exists', 'User exists'));
				}
			}
			catch (err) {
				await client.query('ROLLBACK');
				throw err;
			}
			finally {
				client.release();
			}
		}
		else {
			res.status(400).json(Errors.create(req, 400, 'wrong_parameters', 'Wrong parameters'));
		}
	}
	catch (err) {
		res.status(500).json(Errors.create(req, 500, 'internal_server_error', 'Internal server error'));
		throw err;
	}
});
