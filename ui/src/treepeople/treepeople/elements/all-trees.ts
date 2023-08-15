import { LitElement, html } from 'lit';
import { state, customElement, property } from 'lit/decorators.js';
import { AgentPubKey, EntryHash, ActionHash, Record } from '@holochain/client';
import { StoreSubscriber } from '@holochain-open-dev/stores';
import { consume } from '@lit-labs/context';
import { localized, msg } from '@lit/localize';
import { hashProperty, sharedStyles, wrapPathInSvg } from '@holochain-open-dev/elements';
import { mdiInformationOutline } from '@mdi/js';

import '@holochain-open-dev/elements/dist/elements/display-error.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';

import './tree-summary.js';
import { TreepeopleStore } from '../treepeople-store.js';
import { treepeopleStoreContext } from '../context.js';
import './tree-detail.js'
/**
 * @element all-trees
 */
@localized()
@customElement('all-trees')
export class AllTrees extends LitElement {
  
  /**
   * @internal
   */
  @consume({ context: treepeopleStoreContext, subscribe: true })
  treepeopleStore!: TreepeopleStore;

  /**
   * @internal
   */
  _allTrees = new StoreSubscriber(this, 
    () => this.treepeopleStore.allTrees  );

  @state() _treeDetail: EntryHash | undefined;

  renderList(hashes: Array<ActionHash>) {
    if (hashes.length === 0) 
      return html` <div class="column center-content">
        <sl-icon
          .src=${wrapPathInSvg(mdiInformationOutline)}
          style="color: grey; height: 64px; width: 64px; margin-bottom: 16px"
          ></sl-icon
        >
        <span class="placeholder">${msg("No trees found")}</span>
      </div>`;

    return html`
      <div style="display: flex; flex-direction: column; flex: 1">
        ${hashes.map(hash => 
          html`<tree-summary @tree-selected=${(e:any)=>{console.log("FISH");this._treeDetail=hash}} .treeHash=${hash} style="margin-bottom: 16px;"></tree-summary>`
        )}
      </div>
      ${this._treeDetail ? html`<tree-detail .treeHash=${this._treeDetail}></tree-detail>`:""}

    `;
  }

  render() {
    switch (this._allTrees.value.status) {
      case "pending":
        return html`<div
          style="display: flex; flex: 1; align-items: center; justify-content: center"
        >
          <sl-spinner style="font-size: 2rem;"></sl-spinner>
        </div>`;
      case "complete":
        return this.renderList(this._allTrees.value.value);
      case "error":
        return html`<display-error
          .headline=${msg("Error fetching the trees")}
          .error=${this._allTrees.value.error.data.data}
        ></display-error>`;
    }
  }
  
  static styles = [sharedStyles];
}
