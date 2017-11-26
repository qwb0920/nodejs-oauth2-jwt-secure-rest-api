import jwt from 'jsonwebtoken';

export const jwtPromise = {
	sign: (payload, secretOrPrivateKey) => {
		return new Promise((resolve, reject) => {
			jwt.sign(payload, secretOrPrivateKey, (err, token) => {
				if (err) {
					return reject(err);
				}
				resolve(token);
			});
		});
	},
	verify: (jwtString, secretOrPublicKey) => {
		return new Promise((resolve, reject) => {
			jwt.verify(jwtString, secretOrPublicKey, (err, decoded) => {
				if (err) {
					return reject(err);
				}
				resolve(decoded);
			});
		});
	}
};
