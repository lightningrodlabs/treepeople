import { createContext } from '@lit-labs/context';

import { TreepeopleStore } from './treepeople-store';

export const treepeopleStoreContext = createContext<TreepeopleStore>(
  'hc_zome_treepeople/store'
);
