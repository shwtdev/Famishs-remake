const { spawn } = require("child_process");

console.log("New meta")
//spawn("node", ["game-client/app.js"], { stdio: "inherit" });
spawn("node", ["game-server/compiled/server.js"], { stdio: "inherit" });
