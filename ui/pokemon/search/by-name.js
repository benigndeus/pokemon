import { index } from "../../../indices/pokemon-name-index.js";

export const searchByName = (condition) => {
    if (!condition.keyword) {
        throw "search keyword is empty.";
    }
    if (condition.size) {
        return index.filter((pokemon) => pokemon.name.includes(condition.keyword)).slice(0, size);
    } else {
        return index.filter((pokemon) => pokemon.name.includes(condition.keyword)).slice(0, 10);
    }
};
