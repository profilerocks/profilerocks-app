import redirects from "#shared/redirects.json";

const forbiddenProfileNames = new Set<string>(Object.keys(redirects));

export default forbiddenProfileNames;
