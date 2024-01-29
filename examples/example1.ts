import { Entity } from "../src/types";
import { generateRepository } from "../src/core";

// Example 1 has a simple entity with following constraints:
// code is both required and search-enabler.
export const entity: Entity = {
    name: "language",
    props: [
        {
            "comment": "code of the language.",
            "name": "code",
            "required": true,
            "searchEnabler": true,
            "type": "string"
        },
        {
            "comment": "title of the language.",
            "name": "title",
            "required": true,
            "searchEnabler": false,
            "type": "string"
        }
    ],
};

const result = generateRepository({
    "entity": entity
});

console.log(result);