import { writeFile } from "fs";

console.log([...process.argv]);

fetch("https://pokeapi.co/api/v2/pokedex/1")
    .then((r) => r.json())
    .then((data) => Promise
        .all(data.pokemon_entries.map((e) => fetch(e.pokemon_species.url).then((r) => r.json())))
        .then((values) => {
            const result = values.map((pokemon) => ({
                id: pokemon.pokedex_numbers?.find((d) => "national" === d.pokedex.name).entry_number,
                name: pokemon.names?.find((n) => "ko" === n.language.name).name,
            }));

            writeFile(process.argv[2], "export const index = " + JSON.stringify(result, null, 2) + ";\n", (err) => {
                if (err) {
                    console.error("ERROR 발생", err);
                } else {
                    console.log("Success to write index file.");
                }
            });
        }));
