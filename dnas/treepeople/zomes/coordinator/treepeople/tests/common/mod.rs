use hdk::prelude::*;
use holochain::sweettest::*;

use treepeople_integrity::*;



pub async fn sample_tree_1(conductor: &SweetConductor, zome: &SweetZome) -> Tree {
    Tree {
	  planter: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".to_string(),
	  date_planted: 1674053334548000,
	  species: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".to_string(),
	  variety: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".to_string(),
	  notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".to_string(),
    }
}

pub async fn sample_tree_2(conductor: &SweetConductor, zome: &SweetZome) -> Tree {
    Tree {
	  planter: "Lorem ipsum 2".to_string(),
	  date_planted: 1674059334548000,
	  species: "Lorem ipsum 2".to_string(),
	  variety: "Lorem ipsum 2".to_string(),
	  notes: "Lorem ipsum 2".to_string(),
    }
}

pub async fn create_tree(conductor: &SweetConductor, zome: &SweetZome, tree: Tree) -> Record {
    let record: Record = conductor
        .call(zome, "create_tree", tree)
        .await;
    record
}

