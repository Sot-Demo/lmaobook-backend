if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const hapi = require("@hapi/hapi");
const { MongoClient } = require("mongodb"); 


const port = process.env.PORT;

const client = new MongoClient(process.env.MONGODB_CONNECTION);

async function run() {
  await client.connect();
  const db = client.db("lmaobook");
  const commentCollection = db.collection("comments");

  const server = hapi.server({
    port: port
  });

  server.route({
    path: "/comments",
    method: "GET",
    handler: async () => {
      const commentCursor = commentCollection.find({}).sort({timestamp: -1}).limit(20)
      const comments = await commentCursor.toArray();
      return comments;
    }
  });

  server.route({
    path: "/createComment",
    method: "POST",
    handler: async (request) => {
      const name = request.payload.name;
      const message = request.payload.message;

      if (typeof name !== "string" || typeof message !=="string") {
        return { success: false }
      }

      const comment = {
        name: name,
        message: message,
        timestamp: new Date().getTime()
      }

      await commentCollection.insertOne(comment);

      return { success: true };
    }
  });

  await server.start();
  console.log("Server running on port" + port);

}

run();