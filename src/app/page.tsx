"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import ReactPaginate from "react-paginate";

import {
  SearchInput,
  Select,
  Hero,
  ToggleButton,
  MarvelLoading,
} from "@/components";
import { getHereos, getFavoriteHeros } from "@/queries";

import styles from "./styles.module.css";

const OPTIONS_PAGE_SIZE = [
  {
    label: "20",
    value: "20",
  },
  {
    label: "50",
    value: "50",
  },
  {
    label: "100",
    value: "100",
  },
];

export default function Home() {
  /* States */

  const [search, setSearch] = useState<string>("");
  const [limit, setLimit] = useState<number>(20);
  const [page, setPage] = useState<number>(0);
  const [showFavorite, setShowFavorite] = useState<boolean>(false);

  /* Queries */

  const { data: allHereos, isLoading } = useQuery({
    queryKey: ["hereos", search, limit, page, showFavorite],
    queryFn: () =>
      getHereos({ nameStartsWith: search, limit, offset: page * limit }),
    enabled: showFavorite === false,
  });

  const { data: favoriteHereos } = useQuery({
    queryKey: ["favorite-hereos", search, limit, page],
    queryFn: () =>
      getFavoriteHeros({ nameStartsWith: search, limit, offset: page * limit }),
    enabled: showFavorite,
  });

  /* Memos */

  const data = useMemo(() => {
    if (showFavorite) {
      return favoriteHereos;
    }

    return allHereos;
  }, [showFavorite, favoriteHereos, allHereos]);

  const totalPages = useMemo(() => {
    return data?.total && data.total > 0 ? Math.ceil(data.total / limit) : 1;
  }, [limit, data?.total]);

  /* Functions */

  const handleChangeLimit = (value: number) => {
    setLimit(value);
    setPage(0);
  };

  const handleToggleFavorite = () => {
    setShowFavorite(!showFavorite);
    setPage(0);
  };

  return (
    <div className="flex flex-col justify-between min-h-screen">
      <div className="flex flex-col items-center w-full">
        <h1 className="mt-4 text-6xl text-center">MARVEL HEREOS</h1>

        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <SearchInput onChange={setSearch} placeholder="Search a hero..." />

          <div className="flex gap-4">
            <Select
              options={OPTIONS_PAGE_SIZE}
              onChange={(value) => handleChangeLimit(value as number)}
              value={limit}
              className="w-full md:w-64"
            />

            <ToggleButton
              label="favorite"
              onChange={handleToggleFavorite}
              value={showFavorite}
            />
          </div>
        </div>

        {isLoading ? (
          <MarvelLoading />
        ) : (
          <div className="w-full">
            {data?.count && data.count > 0 ? (
              <div className="mt-4 gap-4 flex flex-wrap justify-center">
                {data.results.map((character: any) => (
                  <Hero key={`character-${character.id}`} hero={character} />
                ))}
              </div>
            ) : (
              <p className="mt-4">No hereos found :(</p>
            )}
          </div>
        )}
      </div>

      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={(event) => setPage(event.selected)}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel="<"
        renderOnZeroPageCount={null}
        forcePage={page}
        containerClassName="mt-4 flex justify-center gap-4 items-center w-full flex-wrap"
        pageLinkClassName="border-2 border-white w-10 h-10 flex justify-center items-center"
        previousLinkClassName="border-2 border-white w-10 h-10 flex justify-center items-center"
        nextLinkClassName="border-2 border-white w-10 h-10 flex justify-center items-center"
        activeClassName="bg-white text-black"
      />
    </div>
  );
}
