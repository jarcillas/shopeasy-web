import { useState, useRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';

const ValueInput = ({
  value,
  handleBlur,
  customDisplay,
  customClasses,
  customInputClasses,
  hideTooltip,
}: {
  value: string | number | undefined;
  handleBlur?: Function;
  customDisplay?: string;
  customClasses?: string;
  customInputClasses?: string;
  hideTooltip?: boolean;
}) => {
  const [clicked, setClicked] = useState(false);
  const [inputValue, setInputValue] = useState(value ? String(value) : '');
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync state with prop when the prop changes
  useEffect(() => {
    setInputValue(value ? String(value) : '');
  }, [value]);

  return (
    <Tooltip>
      <TooltipTrigger className="h-full w-full text-left">
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
              onFocus={(e) => {
                e.target.select();
              }}
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
            <div className="p-1 w-full">{customDisplay ?? value}</div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent className={`${hideTooltip ? 'hidden' : ''}`}>
        Click to Edit
      </TooltipContent>
    </Tooltip>
  );
};

export { ValueInput };
