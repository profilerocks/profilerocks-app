const PRODUCTION = "production";

const production = process.env.NODE_ENV === PRODUCTION || process.env.ENVIRONMENT === PRODUCTION;

export default production;
