export class PokeApi {
  static search(pokemon) {
    const endpoint = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;

    return fetch(endpoint)
    .then(data => data.json())
    .then(data => ({
      name: data.name,
      sprite: data.sprites.other.home.front_default,
      type: data.types[0].type.name,
      ability: data.abilities[0].ability.name,
      base_experience: data.base_experience
    }))
  }
}