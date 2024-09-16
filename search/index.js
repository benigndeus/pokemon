import { index as pokemonIndex } from "./indices/pokemon-index.js";
import { index as namesIndex } from "./indices/name-3gram-index.js";
import { index as abilitiesIndex } from "./indices/ability-index.js";

const DEFAULT_SEARCH_SIZE = 10;
const INTENT = Object.freeze({
    ABILITY: "ABILITY",
    NAME: "NAME",
});

const analyzeSearchIntent = (keyword) => {
    if (Object.keys(abilitiesIndex).includes(keyword)) {
        return INTENT.ABILITY;
    }
    return INTENT.NAME;
};

export const search = (condition) => {
    if (!condition.keyword && !condition.keyword.trim()) {
        throw "search keyword is empty.";
    }

    const trimmedKeyword = condition.keyword.trim();
    const intent = analyzeSearchIntent(trimmedKeyword);

    const size = condition.size || DEFAULT_SEARCH_SIZE;

    switch(intent) {
        case INTENT.ABILITY:
            return abilitiesIndex[trimmedKeyword].map((id) => pokemonIndex[id - 1]).slice(0, size);
        case INTENT.NAME:
            return namesIndex[trimmedKeyword].map((id) => pokemonIndex[id - 1]).slice(0, size);
        default:
            throw "Failed to search.";
    }
};
