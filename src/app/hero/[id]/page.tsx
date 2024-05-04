"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import classNames from "classnames";
import { FaHeart, FaRegHeart } from "react-icons/fa";

import { MarvelLoading } from "@/components";
import { getHero, removeFavoriteHero, addFavoriteHero } from "@/queries";

interface HeroPageProps {
  params: {
    id: string;
  };
}

export default function Hero({ params: { id } }: HeroPageProps) {
  /* Vars */

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  /* Functions */

  const handleToogleFavorite =
    (hero: Hero) => (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (isFavorite) {
        removeFavoriteHero(hero.id);
      } else {
        addFavoriteHero(hero);
      }

      setIsFavorite(!isFavorite);
    };

  /* Queries */

  const { data, isLoading } = useQuery({
    queryKey: ["hero", id, isFavorite],
    queryFn: () => getHero(id),
  });

  const hero = data?.results;

  /* Effects */

  useEffect(() => {
    setIsFavorite(hero?.isFavorite || false);
  }, [hero?.isFavorite]);

  return (
    <div className="flex flex-col items-center w-full pb-4">
      {isLoading && <MarvelLoading />}

      {hero && (
        <div className="flex flex-col items-center gap-6 w-full">
          <h1 className="mt-4 text-6xl text-center">{hero.name}</h1>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 flex-wrap w-full">
            <Image
              src={`${hero.thumbnail.path}/portrait_uncanny.${hero.thumbnail.extension}`}
              alt={hero.name}
              width={300}
              height={450}
            />

            <div className="flex flex-col gap-6 justify-between flex-1 h-[450px}">
              <div className="flex justify-between gap-4">
                <p className="flex-1">
                  {hero.description
                    ? hero.description
                    : "Description not available"}
                </p>

                <button
                  className={classNames("flex gap-2 items-center p-2 h-11 border-2 border-white", {
                    "bg-white text-black": isFavorite,
                  })}
                  onClick={handleToogleFavorite(hero)}
                >
                  <span className="hidden md:block">{isFavorite ? "Remove favorite" : "Add favorite"}</span>

                  <span className="block">{isFavorite ? <FaHeart /> : <FaRegHeart />}</span>
                </button>
              </div>

              <div>
                <h2 className="text-4xl">Comics</h2>

                <p>Total: {hero.comics.available}</p>

                <div className="flex gap-4 flex-wrap">
                  {hero.comics.items.map((comic) => (
                    <div
                      key={`comic-${name}`}
                      className="p-2 border-2 border-white"
                    >
                      {comic.name}
                    </div>
                  ))}

                  {hero.comics.available > 20 && (
                    <div className="p-2 border-2 border-white">...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
