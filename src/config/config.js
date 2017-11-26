export const config = {
	http: {
		port: process.env.PORT || 3000
	},
	database: {
		connectionString: 'postgresql://postgres:postgres@localhost:5432/jwt-authorization'
	},
	oauth2: {
		clientId: 'trusted-app',
		secret: 'secret',
		accessTokenValiditySeconds: 120,
		refreshTokenValiditySeconds: 600
	},
	bcrypt: {
		saltRounds: 10
	},
	jwt: {
		secret: 'secret-token-for-jwt'
	}
};
