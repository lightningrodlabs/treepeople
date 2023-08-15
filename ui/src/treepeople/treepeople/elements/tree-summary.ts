import { LitElement, html } from 'lit';
import { state, property, customElement } from 'lit/decorators.js';
import { EntryHash, Record, ActionHash } from '@holochain/client';
import { EntryRecord } from '@holochain-open-dev/utils';
import { StoreSubscriber } from '@holochain-open-dev/stores';
import { hashProperty, sharedStyles } from '@holochain-open-dev/elements';
import { consume } from '@lit-labs/context';

import { localized, msg } from '@lit/localize';

import '@holochain-open-dev/elements/dist/elements/display-error.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/format-date/format-date.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import { TreepeopleStore } from '../treepeople-store';
import { treepeopleStoreContext } from '../context';
import { Tree } from '../types';

/**
 * @element tree-summary
 * @fires tree-selected: detail will contain { treeHash }
 */
@localized()
@customElement('tree-summary')
export class TreeSummary extends LitElement {

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

  renderSummary(entryRecord: EntryRecord<Tree>) {
    return html`
      <div style="display: flex; flex-direction: row">
        <span style="font-weight:bold;margin-right:10px;"> ${ entryRecord.entry.species } ${entryRecord.entry.variety ? `- ${entryRecord.entry.variety}` : ""}</span>
        <sl-format-date .date=${new Date(entryRecord.entry.date_planted / 1000) }></sl-format-date>

      </div>
    `;
  }
  
  renderTree() {
    switch (this._tree.value.status) {
      case "pending":
        return html`<div
          style="display: flex; flex: 1; align-items: center; justify-content: center"
        >
            <sl-spinner style="font-size: 2rem;"></sl-spinner>
        </div>`;
      case "complete":
        if (!this._tree.value.value) return html`<span>${msg("The requested tree doesn't exist")}</span>`;

        return this.renderSummary(this._tree.value.value);
      case "error":
        return html`<display-error
          .headline=${msg("Error fetching the tree")}
          .error=${this._tree.value.error.data.data}
        ></display-error>`;
    }
  }
  
  render() {
    return html`<sl-card style="flex: 1; cursor: grab;" @click=${() => { this.dispatchEvent(new CustomEvent('tree-selected', {
          composed: true,
          bubbles: true,
          detail: {
            treeHash: this.treeHash
          }
        }))}}>
        ${this.renderTree()}
    </sl-card>`;
  }

  
  static styles = [sharedStyles];
}
