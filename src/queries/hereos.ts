import { addMarvelAuthorizationOnUrl, QueryParams } from "./utils/marvelAuth";

export async function getHereos(
  queryParams?: QueryParams
): Promise<MarvelResponse<Hero[]>> {
  try {
    const url = addMarvelAuthorizationOnUrl(
      "/v1/public/characters",
      queryParams
    );
    const response = await fetch(url);

    if (response.ok) {
      const json = await response.json();

      return {
        ...json.data,
        results: json.data.results.map((hero: Hero) => ({
          ...hero,
          isFavorite: checkHeroIsFavorite(hero.id),
        })),
      };
    }

    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(`Marvel api return an error: ${error}`);
  }
}

export async function getHero(
  id: string,
  queryParams?: QueryParams
): Promise<MarvelResponse<Hero>> {
  try {
    const url = addMarvelAuthorizationOnUrl(
      `/v1/public/characters/${id}`,
      queryParams
    );
    const response = await fetch(url);

    if (response.ok) {
      const { data } = await response.json();
      const hero = data.results[0];

      return {
        ...data,
        results: {
          ...hero,
          isFavorite: checkHeroIsFavorite(hero.id),
        },
      };
    }

    throw new Error(response.statusText);
  } catch (error) {
    throw new Error(`Marvel api return an error: ${error}`);
  }
}

export function getFavoriteHeros(
  queryParams?: QueryParams
): MarvelResponse<Hero[]> {
  try {
    const limit = (queryParams?.limit as number) || 20;
    const offset = (queryParams?.offset as number) || 0;

    const json = localStorage.getItem("favorite");
    const hereos: Hero[] = (json ? JSON.parse(json) : []).filter(
      (hero: Hero) => {
        if (queryParams?.nameStartsWith) {
          return hero.name
            .toLowerCase()
            .startsWith((queryParams.nameStartsWith as string).toLowerCase());
        }

        return true;
      }
    );
    const hereosPagined: Hero[] = hereos
      .slice(offset, offset + limit)
      .map((hero: Hero) => ({ ...hero, isFavorite: true }));

    return {
      count: hereosPagined.length,
      total: hereos.length,
      limit,
      offset,
      results: hereosPagined,
    };
  } catch (error) {
    throw new Error(`Marvel api return an error: ${error}`);
  }
}

export function addFavoriteHero(hero: Hero) {
  try {
    if (checkHeroIsFavorite(hero.id) === false) {
      const json = localStorage.getItem("favorite");
      const hereos: Hero[] = json ? JSON.parse(json) : [];

      localStorage.setItem("favorite", JSON.stringify([...hereos, hero]));
    }
  } catch (error) {
    throw new Error(`Error when adding hero in favorite: ${error}`);
  }
}

export function removeFavoriteHero(heroId: string) {
  try {
    const json = localStorage.getItem("favorite");
    const hereos: Hero[] = json ? JSON.parse(json) : [];

    localStorage.setItem(
      "favorite",
      JSON.stringify(hereos.filter(({ id }) => id !== heroId))
    );
  } catch (error) {
    throw new Error(`Error when remove hero of favorite: ${error}`);
  }
}

export function checkHeroIsFavorite(heroId: string) {
  try {
    const json = localStorage.getItem("favorite");
    const hereos: Hero[] = json ? JSON.parse(json) : [];

    return hereos.find(({ id }) => id === heroId) !== undefined;
  } catch (error) {
    throw new Error(`Error when check hero is favorite: ${error}`);
  }
}
