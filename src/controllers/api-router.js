import expressPromiseRouter from 'express-promise-router';

import { config } from './../config/config';
import { AuthorizationService } from './../services/authorization-service';

export const router = expressPromiseRouter();

/**
 * Tylko dla testów, ścieżki zabezpieczone tokenem.
 */
router.route('/test').get(AuthorizationService.check, async (req, res) => {
	res.send('Its /api/test route.');
});
router.route('/hello').get(AuthorizationService.check, async (req, res) => {
	res.send('Its /api/hello route.');
});
