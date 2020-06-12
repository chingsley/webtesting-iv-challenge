import supertest from 'supertest';
import server from '../../../src/api/server';
import Joi from '@hapi/joi';

const app = supertest(server);

describe('authMiddleware', () => {
  describe('validateLoginDetails', () => {
    describe('try', () => {
      it('returns 400 error if email is not provided', async (done) => {
        try {
          const res = await app.post('/api/auth/login').send({
            passwordXXX: 'testing',
          });
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('error', '"email" is required');
          done();
        } catch (e) {
          done(e);
        }
      });
      it('returns 400 error if password is not provided', async (done) => {
        try {
          const res = await app.post('/api/auth/login').send({
            email: 'someemail@email.com',
            passwordXXX: 'testing',
          });
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty('error', '"password" is required');
          done();
        } catch (e) {
          done(e);
        }
      });
      it('returns 400 if email is not valid', async (done) => {
        try {
          const res = await app.post('/api/auth/login').send({
            email: 'not_a_valid_mail.com',
            password: 'testing',
          });
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty(
            'error',
            '"email" must be a valid email'
          );
          done();
        } catch (e) {
          done(e);
        }
      });
    });
    describe('catch', () => {
      it('returns 500 errors in the catch block', async (done) => {
        try {
          const originalImplementation = Joi.object;
          Joi.object = jest.fn().mockImplementation(() => {
            throw new Error('bummer!!!');
          });
          const res = await app.post('/api/auth/login').send({
            email: 'someemail@email.com',
            passwordXXX: 'testing',
          });
          Joi.object = originalImplementation;
          expect(res.status).toBe(500);
          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
});
