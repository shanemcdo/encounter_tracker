/// <reference types="@solidjs/start/env" />

interface CreatureBlueprint {
	name: string,
	max_hp: number,
	hp?: number,
}

type CreatureInstance = CreatureBlueprint & {
	hp: number,
}

type Encounter = CreatureBlueprint[];
