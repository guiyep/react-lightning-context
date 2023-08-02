import { initialize, publish, addListener, removeListener, flush, getQueue } from './index';

jest.mock('../uuid', () => ({ uuid: () => '123-uuid' }));

describe('pub sub', () => {
  beforeEach(() => {
    flush();
  });

  test('be defined', () => {
    expect(getQueue()).toEqual({});
    expect(initialize).toBeDefined();
    expect(publish).toBeDefined();
    expect(addListener).toBeDefined();
    expect(removeListener).toBeDefined();
  });

  test('initialize', () => {
    expect(initialize()).toEqual('123-uuid');
    expect(getQueue()).toEqual({ '123-uuid': { listeners: {} } });
  });

  test('addListener', () => {
    const fnMock = jest.fn();
    const params = { queueId: '123-uuid', key: 'bind.test', listener: fnMock };
    initialize();
    addListener(params);
    expect(getQueue()).toEqual({ '123-uuid': { listeners: { 'bind.test': [fnMock] } } });
  });

  test('removeListener', () => {
    const fnMock = jest.fn();
    const params = { queueId: '123-uuid', key: 'bind.test', listener: fnMock };
    initialize();
    addListener(params);
    removeListener(params);
    expect(getQueue()).toEqual({ '123-uuid': { listeners: { 'bind.test': [] } } });
  });

  test('publish', () => {
    const fnMock = jest.fn();
    const fn2Mock = jest.fn();
    const params = { queueId: '123-uuid', key: 'bind.test', listener: fnMock };
    const params2 = { queueId: '123-uuid', key: 'bind.test', listener: fn2Mock };
    initialize();
    addListener(params);
    addListener(params2);
    publish({ queueId: '123-uuid', key: 'bind.test', event: { data: 123 } });
    expect(fnMock).toHaveBeenCalledWith({ data: 123 });
    expect(fn2Mock).toHaveBeenCalledWith({ data: 123 });
  });
});
