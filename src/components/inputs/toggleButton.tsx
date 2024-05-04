import { FC } from "react";
import classNames from "classnames";

interface ToggleButtonProps {
  onChange: (isToggled: boolean) => void;
  value: boolean;
  label: string;
}

export const ToggleButton: FC<ToggleButtonProps> = ({
  onChange,
  value,
  label,
}) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={classNames("bg-transparent border-2 border-white h-11 px-2", { "bg-white text-black": value})}
    >
      {label}
    </button>
  );
};
