const KeyRegistry = require('../../src/registry/KeyRegistry');

jest.mock('uuid');

describe('KeyRegistry', () => {
  const _timestamp = 1555974610091;
  const _now = global.Date.now;

  beforeAll(() => {
    global.Date.now = jest.fn(() => _timestamp);
  });

  afterAll(() => {
    global.Date.now = _now;
  });

  afterEach(() => {
    require('uuid').v4.mockClear();
  });

  describe('constructor', () => {
    it('should construct a KeyRegistry', () => {
      const registry = new KeyRegistry('arc');
      expect(registry).toBeDefined();
      expect(registry.arc).toBe('arc');
    });
  });

  describe('getAdminUsers', () => {
    it('should return admin users from the config', () => {
      const arc = {
        config: {
          api: {
            admins: {
              'jesse': 1234
            }
          }
        }
      };

      const registry = new KeyRegistry(arc);
      const admins = registry.getAdminUsers();

      expect(admins).toEqual(arc.config.api.admins);
    });
  });

  describe('getSecret', () => {
    it('should return the secret from the config', () => {
      const arc = {
        config: {
          api: {
            secret: '1234'
          }
        }
      };

      const registry = new KeyRegistry(arc);
      const secret = registry.getSecret();

      expect(secret).toEqual(arc.config.api.secret);
    });
  });

  describe('getKeys', () => {
    it('should return the keys from the Arc database', () => {
      const mockKeys = ['test'];
      const mockDbValue = jest.fn(() => mockKeys);
      const mockDbGet = jest.fn(() => ({ value: mockDbValue }));
      
      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const keys = registry.getKeys();

      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbValue).toBeCalled();
      expect(keys).toEqual(mockKeys);
    });
  });

  describe('findKey', () => {
    it('should return the matching key', () => {
      const mockKey = { id: 'test', origins: [] };
      const mockDbValue = jest.fn(() => mockKey);
      const mockDbFind = jest.fn(() => ({ value: mockDbValue }));
      const mockDbGet = jest.fn(() => ({ find: mockDbFind }));
      
      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.findKey('1234');

      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbFind).toBeCalledWith({ key: '1234' });
      expect(mockDbValue).toBeCalled();
      expect(key).toEqual(mockKey);
    });

    it('should return the matching key if the key has an origin', () => {
      const mockKey = { id: 'test', origins: ['localhost'] };
      const mockDbValue = jest.fn(() => mockKey);
      const mockDbFind = jest.fn(() => ({ value: mockDbValue }));
      const mockDbGet = jest.fn(() => ({ find: mockDbFind }));
      
      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.findKey('1234', 'localhost');

      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbFind).toBeCalledWith({ key: '1234' });
      expect(mockDbValue).toBeCalled();
      expect(key).toEqual(mockKey);
    });

    it('should not return the matching key if the origin doesnt match', () => {
      const mockKey = { id: 'test', origins: ['localhost'] };
      const mockDbValue = jest.fn(() => mockKey);
      const mockDbFind = jest.fn(() => ({ value: mockDbValue }));
      const mockDbGet = jest.fn(() => ({ find: mockDbFind }));
      
      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.findKey('1234', '127.0.0.1');

      expect(key).toEqual(null);
    });

    it('should return null if a key isnt found', () => {
      const mockKey = null;
      const mockDbValue = jest.fn(() => mockKey);
      const mockDbFind = jest.fn(() => ({ value: mockDbValue }));
      const mockDbGet = jest.fn(() => ({ find: mockDbFind }));
      
      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.findKey('1234', '127.0.0.1');

      expect(key).toEqual(null);
    });
  });

  describe('addKey', () => {
    it('should generate and add the key', () => {
      const mockDbWrite = jest.fn();
      const mockDbPush = jest.fn(() => ({ write: mockDbWrite }));
      const mockDbGet = jest.fn(() => ({ push: mockDbPush }));

      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.addKey();

      expect(key).toEqual({
        id: 'abc1234',
        key: Buffer.from('abc1234').toString('base64'),
        createdAt: _timestamp,
        updatedAt: _timestamp,
        origins: []
      });

      expect(require('uuid').v4.mock.calls.length).toBe(2);
      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbPush).toBeCalledWith(key);
      expect(mockDbWrite).toBeCalled();
    });

    it('should generate and add the key with origins', () => {
      const mockDbWrite = jest.fn();
      const mockDbPush = jest.fn(() => ({ write: mockDbWrite }));
      const mockDbGet = jest.fn(() => ({ push: mockDbPush }));

      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      const key = registry.addKey(['localhost']);

      expect(key).toEqual({
        id: 'abc1234',
        key: Buffer.from('abc1234').toString('base64'),
        createdAt: _timestamp,
        updatedAt: _timestamp,
        origins: ['localhost']
      });

      expect(require('uuid').v4.mock.calls.length).toBe(2);
      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbPush).toBeCalledWith(key);
      expect(mockDbWrite).toBeCalled();
    });
  });

  describe('regenerateKey', () => {
    it('should generate and add the key', () => {
      const mockDbWrite = jest.fn();
      const mockDbSet = jest.fn(() => ({ write: mockDbWrite }));
      const mockDbFind = jest.fn(() => ({ set: mockDbSet }));
      const mockDbGet = jest.fn(() => ({ find: mockDbFind }));

      const arc = {
        db: {
          get: mockDbGet
        }
      };

      const registry = new KeyRegistry(arc);
      registry.regenerateKey('1234');

      expect(mockDbGet).toBeCalledWith('keys');
      expect(mockDbFind).toBeCalledWith({ id: '1234' });
      
      expect(mockDbSet).toBeCalledWith({
        key: Buffer.from('abc1234').toString('base64'),
        updatedAt: _timestamp
      });

      expect(mockDbWrite).toBeCalled();
    });
  });
});