const GENERIC_ERROR = 'Something went wrong. Please try again later.';

enum ErrorCodes {
  E000 = GENERIC_ERROR,
  E400 = 'Bad request',
  E401 = 'Invalid email or password',
  E404 = 'User not found',
  E409 = 'Email already exists',
  E500 = 'Something went wrong. Please try again later.',
  EC01 = 'Category is required',
  ESL01 = 'Slug is required',
  ESL02 = 'Slug already taken',
  EZ01 = 'Request body has missing keys'
}

export { ErrorCodes };
