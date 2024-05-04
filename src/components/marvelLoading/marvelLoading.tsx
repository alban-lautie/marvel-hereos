import React, { FC } from "react";
import Lottie from "react-lottie";
import animationData from "./spierman-animation.json";

export const MarvelLoading: FC = () => {
  /* Vars */

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // ReferenceError: document is not defined - Issue (https://github.com/Gamote/lottie-react/issues/101)

  return <Lottie options={defaultOptions} height={400} width={400} />;
};
