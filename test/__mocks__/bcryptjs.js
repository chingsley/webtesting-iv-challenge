const bcrypt = jest.mock('bcryptjs');
import { SAMPLE_BCRYPT_VALUE } from '../data';
bcrypt.hashSync = jest.fn(() => SAMPLE_BCRYPT_VALUE);

export default bcrypt;
