import { writeFile } from "fs";
import { index as pokemonIndex } from "../indices/pokemon-index.js";

const NGRAM = 3;
const names = {};

for (const pokemon of pokemonIndex) {
    for (let i = 0; i < pokemon.name.length; i++) {
        for (let j = 1; j <= NGRAM; j++) {
            const gram = pokemon.name.slice(i, i + j);

            if (!names[gram]) {
                names[gram] = new Set();
            }
            names[gram].add(pokemon.id);

            if (i + j >= pokemon.name.length) {
                break;
            }
        }
    }
    if (!names[pokemon.name]) {
        names[pokemon.name] = new Set();
    }
    names[pokemon.name].add(pokemon.id);
}

for (const key in names) {
    names[key] = [...names[key]];
}

writeFile(process.argv[2], `export const index = ${JSON.stringify(names, null, 2)};\n`, (e) => {
    if (e) {
        console.error("ERROR 발생", e);
    } else {
        console.log("Success to write index file.");
    }
});
