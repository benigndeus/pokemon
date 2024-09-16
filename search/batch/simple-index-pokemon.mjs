import { writeFile } from "fs";
import { mapAbilityOrElseSelf } from "../dictionary/ability.js";

console.log([...process.argv]);

const fetchTypes = async (pokemonResponse) => {
    const result = [];

    const types = [...pokemonResponse.types];
    types.sort((a, b) => a.slot - b.slot);

    for (const type of types) {
        const response = await fetch(type.type.url);
        const data = await response.json();
        result.push(data.names.find((n) => "ko" === n.language.name).name);
    }

    return result;
};

const fetchAbilities = async (pokemonResponse) => {
    const result = [];

    const abilities = [...pokemonResponse.abilities];
    abilities.sort((a, b) => a.slot - b.slot);

    for (const ability of abilities) {
        const response = await fetch(ability.ability.url);
        const data = await response.json();
        const foundAbility = data.names.find((n) => "ko" === n.language.name);

        if (foundAbility) {
            result.push(foundAbility.name);
        } else {
            const originWord = data.names.find((n) => "en" === n.language.name).name;
            const mappedWord = mapAbilityOrElseSelf(originWord);

            if (originWord === mappedWord) {
                console.warn(`UNTRANSLTED ABILITY WORD: ${originWord}`, JSON.stringify(ability));
            }

            result.push(mappedWord);
        }
    }

    return result;
};

fetch("https://pokeapi.co/api/v2/pokedex/1")
    .then((r) => r.json())
    .then((data) => {
        Promise
            .all(data.pokemon_entries.map((e) => {
                return Promise.all([
                    fetch(`https://pokeapi.co/api/v2/pokemon-species/${e.entry_number}`).then((r) => r.json()),
                    fetch(`https://pokeapi.co/api/v2/pokemon/${e.entry_number}`).then((r) => r.json()),
                ]);
            }))
            .then(async (values) => {
                const result = await Promise.all(values.map(async (info) => ({
                    id: info[0].pokedex_numbers.find((d) => "national" === d.pokedex.name).entry_number,
                    name: info[0].names.find((n) => "ko" === n.language.name).name,
                    types: await fetchTypes(info[1]),
                    abilities: await fetchAbilities(info[1]),
                })));

                writeFile(process.argv[2], "export const index = " + JSON.stringify(result, null, 2) + ";\n", (err) => {
                    if (err) {
                        console.error("ERROR 발생", err);
                    } else {
                        console.log("Success to write index file.");
                    }
                });
            })
    });
