beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeEach(() => {});

afterEach(() => {});

afterAll(() => {
  jest.restoreAllMocks();
});
