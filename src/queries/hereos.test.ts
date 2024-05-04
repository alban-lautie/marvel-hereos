import fetch from "jest-fetch-mock";

import {
  getHereos,
  getHero,
  getFavoriteHeros,
  addFavoriteHero,
  removeFavoriteHero,
  checkHeroIsFavorite,
} from "./hereos";

beforeEach(() => {
  fetch.resetMocks();
  localStorage.clear();
});

const hero: Hero = {
  id: "1",
  name: "Iron Man",
  description: "",
  thumbnail: { path: "iron_man", extension: "jpg" },
  isFavorite: false,
  comics: {
    available: 1,
    items: [
      {
        name: "Iron man",
        resourceURI: "",
      },
    ],
  },
};

describe("getHereos function", () => {
  it("should fetch heroes from Marvel API", async () => {
    const data: MarvelResponse<Hero[]> = {
      total: 1,
      limit: 20,
      offset: 0,
      count: 1,
      results: [hero],
    };

    fetch.mockResponseOnce(
      JSON.stringify({
        data,
      })
    );

    const response = await getHereos();
    expect(response).toEqual(data);
  });

  it("Returns is Favorite true, if the hero is in the localstorage as a favorite", async () => {
    const data: MarvelResponse<Hero[]> = {
      total: 1,
      limit: 20,
      offset: 0,
      count: 1,
      results: [hero],
    };

    localStorage.setItem("favorite", JSON.stringify([data.results[0]]));

    fetch.mockResponseOnce(
      JSON.stringify({
        data,
      })
    );

    const response = await getHereos();
    expect(response.results[0].isFavorite).toBe(true);
  });

  it("should throw an error if the response is not ok", async () => {
    fetch.mockRejectOnce(new Error("fake error"));

    await expect(getHereos()).rejects.toThrow(
      "Marvel api return an error: Error: fake error"
    );
  });
});

describe("getHero function", () => {
  it("should fetch specific hero from Marvel API", async () => {
    const data: MarvelResponse<Hero[]> = {
      total: 1,
      limit: 20,
      offset: 0,
      count: 1,
      results: [hero],
    };

    fetch.mockResponseOnce(
      JSON.stringify({
        data,
      })
    );

    const response = await getHero("1");
    expect(response).toEqual({
      ...data,
      results: data.results[0],
    });
  });

  it("Returns is Favorite true, if the hero is in the localstorage as a favorite", async () => {
    const data: MarvelResponse<Hero[]> = {
      total: 1,
      limit: 20,
      offset: 0,
      count: 1,
      results: [hero],
    };

    localStorage.setItem("favorite", JSON.stringify([data.results[0]]));

    fetch.mockResponseOnce(
      JSON.stringify({
        data,
      })
    );

    const response = await getHero("1");
    expect(response.results.isFavorite).toBe(true);
  });

  it("should throw an error if the response is not ok", async () => {
    fetch.mockRejectOnce(new Error("fake error"));

    await expect(getHero("1")).rejects.toThrow(
      "Marvel api return an error: Error: fake error"
    );
  });
});

describe("getFavoriteHeros function", () => {
  it("Must return no hero as favorite if localStorage is empty.", async () => {
    localStorage.clear();

    const response = await getFavoriteHeros();
    expect(response).toEqual({
      count: 0,
      limit: 20,
      offset: 0,
      total: 0,
      results: [],
    });
  });

  it("Should return a list of favorite heroes if the localStorage contains favorites.", async () => {
    localStorage.setItem("favorite", JSON.stringify([hero]));

    const response = await getFavoriteHeros();
    expect(response).toEqual({
      count: 1,
      limit: 20,
      offset: 0,
      total: 1,
      results: [
        {
          ...hero,
          isFavorite: true,
        },
      ],
    });
  });

  it("Should return the first 20 heroes if the localstorage contains more and the limit is 20 and the offset is 0.", async () => {
    const hereos: Hero[] = Array.from(Array(30).keys()).map((index) => ({
      ...hero,
      id: index.toString(),
      name: `Hero-${index}`,
      isFavorite: true,
    }));
    localStorage.setItem("favorite", JSON.stringify(hereos));

    const response = await getFavoriteHeros();
    expect(response).toEqual({
      count: 20,
      limit: 20,
      offset: 0,
      total: 30,
      results: hereos.slice(0, 20),
    });
  });

  it("Must return the last 10 heroes, if I have 30 heroes in base and I make a limit of 20 with an offset of 20.", async () => {
    const hereos: Hero[] = Array.from(Array(30).keys()).map((index) => ({
      ...hero,
      id: index.toString(),
      name: `Hero-${index}`,
      isFavorite: true,
    }));
    localStorage.setItem("favorite", JSON.stringify(hereos));

    const response = await getFavoriteHeros({ limit: 20, offset: 20 });
    expect(response).toEqual({
      count: 10,
      limit: 20,
      offset: 20,
      total: 30,
      results: hereos.slice(20, 40),
    });
  });

  it("Must return the complete list of heroes if I have a limit of 50 and I have 30 heroes in base", async () => {
    const hereos: Hero[] = Array.from(Array(30).keys()).map((index) => ({
      ...hero,
      id: index.toString(),
      name: `Hero-${index}`,
      isFavorite: true,
    }));
    localStorage.setItem("favorite", JSON.stringify(hereos));

    const response = await getFavoriteHeros({ limit: 50 });
    expect(response).toEqual({
      count: 30,
      limit: 50,
      offset: 0,
      total: 30,
      results: hereos,
    });
  });

  it("Should only return heroes starting with 'tho' if I pass the nameStartsWith parameter with 'tho'.", async () => {
    const hereos: Hero[] = [
      hero,
      {
        ...hero,
        name: "Thor",
      },
    ];
    localStorage.setItem("favorite", JSON.stringify(hereos));

    const response = await getFavoriteHeros({ nameStartsWith: "Tho" });
    expect(response).toEqual({
      count: 1,
      limit: 20,
      offset: 0,
      total: 1,
      results: [
        {
          ...hero,
          name: "Thor",
          isFavorite: true,
        },
      ],
    });
  });
});

describe("addFavoriteHero function", () => {
  it("Must update localStorage if I add a hero in favorite", async () => {
    addFavoriteHero(hero);

    expect(JSON.parse(localStorage.getItem("favorite") || "")).toEqual([hero]);
  });

  it("Must not duplicate the hero if I add an already existing hero as a favorite", async () => {
    addFavoriteHero(hero);
    addFavoriteHero(hero);

    expect(JSON.parse(localStorage.getItem("favorite") || "")).toEqual([hero]);
  });
});

describe("removeFavoriteHero function", () => {
  it("Must update localStorage if I remove a hero from favorites", async () => {
    addFavoriteHero(hero);
    removeFavoriteHero(hero.id);

    expect(JSON.parse(localStorage.getItem("favorite") || "")).toEqual([]);
  });
});

describe("checkHeroIsFavorite function", () => {
  it("Must return true, if the hero exists in favorites", async () => {
    addFavoriteHero(hero);

    expect(checkHeroIsFavorite(hero.id)).toBe(true);
  });

  it("Must return false, if the hero does not exist in the favorites", async () => {
    expect(checkHeroIsFavorite(hero.id)).toBe(false);
  });
});
