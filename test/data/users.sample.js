import bcrypt from 'bcryptjs';

// jest.mock('bcryptjs');
// const SAMPLE_BCRYPT_VALUE = '$209892##348928982080';
// bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);
const password = bcrypt.hashSync('stark', 12);

const sampleUsers = [
  {
    username: 'jon',
    email: 'jon@stark.com',
    password,
  },
  {
    username: 'arya',
    email: 'arya@stark.com',
    password,
  },
  {
    username: 'sansa',
    email: 'sansa@stark.com',
    password,
  },
  {
    username: 'mua',
    email: 'muagua@gmail.com',
    password,
  },
  {
    username: 'mua2',
    email: 'muagua2@gmail.com',
    password,
  },
  {
    email: 'ching@gmail.com',
    username: 'chingsley',
    password,
  },
];

export { sampleUsers };
