import { LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { EntryHash, Record, ActionHash } from '@holochain/client';
import { EntryRecord } from '@holochain-open-dev/utils';
import { StoreSubscriber } from '@holochain-open-dev/stores';
import { sharedStyles, hashProperty, wrapPathInSvg, notifyError } from '@holochain-open-dev/elements';
import { consume } from '@lit-labs/context';
import { localized, msg } from '@lit/localize';
import { mdiAlertCircleOutline, mdiPencil, mdiDelete } from '@mdi/js';


import '@shoelace-style/shoelace/dist/components/format-date/format-date.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@holochain-open-dev/elements/dist/elements/display-error.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import './edit-tree.js';

import { TreepeopleStore } from '../treepeople-store.js';
import { treepeopleStoreContext } from '../context.js';
import { Tree } from '../types.js';

/**
 * @element tree-detail
 * @fires tree-deleted: detail will contain { treeHash }
 */
@localized()
@customElement('tree-detail')
export class TreeDetail extends LitElement {

  // REQUIRED. The hash of the Tree to show
  @property(hashProperty('tree-hash'))
  treeHash!: ActionHash;

  /**
   * @internal
   */
  @consume({ context: treepeopleStoreContext, subscribe: true })
  treepeopleStore!: TreepeopleStore;

  /**
   * @internal
   */
   _tree = new StoreSubscriber(this, () => this.treepeopleStore.trees.get(this.treeHash));

  /**
   * @internal
   */
  @state()
  _editing = false;

  async deleteTree() {
    try {
      await this.treepeopleStore.client.deleteTree(this.treeHash);
 
      this.dispatchEvent(new CustomEvent('tree-deleted', {
        bubbles: true,
        composed: true,
        detail: {
          treeHash: this.treeHash
        }
      }));
    } catch (e: any) {
      notifyError(msg("Error deleting the tree"));
      console.error(e);
    }
  }

  renderDetail(entryRecord: EntryRecord<Tree>) {
    return html`<sl-card>
      	<div slot="header" style="display: flex; flex-direction: row">
          <span style="font-size: 18px; flex: 1;">${msg("Tree")}</span>

          <sl-icon-button style="margin-left: 8px" .src=${wrapPathInSvg(mdiPencil)} @click=${() => { this._editing = true; } }></sl-icon-button>
          <sl-icon-button style="margin-left: 8px" .src=${wrapPathInSvg(mdiDelete)} @click=${() => this.deleteTree()}></sl-icon-button>
        </div>

        <div style="display: flex; flex-direction: column">
  
          <div style="display: flex; flex-direction: column; margin-bottom: 16px">
	    <span style="margin-bottom: 8px"><strong>${msg("Planter")}</strong></span>
 	    <span style="white-space: pre-line">${ entryRecord.entry.planter }</span>
	  </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 16px">
	    <span style="margin-bottom: 8px"><strong>${msg("Date Planted")}</strong></span>
 	    <span style="white-space: pre-line"><sl-format-date .date=${new Date(entryRecord.entry.date_planted / 1000) }></sl-format-date></span>
	  </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 16px">
	    <span style="margin-bottom: 8px"><strong>${msg("Species")}</strong></span>
 	    <span style="white-space: pre-line">${ entryRecord.entry.species }</span>
	  </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 16px">
	    <span style="margin-bottom: 8px"><strong>${msg("Variety")}</strong></span>
 	    <span style="white-space: pre-line">${ entryRecord.entry.variety }</span>
	  </div>

          <div style="display: flex; flex-direction: column; margin-bottom: 16px">
	    <span style="margin-bottom: 8px"><strong>${msg("Notes")}</strong></span>
 	    <span style="white-space: pre-line">${ entryRecord.entry.notes }</span>
	  </div>

      </div>
      </sl-card>
    `;
  }
  
  render() {
    switch (this._tree.value.status) {
      case "pending":
        return html`<sl-card>
          <div
            style="display: flex; flex: 1; align-items: center; justify-content: center"
          >
            <sl-spinner style="font-size: 2rem;"></sl-spinner>
          </div>
        </sl-card>`;
      case "complete":
        const tree = this._tree.value.value;
        
        if (!tree) return html`<span>${msg("The requested tree doesn't exist")}</span>`;
    
        if (this._editing) {
    	  return html`<edit-tree
    	    .originalTreeHash=${this.treeHash}
    	    .currentRecord=${ tree }
            @tree-updated=${async () => { this._editing = false; } }
      	    @edit-canceled=${() => { this._editing = false; } }
    	    style="display: flex; flex: 1;"
    	  ></edit-tree>`;
      }

        return this.renderDetail(tree);
      case "error":
        return html`<sl-card>
          <display-error
            .headline=${msg("Error fetching the tree")}
            .error=${this._tree.value.error.data.data}
          ></display-error>
        </sl-card>`;
    }
  }
  
  static styles = [sharedStyles];
}
