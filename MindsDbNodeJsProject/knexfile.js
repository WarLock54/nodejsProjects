module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'admin', // kendi şifren
      database: 'postgres'
    },
    migrations: {
      directory: './migrations'
    }
  }
};
