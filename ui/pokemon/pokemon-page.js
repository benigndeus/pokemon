const renderName = (pokemonSpeciesResponse) => {
    const nameEl = document.getElementById("pokemon-name");

    for (const nameDetail of pokemonSpeciesResponse.names) {
        if ("ko" === nameDetail.language.name) {
            nameEl.innerText = nameDetail.name;
            break;
        }
    }
};

const renderSprites = (pokemonResponse) => {
    const imgContainerEl = document.getElementById("pokemon-image");
    const mainImgEl = document.createElement("img");
    imgContainerEl.appendChild(mainImgEl);

    mainImgEl.src = pokemonResponse.sprites.front_default;
};

const renderTypes = (pokemonResponse) => {
    const typesEl = document.createElement("ul");
    const types = [...pokemonResponse.types];
    types.sort((a, b) => a.slot - b.slot);

    for (const type of types) {
        const typeEl = document.createElement("li");
        fetch(type.type.url)
            .then((r) => r.json())
            .then((data) => {
                for (const aName of data.names) {
                    if ("ko" === aName.language.name) {
                        typeEl.innerText = aName.name;
                        break;
                    }
                }
            });
        typesEl.appendChild(typeEl);
    }

    document.getElementById("pokemon-types")
            .appendChild(typesEl);
};

const renderAbilities = (pokemonResponse) => {
    const abilitiesEl = document.createElement("ul");
    const abilities = [...pokemonResponse.abilities];
    abilities.sort((a, b) => a.slot - b.slot);

    for (const anAbility of abilities) {
        const abilityEl = document.createElement("li");
        fetch(anAbility.ability.url)
            .then((r) => r.json())
            .then((data) => {
                for (const aName of data.names) {
                    if ("ko" === aName.language.name) {
                        abilityEl.innerText = aName.name;
                        break;
                    }
                }
            });
        abilitiesEl.appendChild(abilityEl);
    }

    document.getElementById("pokemon-abilities")
            .appendChild(abilitiesEl);
};



const renderStats = (pokemonResponse) => {
    const tableEl = document.createElement("table");

    const stats = {};
    for (const aStat of pokemonResponse.stats) {
        switch(aStat.stat.name) {
            case "hp":
                stats.h = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
            case "attack":
                stats.a = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
            case "defense":
                stats.b = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
            case "special-attack":
                stats.c = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
            case "special-defense":
                stats.d = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
            case "speed":
                stats.s = {
                    value: aStat.base_stat,
                    effort: aStat.effort
                };
                break;
        }
    }

    const sumOfStats = Object.values(stats).map((s) => s.value).reduce((a, b) => a + b, 0);

    tableEl.innerHTML = `
        <thead>
            <tr>
                <th>체력</th>
                <th>공격</th>
                <th>방어</th>
                <th>특수공격</th>
                <th>특수방어</th>
                <th>스피드</th>
                <th>총합</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${stats.h.value}</td>
                <td>${stats.a.value}</td>
                <td>${stats.b.value}</td>
                <td>${stats.c.value}</td>
                <td>${stats.d.value}</td>
                <td>${stats.s.value}</td>
                <td>${sumOfStats}</td>
            </tr>
        </tbody>
    `;

    document.getElementById("pokemon-stats")
                .appendChild(tableEl);
};

const renderPokemon = (pokemonId) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`).
        then((r) => r.json()).
        then((data) => {
            const nameEl = document.getElementById("api-detail");
            const preEl = document.createElement("pre");
            preEl.innerText = JSON.stringify(data, null, 2);
            nameEl.appendChild(preEl);

            renderSprites(data);
            renderTypes(data);
            renderAbilities(data);
            renderStats(data);
        });

    fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`).
        then((r) => r.json()).
        then((data) => {
            renderName(data);
        });
};

console.log(window.location);
console.log(new URL(window.location));
console.log(new URL(window.location).searchParams);
console.log(new URL(window.location).searchParams.get('id'));

renderPokemon(new URL(window.location).searchParams.get('id'));
