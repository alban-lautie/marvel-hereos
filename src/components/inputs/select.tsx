import { FC } from "react";
import classNames from "classnames";

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  className?: string;
  options: Option[];
  value?: string | number;
  onChange: (value: string | number) => void;
}

export const Select: FC<SelectProps> = ({
  className,
  options,
  onChange,
  ...props
}) => {
  return (
    <select
      className={classNames(
        className,
        "bg-transparent p-2 border-2 border-white outline-none"
      )}
      onChange={(event) => onChange(event.target.value)}
      {...props}
    >
      {options.map(({ label, value }) => (
        <option key={label} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};
