if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const hapi = require("@hapi/hapi");

const port = process.env.PORT;

async function run() {
  const server = hapi.server({
    port: port
  });

  server.route({
    path: "/",
    method: "GET",
    handler: () => {
      return { hello: "world"}
    }
  })

  await server.start();
  console.log("Server running on port" + port);

}

run();