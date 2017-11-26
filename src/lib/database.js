import { Pool } from 'pg';

import { config } from './../config/config';

const pool = new Pool({
	connectionString: config.database.connectionString
});

export const database = {
	connect: () => {
		return pool.connect();
	}
};
