import * as os from "os";
import cluster, { Worker } from "cluster";
import { WorkerCsm } from "./worker";

class Cluster {
  cpus = os.cpus().length
  worker?: Worker;
  constructor () {
    if (cluster.isMaster) {
      this.fork();
      this.checkWorker();
    }
    else {
      new WorkerCsm();
    }
  }

  fork () {
    for (let i = 0; i < this.cpus; i++) {
      this.worker = cluster.fork({id: i});
    }
  }

  private checkWorker() {
    cluster.on('exit', () => {
      cluster.fork();
    });
  }
}

new Cluster()