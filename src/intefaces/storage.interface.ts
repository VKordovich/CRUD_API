import { UserInterface } from './user.interface';

export interface StorageInterface {
	getAllUsers: () => Promise<string>;
	getUserById: (id: string) => Promise<string | null>;
	setData: (
		body: UserInterface,
		userFn?: (data: string, body: UserInterface) => UserInterface[],
	) => Promise<string>;
	updateData: (id: string, body: UserInterface) => Promise<string | null>;
	deleteData: (id: string) => Promise<string | null>;
}
