
import dotenv from 'dotenv';
dotenv.config();

const config = {
  allowed_origin: {
    get baseUrl() {
      if (process.env.NODE_ENV === "production") {
        return process.env.BASE_URL_LIVE as string;
      }

      return process.env.BASE_URL_DEV as string;
    }
  },

  jwt: {
    secret: process.env.JWT_SECRETE as string,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    token_expiration: process.env.TOKEN_EXPIRATION as string
  },

  db: {
    prod_db_url: process.env.DATABASE_URL_DEV_SERVER as string,
    dev_db_url: process.env.DATABASE_URL_DEV as string,
    test_db_url: process.env.DATABASE_URL_TEST as string,
    
    get database_url() {
      if (process.env.NODE_ENV === "production") {
        return this.prod_db_url;
      } else if (process.env.NODE_ENV === "development") {
        return this.dev_db_url;
      } else {
        return this.test_db_url;
      }
    },
  },

  cloudinary: {
    name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secrete: process.env.CLOUDINARY_API_SECRET
  },

  port: process.env.PORT,
  ws_port: process.env.WEB_SOCKET_PORT,
  prefix: "/api",
  node_env: process.env.NODE_ENV,
  temp_password: process.env.TEMP_PASSWORD as string,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // Maximum file size of 6MB

}

export default config;