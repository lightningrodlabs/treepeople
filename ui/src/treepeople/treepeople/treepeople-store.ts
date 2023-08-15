import { Tree } from './types';

import { AsyncReadable, lazyLoadAndPoll } from '@holochain-open-dev/stores';
import { EntryRecord, LazyHoloHashMap } from '@holochain-open-dev/utils';
import {
  ActionHash,
  AgentPubKey,
  EntryHash,
  NewEntryAction,
  Record,
} from '@holochain/client';

import { TreepeopleClient } from './treepeople-client.js';

export class TreepeopleStore {
  constructor(public client: TreepeopleClient) {}
  
  /** Tree */

  trees = new LazyHoloHashMap((treeHash: ActionHash) =>
    lazyLoadAndPoll(async () => this.client.getTree(treeHash), 4000)
  );
  
  /** All Trees */

  allTrees = lazyLoadAndPoll(async () => {
    const records = await this.client.getAllTrees();
    return records.map(r => r.actionHash);
  }, 4000);
}
