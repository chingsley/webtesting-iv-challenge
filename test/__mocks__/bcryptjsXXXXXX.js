/**
 * I left the mock file as an example of how to achieve a test-wide mock of a value
 * In this case, I mocked the bcryptjs to return the same data every time the hashSync
 * function called when the executing the test. It works fine. But on second thought. I
 * don not want to mock bcrypt, I want the acutal hashed data, so that when I implement
 * authorization, during login, the password comparison will work fine, as in real life
 */

// const bcrypt = jest.mock('bcryptjs');
// import { SAMPLE_BCRYPT_VALUE } from '../data';
// bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

// export default bcrypt;
