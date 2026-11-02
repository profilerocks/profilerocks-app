const PRODUCTION = "production";

const production: boolean = process.env.NODE_ENV === PRODUCTION || process.env.ENVIRONMENT === PRODUCTION;

export default production;
