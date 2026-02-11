export const getEnv = (key: string, defaultVAlue?: string) => {
  const value = process.env[key] ?? defaultVAlue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }

  return value;
};
