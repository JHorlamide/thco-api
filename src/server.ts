import http from "http";

/* Application Module */ 
import { app, routes, port } from "./config/app";
import { CommonRoutesConfig } from "./common/commonRouteConfig";
import { onError } from "./config/requestLogger";
import config from "./config/appConfig";
import DBConnectWithRetry from "./config/database";

export function createServer(): http.Server {
  app.set("port", port);

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Server listening on ${bind}... 🚀`);

    if (process.env.NODE_ENV !== "test") {
      routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for -> ${route.getName()}`);
      });
    }
  });

  return server;
}

export default async function main(): Promise<http.Server> {
  await DBConnectWithRetry();
  return createServer();
}

if (config.node_env !== "test") {
  main().catch((error) => onError(error));
}
