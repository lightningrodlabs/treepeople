import { Tree } from './types';

import {
  EntryRecord,
  ZomeClient,
  isSignalFromCellWithRole,
} from '@holochain-open-dev/utils';
import {
  ActionHash,
  AgentPubKey,
  AppAgentClient,
  EntryHash,
  Record,
} from '@holochain/client';

import { TreepeopleSignal } from './types.js';

export class TreepeopleClient extends ZomeClient<TreepeopleSignal> {
  constructor(
    public client: AppAgentClient,
    public roleName: string,
    public zomeName = 'treepeople'
  ) {
    super(client, roleName, zomeName);
  }
  /** Tree */

  async createTree(tree: Tree): Promise<EntryRecord<Tree>> {
    const record: Record = await this.callZome('create_tree', tree);
    return new EntryRecord(record);
  }
  
  async getTree(treeHash: ActionHash): Promise<EntryRecord<Tree> | undefined> {
    const record: Record = await this.callZome('get_tree', treeHash);
    return record ? new EntryRecord(record) : undefined;
  }

  deleteTree(originalTreeHash: ActionHash): Promise<ActionHash> {
    return this.callZome('delete_tree', originalTreeHash);
  }

  async updateTree(originalTreeHash: ActionHash, previousTreeHash: ActionHash, updatedTree: Tree): Promise<EntryRecord<Tree>> {
    const record: Record = await this.callZome('update_tree', {
      original_tree_hash: originalTreeHash,
      previous_tree_hash: previousTreeHash,
      updated_tree: updatedTree
    });
    return new EntryRecord(record);
  }

  /** All Trees */

  async getAllTrees(): Promise<Array<EntryRecord<Tree>>> {
    const records: Record[] = await this.callZome('get_all_trees', null);
    return records.map(r => new EntryRecord(r));
  }

}
