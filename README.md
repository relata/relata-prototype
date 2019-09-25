# relata-prototype

Prototype web application for the [Relata Project](https://culanth.org/engagements/relata). Uses the [Feathers](http://feathersjs.com) framework, along with [Citation.js](https://citation.js.org) for parsing and serializing bibliographic citations.

## Quickstart

Running the app in development mode is easy:

1. Ensure that [Node](https://nodejs.org) and [npm](https://www.npmjs.com) are installed.
2. Clone this repository.
3. Go to the project folder (`cd path/to/relata-prototype`) and install dependencies by executing `npm install`.
4. Start the app by executing `npm run dev`.
5. Go to <http://localhost:3030> in your browser.

## Creating relations

Relations can be created or modified via HTTP calls to the app's underlying API. For example, to create a new relation, submit a POST request with a JSON body resembling the following to `/relations`. Note that bibliographic works submitted via the `relation_from` and `relation_to` attributes must be in [CSL JSON](https://github.com/citation-style-language/schema/blob/master/csl-data.json) format. (Zotero and other reference management tools will readily export CSL JSON for you.)

```json
{
  "relation_type": "absence",
  "annotation": "This is an annotation",
  "relation_from": {
    "type": "article-journal",
    "title": "Auto-Construction Redux: The City as Method",
    "container-title": "Cultural Anthropology",
    "page": "450-478",
    "volume": "32",
    "issue": "3",
    "source": "Crossref",
    "URL": "https://journal.culanth.org/index.php/ca/article/view/ca32.3.09",
    "DOI": "10.14506/ca32.3.09",
    "ISSN": "1548-1360, 0886-7356",
    "title-short": "Auto-Construction Redux",
    "author": [
      {
        "family": "Corsín Jiménez",
        "given": "Alberto"
      }
    ],
    "issued": {
      "date-parts": [["2017", 8, 19]]
    },
    "accessed": {
      "date-parts": [["2019", 7, 6]]
    }
  },
  "relation_to": {
    "type": "book",
    "title": "The Great Transformation",
    "publisher": "Beacon Press",
    "publisher-place": "Boston",
    "event-place": "Boston",
    "author": [
      {
        "family": "Polanyi",
        "given": "Karl"
      }
    ],
    "issued": {
      "date-parts": [["2001"]],
      "season": "1944"
    }
  }
}
```
