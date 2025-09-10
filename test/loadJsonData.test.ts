import * as fs from 'fs';
import * as path from 'path';
import { loadJsonData } from './jsonLoader';

jest.mock('fs');
jest.mock('path');

describe('loadJsonData', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>;
  const mockedPath = path as jest.Mocked<typeof path>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should load and parse JSON file successfully', () => {
    const fakePath = '/fake/data/file.json';
    const fakeData = [{ id: 1, name: 'Test' }];
    mockedPath.join.mockReturnValue(fakePath);
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(JSON.stringify(fakeData));

    const result = loadJsonData<(typeof fakeData)[0]>('file.json');

    expect(mockedPath.join).toHaveBeenCalledWith(
      expect.any(String),
      '..',
      'data',
      'file.json',
    );
    expect(mockedFs.existsSync).toHaveBeenCalledWith(fakePath);
    expect(mockedFs.readFileSync).toHaveBeenCalledWith(fakePath, 'utf-8');
    expect(result).toEqual(fakeData);
  });

  it('should throw error if file does not exist', () => {
    const fakePath = '/fake/data/file.json';
    mockedPath.join.mockReturnValue(fakePath);
    mockedFs.existsSync.mockReturnValue(false);

    expect(() => loadJsonData('file.json')).toThrow(
      `JSON file not found: ${fakePath}`,
    );
  });

  it('should throw error if JSON is invalid', () => {
    const fakePath = '/fake/data/file.json';
    mockedPath.join.mockReturnValue(fakePath);
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('invalid json');

    expect(() => loadJsonData('file.json')).toThrow(SyntaxError);
  });
});
