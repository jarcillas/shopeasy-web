import { AuthHeader } from './AuthHeader';

const Header = () => (
  <div className="w-full flex flex-row items-center justify-between text-[2rem] text-white font-bold font-display px-8 py-2 bg-slate-800 select-none">
    <span>ShopEasy</span>
    <div className="flex items-center">
      <AuthHeader />
    </div>
  </div>
);

export { Header };
