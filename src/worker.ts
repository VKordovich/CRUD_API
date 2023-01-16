import { App } from "./app";
import { ConfigService } from "./services/config.service";
import { RoutesService } from "./services/routes.service";
import { StorageService } from "./services/storage.service";


export class WorkerCsm {
  portAdd: number;
  constructor () {
    this.portAdd = Number(process.env.id)
    this.webserver()
  }

  webserver () {
    const app = new App(new ConfigService(this.portAdd), new RoutesService(new StorageService()));
    app.init();
  }
}
