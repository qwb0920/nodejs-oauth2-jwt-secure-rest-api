import expressPromiseRouter from 'express-promise-router';

import { config } from './../config/config';
import { Errors } from './../lib/errors';
import { database } from './../lib/database';
import { jwtPromise } from './../lib/jsonwebtoken-promise';
import { UserService } from './../services/users-service';

export const router = expressPromiseRouter();

const createJti = (len) => {
	let result = '';
	const charset = '01234567890ABCDEFGHIJKLMNOPQESTUVWXYZabcdefghijklmnopqrstuvwxyz';

	result = '';
	for (let i = 0; i < len; i += 1) {
		result += charset[Math.floor(Math.random() * charset.length)].toString();
	}

	return `${result.substr(0, 8)}-${result.substr(8, 4)}-${result.substr(12, 4)}-${result.substr(16, 4)}-${result.substr(20, 12)}`;
};

const checkClientCredentials = (authorization) => {
	let result = false;

	if (authorization) {
		let auth = authorization.split(' ');
		if (auth.length == 2) {
			if (auth[0].toLowerCase() === 'basic') {
				let token = Buffer.from(auth[1], 'base64').toString().split(':');
				if (token.length == 2) {
					if ((token[0] === config.oauth2.clientId) && (token[1] === config.oauth2.secret)) {
						result = true;
					}
				}
			}
		}
	}

	return result;
};

const createAccessToken = async (user, roles, jti) => {
	const payload = {
		aud:         [ 'oauth2_id' ],
		user_name:   user.us_login,
		scope:       [ 'read', 'write' ],
		exp:         Math.floor((new Date().getTime() + config.oauth2.accessTokenValiditySeconds * 1000) / 1000),
		authorities: roles.map((element) => { return element.ro_name }),
		jti:         jti,
		client_id:   config.oauth2.clientId
	};
	const token = await jwtPromise.sign(payload, config.jwt.secret);
	
	return token;
};

const createRefreshToken = async (user, roles, ati, jti) => {
	const payload = {
		aud:         [ 'oauth2_id' ],
		user_name:   user.us_login,
		scope:       [ 'read', 'write' ],
		ati:         ati,
		exp:         Math.floor((new Date().getTime() + config.oauth2.refreshTokenValiditySeconds * 1000) / 1000),
		authorities: roles.map((element) => { return element.ro_name }),
		jti:         jti,
		client_id:   config.oauth2.clientId
	};
	const token = await jwtPromise.sign(payload, config.jwt.secret);

	return token;
};

/**
 * Zalogowanie użytkownika i odebranie tokenów.
 * Nagłówek: Authorization: Basic [clientId]:[secret]
 *           Content-Type: application/x-www-form-urlencoded
 * Parametry typu POST: grant_type, username, password.
 * 
 * Narazie tylko obsługa: grant_type = password
 * Narazie brak obsługi: grant_type = refresh_token
 */
router.route('/token').post(async (req, res) => {
	try {
		if (req.headers['authorization']) {
			const result = checkClientCredentials(req.headers['authorization']);
			if (result) {
				if (req.body.grant_type === '') {
					res.status(400).json(Errors.create(req, 400, 'invalid_request', 'Missing grant type'));
				}
				else if (req.body.grant_type === 'password') {
					if (req.body.username && req.body.password) {
						const client = await database.connect();
						try {
							const user = await UserService.login(client, req.body.username, req.body.password);
							if (user) {
								const roles = await UserService.getUsersRoles(client, user.us_id);
								const jti = createJti(32);
								const jti2 = createJti(32);
								const accessToken = await createAccessToken(user, roles, jti);
								const refreshToken = await createRefreshToken(user, roles, jti, jti2);
								res.json({
									access_token: accessToken,
									token_type: 'bearer',
									refresh_token: refreshToken,
									expires_in: config.oauth2.accessTokenValiditySeconds,
									scope: 'read write',
									jti: jti
								});
							}
							else {
								res.status(400).json(Errors.create(req, 400, 'invalid_grant', 'Bad credentials'));
							}
						}
						catch (err) {
							throw err;
						}
						finally {
							client.release();
						}
					}
					else {
						res.status(400).json(Errors.create(req, 400, 'invalid_grant', 'Bad credentials'));
					}
				}
				else if (req.body.grant_type === 'refresh_token') {
					if (req.body.refresh_token) {
						// TODO:
						res.send('TODO: Refresh token inplementation.');
					}
					else {
						res.status(400).json(Errors.create(req, 400, 'invalid_grant', 'Bad credentials'));
					}
				}
				else {
					res.status(400).json(Errors.create(req, 400, 'unsupported_grant_type', `Unsupported grant type`));
				}
			}
			else {
				res.status(401).json(Errors.create(req, 401, 'Unauthorized', 'Bad credentials'));
			}
		}
		else {
			res.status(401).json(Errors.create(req, 401, 'Unauthorized', 'Full authentication is required to access this resource'));
		}
	}
	catch (err) {
		res.status(500).json(Errors.create(req, 500, 'internal_server_error', 'Internal server error'));
		throw err;
	}
});
