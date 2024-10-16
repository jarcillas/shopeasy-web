import { Link } from '@tanstack/react-router';

import { shoplists } from '../data.json';

const Sidebar = () => (
  <div className="flex flex-col grow-1 shrink-0 basis-[200px] m-4 space-y-4">
    <h2 className="font-semibold">Shoplists</h2>
    <ul className="flex flex-col ml-4 space-y-2">
      {shoplists.map((list, listIdx) => (
        <li>
          <Link
            to="/shoplist/$shoplistId"
            params={{ shoplistId: String(listIdx) }}
          >
            {list.title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export { Sidebar };
