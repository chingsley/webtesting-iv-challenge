import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;

const generateToken = ({ userId, username, roles }) => {
  const payload = { userId, username, roles };
  const options = { expiresIn: '1d' };
  return jwt.sign(payload, JWT_SECRET, options);
};

export default { generateToken };
