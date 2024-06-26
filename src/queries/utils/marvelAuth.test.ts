import { getHash, QueryParams, addMarvelAuthorizationOnUrl } from "./marvelAuth";

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(Date.UTC(2020, 3, 1));
});

process.env.NEXT_PUBLIC_API_PUBLIC_KEY = 'yourPublicKey';
process.env.NEXT_PUBLIC_API_PRIVATE_KEY = 'yourPrivateKey';
process.env.NEXT_PUBLIC_API_URL = 'https://api.marvel.com/';

describe('addMarvelAuthorizationOnUrl function', () => {
  it('should add Marvel authorization parameters to the URL correctly', () => {
    const url = 'characters';
    const queryParams: QueryParams = {
      nameStartsWith: 'Iron',
      limit: 20
    };
    const expectedUri = `https://api.marvel.com/characters?apikey=yourPublicKey&ts=1585699200000&hash=ff598799f010c0b177a9f074716e5f13&nameStartsWith=Iron&limit=20`;

    const result = addMarvelAuthorizationOnUrl(url, queryParams);

    expect(result).toEqual(expectedUri);
  });

  it('should add Marvel authorization parameters to the URL correctly without query parameters', () => {
    const url = 'characters';
    const expectedUri = `https://api.marvel.com/characters?apikey=yourPublicKey&ts=1585699200000&hash=ff598799f010c0b177a9f074716e5f13`;

    const result = addMarvelAuthorizationOnUrl(url);

    expect(result).toEqual(expectedUri);
  });
});

describe('getHash function', () => {
  it('should return the correct hash value', () => {
    const digest = 'sampleDigest';

    expect(getHash(digest)).toEqual('d428ca7f03efb229b06347d8a9972343');
  });
});