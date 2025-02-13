// cors.config.ts
export const corsConfig = {
    development: {
        origin: [process.env.KEYVAULT_WEB_DEV_URL, 'http://localhost:5174'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'x-api-key',
        ],
        credentials: true,
    },
    production: {
        origin: [
            process.env.KEYVAULT_WEB_PROD_URL,
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'x-api-key',
        ],
        credentials: true,
    },
};