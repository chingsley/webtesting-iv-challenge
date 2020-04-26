import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');
const SAMPLE_BCRYPT_VALUE = '$209892##348928982080';
bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

const bulkUsers = [
  {
    username: 'jon',
    email: 'jon@stark.com',
    password: bcrypt.hashSync('stark'),
  },
  {
    username: 'arya',
    email: 'arya@stark.com',
    password: bcrypt.hashSync('stark'),
  },
  {
    username: 'sansa',
    email: 'sansa@stark.com',
    password: bcrypt.hashSync('stark'),
  },
];

const singleUser = {
  username: 'mua',
  email: 'muagua@gmail.com',
  password: bcrypt.hashSync('unua'),
};

export { bulkUsers, singleUser, SAMPLE_BCRYPT_VALUE };
