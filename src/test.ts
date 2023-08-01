import {
  createContext,
  useContext,
  useContextSlice,
  useContextMutator,
  useContextSliceMutator,
  useContextReducer,
} from './index';

describe('get', () => {
  test('export what is expected', () => {
    expect(createContext).toBeDefined();
    expect(useContext).toBeDefined();
    expect(useContextSlice).toBeDefined();
    expect(useContextMutator).toBeDefined();
    expect(useContextSliceMutator).toBeDefined();
    expect(useContextReducer).toBeDefined();
  });
});
