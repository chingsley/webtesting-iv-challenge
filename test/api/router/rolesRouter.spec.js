import supertest from 'supertest';
import server from '../../../src/api/server';

const app = supertest(server);

describe.skip('rolesRouter', () => {
  describe('GET /roles', () => {
    it('returns 200 for successful GET', async (done) => {
      await app.get('/api/roles').expect(200);
      done();
    });

    // it('returns array of all available roles in the db', async (done) => {
    //   const roles = await app.get('/api/roles');
    //   console.log(roles);
    //   done();
    // });
  });
});
