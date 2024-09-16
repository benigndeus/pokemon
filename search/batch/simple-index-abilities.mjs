import { writeFile } from "fs";
import { index as pokemonIndex } from "../indices/pokemon-index.js";

const abilities = {};

for(const pokemon of pokemonIndex) {
    for (const ability of pokemon.abilities) {
        if (!abilities[ability]) {
            abilities[ability] = new Set();
        }
        abilities[ability].add(pokemon.id);
    }
}

for (const key in abilities) {
    abilities[key] = [...abilities[key]];
}

writeFile(process.argv[2], `export const index = ${JSON.stringify(abilities, null, 2)};\n`, (e) => {
    if (e) {
        console.error("ERROR 발생", e);
    } else {
        console.log("Success to write index file.");
    }
});
