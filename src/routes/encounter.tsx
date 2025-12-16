import { createAsync, useSearchParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { For, Show } from "solid-js";
import { readFile } from "fs/promises";

import styles from "./encounter.module.css";

async function getEncounter(filename: string): Promise<Encounter> {
	"use server";
	try {
		const file = await readFile(filename, 'utf-8');
		return JSON.parse(file);
	} catch {
		return [];
	}
}

function Creature(props: {
	creature: CreatureBlueprint
}) {
	const [creature, setCreature] = createStore<CreatureInstance>({
		hp: props.creature.max_hp,
		...props.creature
	});
	let numberInput!: HTMLInputElement;
	return <>
		<span>{creature.name}</span>
		<span>{creature.hp}/{creature.max_hp}</span>
		<input type="number" ref={numberInput} value={0} />
		<input
			type="button" 
			value="Damage"
			onclick={() => setCreature('hp', value => value - numberInput.valueAsNumber)}
		/>
		<input
			type="button" 
			value="heal"
			onclick={() => setCreature('hp', value => value + numberInput.valueAsNumber)}
		/>
	</>;
}

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const encounter = createAsync(() => getEncounter(decodeURIComponent(searchParams.encounter as string)));
	return (
		<main>
			<Show when={searchParams.prev}>
				<a href={`../?path=${searchParams.prev as string}`}>Back</a>
			</Show>
			<div class={styles.grid}>
				<For each={encounter()}>{ creature =>
					<Creature creature={creature} />
				}</For>
			</div>
		</main>
	);
}
