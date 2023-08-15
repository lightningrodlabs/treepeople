import { LitElement, html } from 'lit';
import { repeat } from "lit/directives/repeat.js";
import { state, property, query, customElement } from 'lit/decorators.js';
import { ActionHash, Record, DnaHash, AgentPubKey, EntryHash } from '@holochain/client';
import { EntryRecord } from '@holochain-open-dev/utils';
import { hashProperty, notifyError, hashState, sharedStyles, onSubmit, wrapPathInSvg } from '@holochain-open-dev/elements';
import { consume } from '@lit-labs/context';
import { localized, msg } from '@lit/localize';
import { mdiAlertCircleOutline, mdiDelete } from "@mdi/js";

import '@shoelace-style/shoelace/dist/components/card/card.js';
import SlAlert from '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@holochain-open-dev/elements/dist/elements/display-error.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js';

import { TreepeopleStore } from '../treepeople-store.js';
import { treepeopleStoreContext } from '../context.js';
import { Tree } from '../types.js';

/**
 * @element create-tree
 * @fires tree-created: detail will contain { treeHash }
 */
@localized()
@customElement('create-tree')
export class CreateTree extends LitElement {

  /**
   * @internal
   */
  @consume({ context: treepeopleStoreContext, subscribe: true })
  treepeopleStore!: TreepeopleStore;

  /**
   * @internal
   */
  @state()
  committing = false;

  /**
   * @internal
   */
  @query('#create-form')
  form!: HTMLFormElement;


  async createTree(fields: any) {
  
    const tree: Tree = {
      planter: fields.planter,
      date_planted: new Date(fields.date_planted).valueOf() * 1000,
      species: fields.species,
      variety: fields.variety,
      notes: fields.notes,
    };

    try {
      this.committing = true;
      const record: EntryRecord<Tree> = await this.treepeopleStore.client.createTree(tree);

      this.dispatchEvent(new CustomEvent('tree-created', {
        composed: true,
        bubbles: true,
        detail: {
          treeHash: record.actionHash
        }
      }));
      
      this.form.reset();
    } catch (e: any) {
      console.error(e);
      notifyError(msg("Error creating the tree"));
    }
    this.committing = false;
  }

  render() {
    return html`
      <sl-card style="flex: 1;">
        <span slot="header">${msg("Create Tree")}</span>

        <form 
          id="create-form"
          style="display: flex; flex: 1; flex-direction: column;"
          ${onSubmit(fields => this.createTree(fields))}
        >  
          <div style="margin-bottom: 16px;">
          <sl-input name="planter" .label=${msg("Planter")}  required></sl-input>          </div>

          <div style="margin-bottom: 16px;">
          <sl-input name="date_planted" .label=${msg("Date Planted")} type="datetime-local" @click=${(e: Event) => e.preventDefault()}  required></sl-input>          </div>

          <div style="margin-bottom: 16px;">
          <sl-input name="species" .label=${msg("Species")}  required></sl-input>          </div>

          <div style="margin-bottom: 16px;">
          <sl-input name="variety" .label=${msg("Variety")}  required></sl-input>          </div>

          <div style="margin-bottom: 16px;">
          <sl-textarea name="notes" .label=${msg("Notes")}  required></sl-textarea>          </div>


          <sl-button
            variant="primary"
            type="submit"
            .loading=${this.committing}
          >${msg("Create Tree")}</sl-button>
        </form> 
      </sl-card>`;
  }
  
  static styles = [sharedStyles];
}
