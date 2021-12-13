import { get } from './index';

const internal = {
  valC: 222,
};

const state = {
  valA: {
    valB: internal,
  },
};

describe('get', () => {
  test('to get value', () => {
    expect(get(state, 'valA.valB.valC')).toEqual(222);
    expect(get(state, 'valA.valB')).toStrictEqual(internal);
    expect(get(state, 'valA.valZ')).toEqual(undefined);
  });

  test('to throw', () => {
    try {
      get(state, '');
    } catch (e) {
      expect(e.message).toEqual('path need to be present');
    }
  });
});
