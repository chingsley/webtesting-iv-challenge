import { isVAlidEmail, listItems } from '../../../src/api/middlewares/helpers';

describe('isVAlidEmail function', () => {
  it('returns true for valid email', (done) => {
    expect(isVAlidEmail('eneja.kc@gmail.com')).toBe(true);
    done();
  });
  it('returns false for valid email', (done) => {
    expect(isVAlidEmail('eneja...kc@gmail.com')).toBe(false);
    done();
  });
});

describe('"listItems" function', () => {
  it('returns the one item for an array with one item', (done) => {
    expect(listItems(['james'])).toBe('james');
    done();
  });

  it('returns "item1 and item2" for an array with 2 items', (done) => {
    expect(listItems(['james', 'john'])).toBe('james and john');
    done();
  });

  it('returns "item1, item2,..., and item3" for an array with more than 2 itmes', (done) => {
    expect(listItems(['peter', 'james', 'john'])).toEqual(
      'peter, james, and john'
    );
    done();
  });
});
