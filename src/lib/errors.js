export const Errors = {
	create: (req, status, type, message) => {
		return {
			status: status,
			error: type,
			message: message,
			path: req.originalUrl,
			timestamp: Math.floor(new Date().getTime() / 1000)
		};
	}
};
