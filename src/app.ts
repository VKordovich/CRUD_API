import * as http from 'http';
import { Server } from 'http';
import { ConfigInterface } from './intefaces/config.interface';
import { RoutesInterface } from './intefaces/routes.interface';

export class App {
	private readonly port: number;
	private readonly server: Server<any, any>;

	constructor(private configService: ConfigInterface, private routeService: RoutesInterface) {
		this.port = configService.get<number>('PORT');
		this.server = http.createServer((req, res) => {
			const method = req.method;
			routeService.getRoute(method, req, res);
			process.on('uncaughtException', () => {
				res.statusCode = 500;
				res.end('Server Error');
			});
		});
	}

	init(): void {
		this.server.listen(this.port, () => {
			console.log('server was started', this.port);
		});
	}
}
