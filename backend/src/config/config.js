require('dotenv').config();

const config = {
    secret: process.env.JWT_SECRET || 'local-development-secret',
    env: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3000,

    db: {
        dbUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
        dbName: process.env.DB_NAME || 'diploma',
    },

    userCommentActions: {
        like: 'like',
        dislike: 'dislike',
        violate: 'violate',
    },

    requestTypes: {
        order: 'order',
        consultation: 'consultation',
    }
};

if (config.env === 'production') {
    if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
        throw new Error('JWT_SECRET и MONGODB_URI должны быть настроены');
    }
}

module.exports = config;