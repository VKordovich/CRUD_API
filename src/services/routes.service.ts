import { RoutesInterface } from '../intefaces/routes.interface';
import { StorageInterface } from '../intefaces/storage.interface';
import { validate } from 'uuid';
import { UserInterface } from '../intefaces/user.interface';
import { UserModel } from '../model/user.model';

const USER_KEYS = ['username', 'age', 'hobbies'];

export class RoutesService implements RoutesInterface {
	constructor(private storageService: StorageInterface) {}

	getRoute<T>(method: string, req: any, res: any): void {
		this.checkUrl(req.url, res);
		switch (method) {
			case 'GET':
				this.getRequest(req.url, res);
				break;
			case 'POST':
				this.postRequest(req, res);
				break;
			case 'PUT':
				this.putRequest(req, res);
				break;
			case 'DELETE':
				this.deleteRequest(req.url, res);
				break;
		}
	}

	private getRequest(url: string, res: any): void {
		const urlWithId = url.startsWith('/api/users/');
		if (urlWithId) {
			this.getUserById(url, res);
			return;
		}
		this.storageService.getAllUsers().then((users) => {
			this.successResponse(users, res);
		});
	}
	private postRequest(req: any, res: any): void {
		const chunks: any = [];
		req.on('data', (chunk: any) => {
			chunks.push(chunk);
		});
		req.on('end', () => {
			const dataString = Buffer.concat(chunks).toString();
			const body = JSON.parse(dataString) as UserInterface;
			const isAccordUserModel = USER_KEYS.every((key) => Object.keys(body).includes(key));
			if (!isAccordUserModel) this.failedResponse(res);
			this.storageService
				.setData(new UserModel(body.username, body.age, body.hobbies))
				.then((user) => {
					res.statusCode = 201;
					res.end(user);
				});
		});
	}
	private getUserById(url: string, res: any): void {
		const id = this.getId(url);
		this.validateId(id, res);
		this.storageService.getUserById(id).then((user) => {
			user ? this.successResponse(user, res) : this.notFoundResponse(res);
		});
	}
	private putRequest(req: any, res: any): void {
		const id = this.getId(req.url);
		this.validateId(id, res);
		const chunks: any = [];
		req.on('data', (chunk: any) => {
			chunks.push(chunk);
		});
		req.on('end', () => {
			const dataString = Buffer.concat(chunks).toString();
			const body = JSON.parse(dataString) as UserInterface;
			const isAccordUserModel = USER_KEYS.every((key) => Object.keys(body).includes(key));
			if (!isAccordUserModel) this.failedResponse(res);
			this.storageService.updateData(id, body).then((user) => {
				user ? this.successResponse(user, res) : this.notFoundResponse(res);
			});
		});
	}
	private deleteRequest(url: string, res: any): void {
		const id = this.getId(url);
		this.validateId(id, res);
		this.storageService.deleteData(id).then((isDelete) => {
			isDelete ? this.deleteResponse(res) : this.notFoundResponse(res);
		});
	}

	private getId(url: string): string {
		return String(url.substring(url.lastIndexOf('/') + 1));
	}

	private successResponse(data: any, res: any): void {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(data);
	}

	private validateId(id: string, res: any): void {
		if (validate(id)) return;
		this.failedResponse(res);
	}

	private failedResponse(res: any): void {
		res.statusCode = 400;
		res.end('Failed operation');
	}

	private notFoundResponse(res: any): void {
		res.statusCode = 404;
		res.end('User not found');
	}

	private deleteResponse(res: any): void {
		res.statusCode = 204;
		res.end();
	}

	private checkUrl(url: string, res: any): void {
		if (url.startsWith('/api/users')) return;
		res.statusCode = 404;
		res.end('Wrong URL');
	}
}
