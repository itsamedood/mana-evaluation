/**
 * Schema of the configuration options per server.
 */
export default interface ConfigData {
	guildId: string;
	awakenOdds: number;
	maxNationalLevels: number;
	manaRange: {
		min: number;
		max: number;
	};
	ranks: {
		e: { minMana: number };
		d: { minMana: number };
		c: { minMana: number };
		b: { minMana: number };
		a: { minMana: number };
		s: { minMana: number };
		n: { minMana: number };
	};
	modified: boolean;
}

/**
 * Default values. This gets written immediately when the bot joins a server.
 */
export const DEFAULT_CONFIG_DATA: ConfigData = {
	guildId: '',
	awakenOdds: 0.5, // %
	/**
	 * 0 means no National Level, since it's not technically an 'obtainable rank', rather just a title.
	 * -1 means infinite.
   */
	maxNationalLevels: 5,
	manaRange: {
		min: 10,
		max: 100000,
	},
	ranks: {
		e: { minMana: 10 },
		d: { minMana: 200 },
		c: { minMana: 600 },
		b: { minMana: 2000 },
		a: { minMana: 8000 },
		s: { minMana: 25000 },
		n: { minMana: 90000 }
	},
	modified: false
}
