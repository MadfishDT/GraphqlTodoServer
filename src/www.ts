import 'source-map-support/register'; // source-map을 사용하기 위해 추가함.
import App from './app';
import * as cluster from 'cluster';
import * as os from 'os';
import * as SE from './environment';

if(process.argv[2] == 'prod' || process.argv[2] == 'live') {
    if (cluster.isMaster) {
        console.log('this is master process');
        let cpuCount = os.cpus.length;
        console.log(cpuCount);
        if(cpuCount < 2) {
            cpuCount = 2;
        }
        for (let i = 0; i < cpuCount; i += 1) {
            cluster.fork();
        }
        cluster.on('exit', (worker ,code, signal) => {
            // Replace the terminated workers
            console.log('Worker ' + worker.id + ' died :(');
            console.log(`worker ${worker.process.pid} died`);
            cluster.fork();
        });
    } else {
        //console.log(`worker ${cluster.worker.process.pid}`);
        const app = new App();
        app.initialize();
    }
} else {
    const app = new App();
    app.initialize();
}

