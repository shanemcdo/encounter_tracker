import { action, createAsync, useAction, useSearchParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { For, Show, untrack, createSignal, createEffect } from "solid-js";
import { getParent, getEncounter, getName } from "~/utils";
import Back from "~/components/Back";

import styles from './new.module.css';

const writeJSONAction = action(async (filepath: string, data: any) => {
	await fetch('/api/save-json', {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ 
			filepath,
			data,
		}),
	});
}, "writeJSON");

export default function New() {
	const [searchParams,] = useSearchParams();
	const path = () => decodeURIComponent(searchParams.path as string);
	const [name, setName] = createSignal(getName(path()));
	const writeJSON = useAction(writeJSONAction);
	const [creatures, setCreatures] = createStore<CreatureBlueprint[]>([]);
	const encounter = createAsync(() => getEncounter(path()));

	createEffect(() => {
		setCreatures(encounter() ?? []);
	})

	return (
		<main class={styles.new}>
			<Back path={path() && getParent(path()!)} />
			<br />
			<a href={`/encounter/?path=${searchParams.path}`}>Play</a>
			<br />
			<input
				type="text"
				value={untrack(name)}
				onchange={event =>{
					setName(event.currentTarget.value);
				}}
			/>
			<input
				type="button"
				value="Save"
				onclick={async () => {
					await writeJSON(`${getParent(path())}/${name()}.json`, creatures);
				}}
			/>
			<h2>Creatures</h2>
			<ul>
				<For each={creatures}>{ (creature, i) =>
					<>
						<input
							type="text"
							value={creature.name}
							onchange={event => {
								setCreatures(i(), 'name', event.currentTarget.value);
							}}
						/>
					</>
				}</For>
				<input
					type="button"
					value="New Creature"
					onclick={() => {
						setCreatures(creatures.length, { 'name': '' });
					}}
				/>
			</ul>
		</main>
	);
}
