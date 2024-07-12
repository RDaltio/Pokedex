const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const pokemonModal = document.getElementById('pokemonModal');
const closeButton = document.querySelector('.close-button');
const modalBody = document.querySelector('.modal-body');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function openModal(pokemon) {
  const statsHtml = pokemon.stats.map(stat => {
    return `<p>${stat.name}: ${stat.base_stat}</p>`;
  }).join('');

  const typeBackground = pokemon.types[0].toLowerCase();

  const modalContent = document.querySelector('.modal-content');
  modalContent.style.backgroundColor = `var(--${typeBackground})`;

  modalBody.innerHTML = `
    <div class="modal-content-inner">
      <h2>${pokemon.name}</h2>
      <img src="${pokemon.photo}" alt="${pokemon.name}">
    </div>
    <div class="pokemon-details-card">
      <div class="pokemon-info">
        <p>Number: #${pokemon.number}</p>
        <p>Type: ${pokemon.types.join(', ')}</p>
        <p>Weight: ${pokemon.weight} kg</p>
        <p class="no-capitalize">Height: ${pokemon.height} m</p>
        <p>Abilities: ${pokemon.abilities.join(', ')}</p>
      </div>
      <div class="stats-container">
        ${statsHtml} <!-- Adiciona os stats aqui -->
      </div>
    </div>
  `;

  pokemonModal.style.display = 'block';
}

closeButton.addEventListener('click', () => {
  pokemonModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === pokemonModal) {
    pokemonModal.style.display = 'none';
  }
});

function addClickEventToPokemon(pokemonElement, pokemon) {
  pokemonElement.addEventListener('click', () => openModal(pokemon));
}

function loadPokemonItems(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    pokemons.forEach((pokemon) => {
      const listItem = document.createElement('li');
      listItem.className = `pokemon ${pokemon.type}`;
      listItem.innerHTML = `
        <span class="number">#${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>
        <div class="detail">
          <ol class="types">
            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
          </ol>
          <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
      `;
      addClickEventToPokemon(listItem, pokemon);
      pokemonList.appendChild(listItem);
    });
  });
}

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
  offset += limit;

  const qtdRecordNextPage = offset + limit;

  if (qtdRecordNextPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItems(offset, newLimit);
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItems(offset, limit);
  }
});