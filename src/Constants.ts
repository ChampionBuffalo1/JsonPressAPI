export const isProd: boolean = process.env.NODE_ENV === 'production';
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const JwtSecret = process.env.JWT_SECRET || 'secret';
export const bcryptRounds = 8;
