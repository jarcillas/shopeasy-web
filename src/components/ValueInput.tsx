import React, { useState, useRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

interface ValueInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string | number | undefined;
  handleBlur?: (
    event:
      | React.FocusEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  customDisplay?: string;
  customClasses?: string;
  customInputClasses?: string;
  customDisplayClasses?: string;
  hideTooltip?: boolean;
}

const ValueInput: React.FC<ValueInputProps> = ({
  value,
  handleBlur,
  customDisplay,
  customClasses,
  customInputClasses,
  customDisplayClasses,
  hideTooltip,
  ...inputProps
}) => {
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState(value ? String(value) : '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with prop when the prop changes
  useEffect(() => {
    setInputValue(value ? String(value) : '');
  }, [value]);

  // When the component is clicked, set focus to the input
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [clicked]);

  return (
    <Tooltip>
      <TooltipTrigger
        className="h-full w-full text-left py-1"
        onFocus={() => {
          setClicked(true);
        }}
      >
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
              // autoFocus
              // onFocus={(e) => {
              //   e.target.select();
              // }}
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
              {...inputProps}
            />
          ) : (
            <div className={`px-1 h-8 w-full ${customDisplayClasses}`}>
              {customDisplay ?? value}
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent
        className={`bg-slate-200 rounded-sm text-slate-800 p-1.5 ${hideTooltip ? 'hidden' : ''}`}
      >
        Click to Edit
      </TooltipContent>
    </Tooltip>
  );
};

export { ValueInput };
