import "dotenv/config";

const jwtExpressOpts = {
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  credentialsRequired: false,
};

export { jwtExpressOpts };
