import { StorageInterface } from '../intefaces/storage.interface';
import * as fs from 'fs';
import path from 'path';
import { UserInterface } from '../intefaces/user.interface';

export class StorageService implements StorageInterface {
	private readonly fileName = 'bd.json';
	private readonly pathToBD: string;
	constructor() {
		this.pathToBD = path.join(process.cwd(), this.fileName);
	}

	get writeStream(): any {
		return fs.createWriteStream(this.pathToBD, {
			flags: 'r+',
		});
	}

	get readStream(): any {
		return fs.createReadStream(this.pathToBD, {
			flags: 'r',
		});
	}

	getAllUsers(): Promise<string> {
		return new Promise((resolve) => {
			let isEmptyFile = true;
			const readStream = this.readStream;
			readStream.on('data', (chunk: { toString: () => any }) => {
				isEmptyFile = false;
				const users = JSON.stringify(chunk.toString());
				resolve(JSON.parse(users));
			});
			readStream.on('end', () => {
				const emptyUsers = JSON.stringify('[]');
				if (isEmptyFile) resolve(JSON.parse(emptyUsers));
			});
		});
	}

	getUserById(id: string): Promise<string | null> {
		return this.getAllUsers().then((data) => {
			const users = JSON.parse(data) as UserInterface[];
			const user = users.find((user) => user.id === id) ?? null;
			return user ? JSON.stringify(user) : user;
		});
	}

	setData(body: UserInterface, userFn = this.addNewUser): Promise<string> {
		const writeStream = this.writeStream;
		return this.getAllUsers().then((data) => {
			const users = userFn(data, body);
			fs.truncate(this.pathToBD, 0, () => {
				writeStream.write(JSON.stringify(users), 'utf8');
			});
			return JSON.stringify(body);
		});
	}

	updateData(id: string, body: UserInterface): Promise<string | null> {
		return this.getUserById(id)
			.then((data) => {
				if (!data) return null;
				return { ...(JSON.parse(data) as UserInterface), ...body };
			})
			.then((user) => {
				if (!user) return user;
				return this.setData(user, this.updateUser);
			});
	}

	deleteData(id: string): Promise<string | null> {
		return this.getUserById(id).then((user) => {
			if (!user) return user;
			return this.setData(JSON.parse(user) as UserInterface, this.deleteUser);
		});
	}

	private addNewUser(data: string, body: UserInterface): UserInterface[] {
		const users = JSON.parse(data) as UserInterface[];
		users.push(body);
		return users;
	}

	private updateUser(data: string, body: UserInterface): UserInterface[] {
		const users = JSON.parse(data) as UserInterface[];
		return users.map((user) => {
			return user.id === body.id ? body : user;
		});
	}

	private deleteUser(data: string, body: UserInterface): UserInterface[] {
		const users = JSON.parse(data) as UserInterface[];
		console.log(
			'deleteUser',
			users.filter((user) => user.id !== body.id),
		);
		return users.filter((user) => user.id !== body.id);
	}
}
