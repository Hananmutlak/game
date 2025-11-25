// نموذج بسيط للبيانات (بدون قاعدة بيانات)
let games = [
  {
    id: 1,
    title: "The Legend of Zelda: Breath of the Wild",
    platform: "Nintendo Switch",
    release_year: 2017,
    price: 59.99,
    completed: true,
    playtime_hours: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Elden Ring",
    platform: "PlayStation 5",
    release_year: 2022,
    price: 69.99,
    completed: false,
    playtime_hours: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let nextId = 3;

class Game {
  static findAll() {
    return games;
  }

  static findById(id) {
    return games.find(game => game.id === parseInt(id));
  }

  static create(gameData) {
    const newGame = {
      id: nextId++,
      ...gameData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    games.push(newGame);
    return newGame;
  }

  static update(id, gameData) {
    const index = games.findIndex(game => game.id === parseInt(id));
    if (index === -1) return null;

    games[index] = {
      ...games[index],
      ...gameData,
      updatedAt: new Date().toISOString()
    };

    return games[index];
  }

  static delete(id) {
    const index = games.findIndex(game => game.id === parseInt(id));
    if (index === -1) return false;

    games.splice(index, 1);
    return true;
  }
}

module.exports = Game;