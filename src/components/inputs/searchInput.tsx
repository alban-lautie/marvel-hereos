import { ChangeEvent, FC, useState } from "react";
import classNames from "classnames";

interface SearchInputProps {
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  placeholder?: string;
}

export const SearchInput: FC<SearchInputProps> = ({ className, onChange, defaultValue = '', ...props }) => {
  /* Vars */

  const [inputValue, setInputValue] = useState<string>(defaultValue);

  /* Functions */

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value;

    if (v.length >= 3) {
      onChange(v);
    } else {
      onChange(defaultValue);
    }

    setInputValue(v);
  }

  return (
    <input
      className={classNames(
        className,
        "bg-transparent p-2 border-2 border-white w-full outline-none h-11"
      )}
      onChange={handleInputChange}
      value={inputValue}
      {...props}
    />
  );
};
