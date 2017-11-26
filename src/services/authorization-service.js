import { jwtPromise } from './../lib/jsonwebtoken-promise';

import { config } from './../config/config';
import { Errors } from './../lib/errors';

export const AuthorizationService = {
	check: async (req, res, next) => {
		const authorization = req.headers['authorization'];

		if (authorization) {
			let auth = authorization.split(' ');
			if (auth.length == 2) {
				if (auth[0].toLowerCase() === 'bearer') {
					let token = auth[1];
					try {
						const decoded = await jwtPromise.verify(token, config.jwt.secret);
						if (decoded.ati) {
							return res.status(401).json(Errors.create(req, 401, 'invalid_token', 'Encoded token is a refresh token'));
						}
						else {
							req.decoded = decoded;
							next();
						}
					}
					catch (err) {
						if (err.name && err.name === 'TokenExpiredError') {
							return res.status(403).json(Errors.create(req, 403, 'expired_token', 'Token expired'));
						}
						else {
							return res.status(401).json(Errors.create(req, 401, 'invalid_token', 'Cannot convert access token to JSON'));
						}
					}
				}
			}
			else {
				return res.status(401).json(Errors.create(req, 401, 'invalid_token', 'Cannot convert access token to JSON'));
			}
		}
		else {
			return res.status(401).json(Errors.create(req, 401, 'unauthorized', 'An Authentication object was not found'));
		}
	}
};
