use hdk::prelude::*;
use treepeople_integrity::*;
#[hdk_extern]
pub fn create_tree(tree: Tree) -> ExternResult<Record> {
    let tree_hash = create_entry(&EntryTypes::Tree(tree.clone()))?;
    let record = get(tree_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly created Tree"))
            ),
        )?;
    let path = Path::from("all_trees");
    create_link(path.path_entry_hash()?, tree_hash.clone(), LinkTypes::AllTrees, ())?;
    Ok(record)
}
#[hdk_extern]
pub fn get_tree(original_tree_hash: ActionHash) -> ExternResult<Option<Record>> {
    let links = get_links(original_tree_hash.clone(), LinkTypes::TreeUpdates, None)?;
    let latest_link = links
        .into_iter()
        .max_by(|link_a, link_b| link_a.timestamp.cmp(&link_b.timestamp));
    let latest_tree_hash = match latest_link {
        Some(link) => ActionHash::from(link.target.clone()),
        None => original_tree_hash.clone(),
    };
    get(latest_tree_hash, GetOptions::default())
}
#[derive(Serialize, Deserialize, Debug)]
pub struct UpdateTreeInput {
    pub original_tree_hash: ActionHash,
    pub previous_tree_hash: ActionHash,
    pub updated_tree: Tree,
}
#[hdk_extern]
pub fn update_tree(input: UpdateTreeInput) -> ExternResult<Record> {
    let updated_tree_hash = update_entry(
        input.previous_tree_hash.clone(),
        &input.updated_tree,
    )?;
    create_link(
        input.original_tree_hash.clone(),
        updated_tree_hash.clone(),
        LinkTypes::TreeUpdates,
        (),
    )?;
    let record = get(updated_tree_hash.clone(), GetOptions::default())?
        .ok_or(
            wasm_error!(
                WasmErrorInner::Guest(String::from("Could not find the newly updated Tree"))
            ),
        )?;
    Ok(record)
}
#[hdk_extern]
pub fn delete_tree(original_tree_hash: ActionHash) -> ExternResult<ActionHash> {
    delete_entry(original_tree_hash)
}
