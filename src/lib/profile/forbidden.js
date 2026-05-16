import redirects from "#shared/redirects.json";

const forbiddenProfileNames = new Set(Object.keys(redirects));

export default forbiddenProfileNames;
