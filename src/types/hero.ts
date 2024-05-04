interface Hero {
  id: string;
  name: string;
  description: string;
  thumbnail: Thumbnail;
  comics: Comics;
  isFavorite?: boolean;
}

interface Thumbnail {
  extension: string;
  path: string;
}

interface Comics {
  available: number;
  items: Comic[]
}

interface Comic {
  name: string;
  resourceURI: string;
}

interface MarvelResponse<T> {
  count: number;
  limit: number;
  offset: number;
  total: number;
  results: T;
}
