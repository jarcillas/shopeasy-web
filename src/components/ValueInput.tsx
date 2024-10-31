import { useState, useRef, useEffect } from 'react';

const ValueInput = ({
  value,
  handleBlur,
  customDisplay,
  customClasses,
  customInputClasses,
}: {
  value: string | number | undefined;
  handleBlur?: Function;
  customDisplay?: string;
  customClasses?: string;
  customInputClasses?: string;
}) => {
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState(value ? String(value) : '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with prop when the prop changes
  useEffect(() => {
    setInputValue(value ? String(value) : '');
  }, [value]);

  return (
    <div
      className={`w-full h-8 cursor-pointer ${customClasses ? customClasses : ''}`}
      onClick={(e) => {
        e.preventDefault();
        setClicked(true);
      }}
    >
      {clicked ? (
        <input
          className={`bg-slate-700 h-8 outline-none w-full p-1 m-0 ${customInputClasses ? customInputClasses : ''}`}
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
          onKeyDown={(e) => {
            // e.preventDefault();
            if (e.key === 'Enter') {
              setClicked(false);
              // setInputValue((e.target as HTMLInputElement).value);
              if (handleBlur) handleBlur(e);
            }
          }}
        />
      ) : (
        <div className="p-1">{customDisplay ?? value}</div>
      )}
    </div>
  );
};

export { ValueInput };
