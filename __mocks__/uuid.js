const uuid = jest.genMockFromModule('uuid');
uuid.v4 = jest.fn(() => 'abc1234');
module.exports = uuid;