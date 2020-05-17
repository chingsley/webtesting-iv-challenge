// import bcrypt from 'bcryptjs';

// jest.mock('bcryptjs');
// const SAMPLE_BCRYPT_VALUE = '$209892##348928982080';
// bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

const sampleUsers = [
  {
    username: 'jon',
    email: 'jon@stark.com',
    password: 'stark',
  },
  {
    username: 'arya',
    email: 'arya@stark.com',
    password: 'stark',
  },
  {
    username: 'sansa',
    email: 'sansa@stark.com',
    password: 'stark',
  },
  {
    username: 'mua',
    email: 'muagua@gmail.com',
    password: 'stark',
  },
  {
    username: 'mua2',
    email: 'muagua2@gmail.com',
    password: 'stark',
  },
  {
    email: 'ching@gmail.com',
    username: 'chingsley',
    password: 'mua',
  },
];

export { sampleUsers };
