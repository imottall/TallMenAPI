var env = {
    webPort: process.env.PORT || 27017,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '',
    dbUser: process.env.DB_USER || '',
    dbPassword: process.env.DB_PASSWORD || '',
    dbDatabase: process.env.DB_DATABASE || 'tallmen',
    neoUrl: process.env.DB_NEO_URL || 'bolt://localhost:7687',
    neoUser: process.env.DB_NEO_USER || 'neo4j',
    neoPassword: process.env.DB_NEO_PASSWORD || 'wachtwoord'
};

var dburl = process.env.NODE_ENV === 'production' ?
    'mongodb://' + env.dbUser + ':' + env.dbPassword + '@' + env.dbHost + ':' + env.dbPort + '/' + env.dbDatabase :
    'mongodb://localhost/' + env.dbDatabase;

var neoSettings = { url: string = env.neoUrl, user: string = env.neoUser, password: string = env.neoPassword };

module.exports = {
    env: env,
    dburl: dburl,
    neo: neoSettings
};