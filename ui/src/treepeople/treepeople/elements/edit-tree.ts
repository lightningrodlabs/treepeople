import { LitElement, html } from 'lit';
import { repeat } from "lit/directives/repeat.js";
import { state, customElement, property } from 'lit/decorators.js';
import { ActionHash, Record, EntryHash, AgentPubKey } from '@holochain/client';
import { EntryRecord } from '@holochain-open-dev/utils';
import { hashState, notifyError, sharedStyles, hashProperty, wrapPathInSvg, onSubmit } from '@holochain-open-dev/elements';
import { consume } from '@lit-labs/context';
import { localized, msg } from '@lit/localize';
import { mdiAlertCircleOutline, mdiDelete } from '@mdi/js';

import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/card/card.js';
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import { TreepeopleStore } from '../treepeople-store';
import { treepeopleStoreContext } from '../context';
import { Tree } from '../types';

/**
 * @element edit-tree
 * @fires tree-updated: detail will contain { originalTreeHash, previousTreeHash, updatedTreeHash }
 */
@localized()
@customElement('edit-tree')
export class EditTree extends LitElement {

  // REQUIRED. The hash of the original `Create` action for this Tree
  @property(hashProperty('original-tree-hash'))
  originalTreeHash!: ActionHash;
  
  // REQUIRED. The current Tree record that should be updated
  @property()
  currentRecord!: EntryRecord<Tree>;
  
  /**
   * @internal
   */
  @consume({ context: treepeopleStoreContext })
  treepeopleStore!: TreepeopleStore;

  /**
   * @internal
   */
  @state()
  committing = false;
   

  firstUpdated() {
    this.shadowRoot?.querySelector('form')!.reset();
  }

  async updateTree(fields: any) {  
    const tree: Tree = { 
      planter: fields.planter,
      date_planted: new Date(fields.date_planted).valueOf() * 1000,
      species: fields.species,
      variety: fields.variety,
      notes: fields.notes,
    };

    try {
      this.committing = true;
      const updateRecord = await this.treepeopleStore.client.updateTree(
        this.originalTreeHash,
        this.currentRecord.actionHash,
        tree
      );
  
      this.dispatchEvent(new CustomEvent('tree-updated', {
        composed: true,
        bubbles: true,
        detail: {
          originalTreeHash: this.originalTreeHash,
          previousTreeHash: this.currentRecord.actionHash,
          updatedTreeHash: updateRecord.actionHash
        }
      }));
    } catch (e: any) {
      console.error(e);
      notifyError(msg("Error updating the tree"));
    }
    
    this.committing = false;
  }

  render() {
    return html`
      <sl-card>
        <span slot="header">${msg("Edit Tree")}</span>

        <form 
          style="display: flex; flex: 1; flex-direction: column;"
          ${onSubmit(fields => this.updateTree(fields))}
        >  
          <div style="margin-bottom: 16px">
        <sl-input name="planter" .label=${msg("Planter")}  required .defaultValue=${ this.currentRecord.entry.planter }></sl-input>          </div>

          <div style="margin-bottom: 16px">
        <sl-input name="date_planted" .label=${msg("Date Planted")} type="datetime-local" @click=${(e: Event) => e.preventDefault()}  required .defaultValue=${new Date(this.currentRecord.entry.date_planted/1000).toLocaleString()} ></sl-input>          </div>

          <div style="margin-bottom: 16px">
        <sl-input name="species" .label=${msg("Species")}  required .defaultValue=${ this.currentRecord.entry.species }></sl-input>          </div>

          <div style="margin-bottom: 16px">
        <sl-input name="variety" .label=${msg("Variety")}  required .defaultValue=${ this.currentRecord.entry.variety }></sl-input>          </div>

          <div style="margin-bottom: 16px">
        <sl-textarea name="notes" .label=${msg("Notes")}  required .defaultValue=${ this.currentRecord.entry.notes }></sl-textarea>          </div>



          <div style="display: flex; flex-direction: row">
            <sl-button
              @click=${() => this.dispatchEvent(new CustomEvent('edit-canceled', {
                bubbles: true,
                composed: true
              }))}
              style="flex: 1;"
            >${msg("Cancel")}</sl-button>
            <sl-button
              type="submit"
              variant="primary"
              style="flex: 1;"
              .loading=${this.committing}
            >${msg("Save")}</sl-button>

          </div>
        </form>
      </sl-card>`;
  }

  static styles = [sharedStyles];
}
