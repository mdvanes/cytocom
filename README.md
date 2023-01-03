# Cytocom

> Visually explore genealogical data

Make a graph visualisation with [Cytoscape.JS](https://js.cytoscape.org/) and [read-gedcom](https://docs.arbre.app/read-gedcom/) for [GEDCOM](https://www.gedcom.org/) genealogical data collections.

## Notes

- Any individual should be part of a family to be shown
- To be able to tell if parents in a family are married, the event "married" should be set, even without a date. Setting the relationship type "married" in GRAMPS is not enough.
- To show an URL, add a field under "Internet" in GRAMPS of type "Web Home"
- Color scheme from the CSS of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/

## Copyrights

- Images of fictional characters are generated with https://generated.photos/faces/
- Images of non-fictional characters are from https://en.wikipedia.org
- Data for the Seven Sisters GEDCOM file are based on the Seven Sisters novels by Lucinda Riley

## TODO

- Link from the old repo to the new repo, with a deeplink with gedcomPath & layout
- bug: BET death is not processed in filter (same for BET birth) - partially fixed
- date slider on mobile on separate line
- https://stackoverflow.com/questions/26123468/dynamic-node-content-label-in-cytoscape-js
- bug: `Failed to parse source map` caused by CRA 5, see https://stackoverflow.com/a/70834076/7486264
