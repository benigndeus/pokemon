import { writeFile } from "fs";
import { index as pokemonIndex } from "../indices/pokemon-index.js";

const NGRAM = 3;
const fullNames = new Set();
const names = {};

for (const pokemon of pokemonIndex) {
    for (const ability of pokemon.abilities) {
        for (let i = 0; i < ability.length; i++) {
            for (let j = 1; j <= NGRAM; j++) {
                const gram = ability.slice(i, i + j);
    
                if (!names[gram]) {
                    names[gram] = new Set();
                }
                names[gram].add(pokemon.id);
    
                if (i + j >= ability.length) {
                    break;
                }
            }
        }
        fullNames.add(ability);
    }
}

for (const key in names) {
    names[key] = [...names[key]];
}

const contents = `export const index=${JSON.stringify(names)};export const exactlyIndex=${JSON.stringify([...fullNames])};`

writeFile(process.argv[2], contents, (e) => {
    if (e) {
        console.error("ERROR 발생", e);
    } else {
        console.log("Success to write index file.");
    }
});
