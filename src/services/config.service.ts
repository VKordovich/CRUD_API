import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ConfigInterface } from '../intefaces/config.interface';

export class ConfigService implements ConfigInterface {
	private readonly configRes: DotenvParseOutput = {};
	constructor() {
		const configOutput: DotenvConfigOutput = config();
		this.configRes = configOutput.parsed as DotenvParseOutput;
	}
	get<T>(key: string): T {
		return this.configRes[key] as T;
	}
}
