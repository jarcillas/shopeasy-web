import { useState, useRef } from 'react';
import { useStore } from '@/store';
import { Input } from './ui/input';
import { Button } from './ui/button';
// import { Info } from 'lucide-react';
import { v4 } from 'uuid';

const CreateShoplist = () => {
  const [inputValue, setInputValue] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const addShoplist = useStore((state) => state.addShoplist);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  return (
    <>
      <Input
        placeholder="Shoplist Name"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {/* <div className="text-xs flex items-center justify-end gap-x-1 text-slate-400">
        <Info size={12} className="inline" />
        Press ESC to close.
      </div> */}
      <Button
        variant={'default'}
        ref={buttonRef}
        type="submit"
        className="text-slate-200"
        onClick={() => {
          addShoplist({
            id: v4(),
            name: inputValue,
            items: [],
          });
          setInputValue('');
        }}
      >
        Create
      </Button>
    </>
  );
};

export { CreateShoplist };
