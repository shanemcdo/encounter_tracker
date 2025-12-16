/// <reference types="@solidjs/start/env" />

interface CreatureBlueprint {
	name: string,
	max_hp: number,
	hp?: number,
	href?: string,
}

type CreatureInstance = CreatureBlueprint & {
	hp: number,
}

type Encounter = CreatureBlueprint[];
