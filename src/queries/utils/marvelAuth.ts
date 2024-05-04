import { createHash } from "crypto";

export interface QueryParams {
  [key: string]: string | number;
}

export const addMarvelAuthorizationOnUrl = (url: string, queryParams?: QueryParams) => {
  const apiPublicKey = process.env.NEXT_PUBLIC_API_PUBLIC_KEY;
  const apiPrivateKey = process.env.NEXT_PUBLIC_API_PRIVATE_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const ts = new Date().getTime();

  const hash = getHash(`${ts}${apiPrivateKey}${apiPublicKey}`);

  let uri = `${apiUrl}${url}`;

  uri = uri + `?apikey=${apiPublicKey}`;
  uri = uri + `&ts=${ts}`;
  uri = uri + `&hash=${hash}`;

  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key]) {
        uri = uri + `&${key}=${queryParams[key]}`;
      }
    });
  }

  return uri;
};

export const getHash = (digest: string) => {
  const hash = createHash("md5");

  hash.update(digest);

  return hash.digest("hex");
};
