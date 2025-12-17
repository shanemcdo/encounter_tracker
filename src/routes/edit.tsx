import { createAsync, useSearchParams } from '@solidjs/router';
import { createStore } from 'solid-js/store';
import { For, untrack, createSignal, createEffect } from 'solid-js';
import { getParent, getEncounter, getName, writeJSON, deleteFile, getIndexFromName, getReferenceURL, fetchMonsterAPI } from '~/utils';
import Back from '~/components/Back';

import styles from './edit.module.css';

export default function Edit() {
	const [searchParams,] = useSearchParams();
	const path = () => decodeURIComponent(searchParams.path as string);
	const [name, setName] = createSignal(getName(path()));
	const newFilePath = () => `${getParent(path())}/${name()}.json`;
	const [creatures, setCreatures] = createStore<CreaturePartial[]>([]);
	const encounter = createAsync(() => getEncounter(path()));

	createEffect(() => {
		setCreatures(encounter() ?? []);
	})

	return (
		<main>
			<Back path={path() && getParent(path()!)} />
			<br />
			<a href={`/encounter/?path=${encodeURIComponent(newFilePath())}`}>Play</a>
			<br />
			<input
				type='text'
				value={untrack(name)}
				onchange={event =>{
					setName(event.currentTarget.value);
				}}
			/>
			<input
				type='button'
				value='Save'
				onclick={async () => {
					await writeJSON(newFilePath(), creatures);
				}}
			/>
			<input
				type='button'
				value='Delete'
				onclick={async () => {
					await deleteFile(newFilePath());
				}}
			/>
			<h2>Creatures</h2>
			<div class={styles.grid}>
				<label>ID</label>
				<label>Name</label>
				<label>Max HP</label>
				<label>HP</label>
				<label>href</label>
				<label>API Index</label>
				<label class={styles.last_label}>Buttons</label>
				<For each={creatures}>{ (creature, i) => {
					let fetchButton!: HTMLInputElement;
					return <>
						<span>{i() + 1}</span>
						<input
							type='text'
							value={creature.name ?? ''}
							onchange={event => {
								setCreatures(i(), 'name', event.currentTarget.value);
							}}
						/>
						<input
							type='number'
							value={creature.max_hp}
							onchange={event => {
								setCreatures(i(), 'max_hp', event.currentTarget.valueAsNumber);
							}}
						/>
						<input
							type='number'
							value={creature.hp}
							onchange={event => {
								setCreatures(i(), 'hp', event.currentTarget.valueAsNumber);
							}}
						/>
						<input
							type='text'
							value={creature.href ?? ''}
							onchange={event => {
								setCreatures(i(), 'href', event.currentTarget.value);
							}}
						/>
						<input
							type='text'
							value={creature.api_index ?? ''}
							onchange={event => {
								setCreatures(i(), 'api_index', event.currentTarget.value);
							}}
						/>
						<input
							type='button'
							value='fetch'
							ref={fetchButton}
							onclick={async () => {
								if(
									(creature.name ?? '') === ''
									&& (creature.api_index ?? '') === ''
								) return;

								if((creature.api_index ?? '') === '') {
									setCreatures(i(), 'api_index', getIndexFromName(creature.name!));
								}
								const [ok, json] = await fetchMonsterAPI(creature.api_index!);
								if(ok) {
									if((creature.name ?? '') === '') setCreatures(i(), 'name', json.name);
									if((creature.max_hp ?? 0) === 0) setCreatures(i(), 'max_hp', json.hit_points);
								}

								if(
									(creature.href ?? '') === ''
									&& (creature.name ?? '') !== ''
								) {
									setCreatures(i(), 'href', getReferenceURL(creature.name!));
								}
							}}
						/>
						<input
							type='button'
							value='duplicate'
							ref={fetchButton}
							onclick={() => {
								setCreatures(creatures.length, { ...creature });
							}}
						/>
						<input
							type='button'
							value='Delete'
							ref={fetchButton}
							onclick={() => {
								setCreatures([...creatures.slice(0, i()), ...creatures.slice(i() + 1, creatures.length)]);
							}}
						/>
					</>;
				}}</For>
			</div>
			<input
				type='button'
				value='New Creature'
				onclick={() => {
					setCreatures(creatures.length, { });
				}}
			/>
		</main>
	);
}
