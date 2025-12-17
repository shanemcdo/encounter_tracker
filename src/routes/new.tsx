import { action, useAction, useSearchParams } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { For, Show, untrack, createSignal } from "solid-js";
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

export default function Home() {
	const [searchParams,] = useSearchParams();
	const path = () => searchParams.path &&
		decodeURIComponent(searchParams.path as string)

	const [name, setName] = createSignal('untitled encounter');
	const [creatures, setCreatures] = createStore<CreatureBlueprint[]>([]);
	const writeJSON = useAction(writeJSONAction);

	return (
		<main class={styles.new}>
			<Back path={path()} />
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
					await writeJSON(`${path()}/${name()}.json`, creatures);
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
