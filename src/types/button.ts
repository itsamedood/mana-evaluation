import { ButtonInteraction } from "discord.js";
import Bot from "../bot";

export interface ButtonArgs {
	customId: string;
}

export default abstract class Button {
	private _customId: string;

	constructor(args: ButtonArgs) { this._customId = args.customId; }

	get customId(): string { return this._customId; }

	public abstract execute(interaction: ButtonInteraction, client: Bot): any;
}
