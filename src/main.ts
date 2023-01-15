import { App } from './app';
import { ConfigService } from './services/config.service';
import { RoutesService } from './services/routes.service';
import { StorageService } from './services/storage.service';

function bootstrap(): void {
	const app = new App(new ConfigService(), new RoutesService(new StorageService()));
	app.init();
}

bootstrap();
