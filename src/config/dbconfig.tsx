interface DbConfig {
  uri: string;
  dbName: string;
}

const config: DbConfig = {
  uri: process.env.MONGODB_URI || 'mongodb+srv://<username>:<password>@cluster0.mongodb.net',
  dbName: process.env.MONGODB_DB_NAME || 'admin-dashboard'
};

export default config;
