import { FC, useState } from "react";
import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { addFavoriteHero, removeFavoriteHero } from "@/queries";

interface HeroComponentProps {
  hero: Hero;
}

export const Hero: FC<HeroComponentProps> = ({ hero }) => {
  /* Vars */

  const [isFavorite, setIsFavorite] = useState<boolean>(!!hero.isFavorite);

  /* Functions */

  const handleToogleFavorite = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isFavorite) {
      removeFavoriteHero(hero.id);
    } else {
      addFavoriteHero(hero);
    }

    setIsFavorite(!isFavorite);
  }

  return (
    <Link
      href={`/hero/${hero.id}`}
      key={`character-${hero.id}`}
      className="w-[150px]"
    >
      <Image
        src={`${hero.thumbnail.path}/portrait_xlarge.${hero.thumbnail.extension}`}
        alt={hero.name}
        width={150}
        height={225}
      />

      <div className="flex justify-between items-start gap-2">
        <span>{hero.name}</span>

        <button className="bg-transparent mt-2" onClick={handleToogleFavorite}>
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </Link>
  );
};
