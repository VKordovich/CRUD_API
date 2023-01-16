import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { ConfigInterface } from '../intefaces/config.interface';

export class ConfigService implements ConfigInterface {
	private readonly configRes: DotenvParseOutput = {};
	addPort: number;
	constructor(addPort?: number) {
		const configOutput: DotenvConfigOutput = config();
		this.configRes = configOutput.parsed as DotenvParseOutput;
		this.addPort = addPort ?? 0;
	}
	get<T>(key: string): T {
		return +this.configRes[key] + this.addPort as T;
	}
}
