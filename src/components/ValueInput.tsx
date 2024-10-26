import { useState, useRef, useEffect } from 'react';

const ValueInput = ({
  value,
  handleBlur,
}: {
  value: string | number;
  handleBlur?: Function;
}) => {
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with prop when the prop changes
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  return (
    <div
      className="p-1 w-full cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        setClicked(true);
      }}
    >
      {clicked ? (
        <input
          className="bg-slate-700 outline-none w-full"
          value={inputValue}
          ref={inputRef}
          autoFocus
          onBlur={(e) => {
            e.preventDefault();
            setClicked(false);
            if (handleBlur) handleBlur(e);
          }}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      ) : (
        <div>{value}</div>
      )}
    </div>
  );
};

export { ValueInput };
