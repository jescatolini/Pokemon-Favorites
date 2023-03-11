export class PokeApi{
  static search(pokemon) {
    const finalpoint = `https://pokeapi.co/api/v2/pokemon/${pokemon}`

    return fetch(finalpoint)
    .then(data => data.json()).
    then(data => ({
      abilities: data.abilities[0].ability.name,
      base_experience: data.base_experience,
      name: data.name,
      sprite: data.sprites.other.home.front_default,
      type: data.types[0].type.name
    }))
  }
}