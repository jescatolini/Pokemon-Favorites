import { PokeApi } from "./PokeApi.js";

// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries =
      JSON.parse(localStorage.getItem("@pokemon-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@pokemon-favorites:", JSON.stringify(this.entries));
  }

  async add(pokemon) {
    try {
      const pokeExists = this.entries.find((entry) => entry.name === pokemon);

      if (pokeExists) {
        throw new Error("Pokémon já cadastrado");
      }

      const poke = await PokeApi.search(pokemon);

      if (poke.name === undefined) {
        throw new Error("Pokémon não encontrado!");
      }

      this.entries = [poke, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(pokemon) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.name !== pokemon.name
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");

      this.add(value.toLowerCase());
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((pokemon) => {
      this.tbody.querySelectorAll(".oak").forEach((div) => {
        div.remove();
      });
      const row = this.createRowPokemon();

      row.querySelector(".pokemon img").src = pokemon.sprite;
      row.querySelector(".pokemon p").textContent = pokemon.name;
      row.querySelector(".type").textContent = pokemon.type;
      row.querySelector(".ability").textContent = pokemon.abilities;
      row.querySelector(".base_experience").textContent = pokemon.base_experience;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar esse Pokémon?");
        if (isOk) {
          this.delete(pokemon);
        }
      };

      this.tbody.append(row);
    });
  }
  createRowOak() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td colspan="5" class="oak">
      <div class="wrapper">
        <a href="#name"><h2>Would you like to register a Pokémon?</h2></a>
        <div class="back">
        <img src="./assets/pokeballback.png" alt="Pokeball behind teacher Oak">
        <img src="./assets/oak.png" alt="Teacher Oak">
        </div>
      </div>
    </td>
    `;

    return tr;
  }

  createRowPokemon() {
    const tr = document.createElement("tr");

    tr.classList.add("poke")
    tr.innerHTML = `
    <td class="pokemon">
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/25.png" alt="Pokémon">
    <p>Pikachu</p>
    </td>
    <td class="type">electric</td>
    <td class="ability">static</td>
    <td class="base_experience">112</td>
    <td><button class="remove"><img src="./assets/pokeball.png" alt="Pokeball to remove your's Pokémon"></button></td>
    `;

    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
    const oak = this.createRowOak();
    this.tbody.append(oak);
  }
}
