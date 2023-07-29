import { set } from './index';

const state = {
  valA: {
    valB: {
      valC: 222,
    },
  },
};

describe('set', () => {
  test('to set value', () => {
    expect(set(state, 'valA.valB.valC', 555)).toEqual({
      valA: {
        valB: {
          valC: 555,
        },
      },
    });

    expect(set(state, 'valA.valB', 555)).toEqual({
      valA: {
        valB: 555,
      },
    });

    expect(set(state, 'valA', 555)).toEqual({
      valA: 555,
    });
  });
});
