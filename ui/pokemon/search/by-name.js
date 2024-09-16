import { index } from "../../../search/indices/pokemon-index.js";

const DEFAULT_SEARCH_SIZE = 10;

export const searchByName = (condition) => {
    if (!condition.keyword) {
        throw "search keyword is empty.";
    }
    if (condition.size) {
        return index.filter((pokemon) => pokemon.name.includes(condition.keyword)).slice(0, size);
    } else {
        return index.filter((pokemon) => pokemon.name.includes(condition.keyword)).slice(0, DEFAULT_SEARCH_SIZE);
    }
};
