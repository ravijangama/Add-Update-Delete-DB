const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;
const initializeDbAndServer = async () => {
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  app.listen(3000, () => {
    console.log("Server Is Starting at 3000");
  });
};
initializeDbAndServer();
//Get All Players API
app.get("/players/", async (request, response) => {
  const getPlayers = `SELECT * FROM cricket_team;`;
  const playersList = await db.all(getPlayers);
  const players = (playersList) => {
    return {
      playerId: playersList.player_id,
      playerName: playersList.player_name,
      jerseyNumber: playersList.jersey_number,
      role: playersList.role,
    };
  };
  response.send(playersList.map((eachPlayer) => players(eachPlayer)));
});
//Add New Player API
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const addPlayer = `INSERT INTO cricket_team (player_name,jersey_number,role)
  VALUES(
      "${playerName}",${jerseyNumber},"${role}"
  );`;
  await db.run(addPlayer);
  response.send("Player Added to Team");
});
//Get Player API
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `SELECT * FROM cricket_team WHERE player_id=${playerId};`;
  const player = await db.get(getPlayer);
  const playerDetails = (player) => {
    return {
      playerId: player.player_id,
      playerName: player.player_name,
      jerseyNumber: player.jersey_number,
      role: player.role,
    };
  };
  response.send(playerDetails(player));
});
//Update Player API
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayer = `UPDATE cricket_team SET player_name="${playerName}",jersey_number=${jerseyNumber},role="${role}" WHERE player_id=${playerId};`;
  await db.run(updatePlayer);
  response.send("Player Details Updated");
});
//Delete Player API
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const delPlayer = `DELETE FROM cricket_team WHERE player_id=${playerId};`;
  await db.run(delPlayer);
  response.send("Player Removed");
});
module.exports = app;
