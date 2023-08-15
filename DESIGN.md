# Treepeople 

## Data structure

### Trees

> Data that never changes over the course of a tree's life. "Intrinsic data."" Stuff you know when it's planted

- Planted by (can be blank)
- Date planted
- Latlong
- Species
- Variety
- Notes, eg.:
    - planting details
    - who gave us the tree
    - ceremonies when planted
    - weather
    - planting technology
    - hole size
- Collection of most recent non-intrinsic data

### Visits

> Associated with a tree and a date
> Data about the tree which is unique to a specific moment in time

- Tree link
- Date
- Visitor
- Height (optional)
- Circumference (optional)
- notes, eg.
    - condition
    - how agent feels lol
- image

### Species
 - Array of Common Names
 - Scientific Name
 - color for map

## Views

### Map view
- Dots for all trees
    - Maybe some representation of either intrinsic or most recent data
      - girth/age/height/species
      - count of visits
- Plant tree (create)

### List view
- Plant tree (create)
- list of tree summary views
    - Scrollable
    - Filterable
    - bulk add?

### Tree Summary View
- Name
- Species
- most recent visit image thumbnail?
- most recent girth/height?

### Tree Detail view
- Permanent data
- Add Visit
- List of visit summary view
    - Scrollable
- Edit tree intrinsic data

### Visit Summary View
- visitor
- date
- image thumbnail?

### Visit Detail View
- See Visit Data Structure
- Edit detail data
