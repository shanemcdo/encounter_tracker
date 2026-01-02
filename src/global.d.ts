/// <reference types="@solidjs/start/env" />

interface CreatureBlueprint {
	name: string,
	max_hp: number,
	hp?: number,
	href?: string,
	api_index?: string,
}

type CreaturePartial = Partial<CreatureBlueprint>;

type CreatureInstance = CreatureBlueprint & {
	hp: number,
}

interface Encounter {
	creatures: CreatureBlueprint[];
	notes: string,
}
