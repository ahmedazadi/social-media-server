const env = {
  PORT: process.env.PORT,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

if (!env.ACCESS_TOKEN_SECRET || !env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing environment variables");
}

export default env;
