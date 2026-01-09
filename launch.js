const { spawn } = require("child_process");

//spawn("node", ["game-client/app.js"], { stdio: "inherit" });
spawn("node", ["game-server/compiled/server.js"], { stdio: "inherit" });
