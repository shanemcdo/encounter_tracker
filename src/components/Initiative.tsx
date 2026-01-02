import type { Signal } from 'solid-js';

import { createSignal, For, Show } from 'solid-js';
import { rollD20 } from '~/utils';

import styles from './Initiative.module.css';

type Player = {
	name: Signal<string>,
	initiative: Signal<number>
}

type Order = {
	name: string,
	initiative: number,
}[];

export default function Initiative(props: {
	creatures: CreatureBlueprint[],
}) {
	const [players, setPlayers] = createSignal<Player[]>([]);
	const [order, setOrder] = createSignal<Order>([]);
	const rollInitiative = () => {
		setOrder([
			...players().map(player => ({
				name: player.name[0](),
				initiative: player.initiative[0](),
			})),
			...props.creatures.map(creature => ({
				name: creature.name,
				initiative: rollD20(),
			})),
		].toSorted((a, b) => b.initiative - a.initiative));
	};

	const setup = <>
		<h3>Monsters</h3>
		<For each={props.creatures}>{ creature =>
			<>
				<span class={styles.wide}>{creature.name}</span>
			</>
		}</For>
		<h3>Players</h3>
		<For each={players()}>{ (player, i) => {
			const [name , setName] = player.name;
			const [initiative , setInitiative] = player.initiative;
			return <>
				<input
					value={name()}
					onchange={event => {
						setName(event.currentTarget.value);
					}}
				/>
				<input
					type='number'
					value={initiative()!}
					onchange={event => {
						setInitiative(event.currentTarget.valueAsNumber);
					}}
				/>
				<button
					onclick={() => {
						setPlayers(prev => [...prev.slice(0, i()), ...prev.slice(i() + 1, prev.length)]);
					}}
				>X</button>
			</>;
		}}</For>
		<button
			class={styles.wide}
			onclick={() =>{
				setPlayers(prev => [...prev, {
					name: createSignal('New Player'),
					initiative: createSignal(0),
				}]);
			}}
		>+</button>
		<button
			class={styles.wide}
			onclick={rollInitiative}
		>Roll Initiative</button>
	</>;

	return <div class={styles.initiative}>
		<h2>Initiative</h2>
		<Show
			when={order().length !== 0}
			fallback={setup}
		>
			<For each={order()}>{ (creature, i) =>  {
				return <>
					<span>{creature.name}</span>
					<span>{creature.initiative}</span>
					<button
						onclick={ () =>
							setOrder(prev => [
								...prev.slice(0, i()),
								...prev.slice(i() + 1, prev.length),
							])
						}
					>X</button>
				</>;
			}}</For>
			<button
				class={styles.wide}
				onclick={() => {
					setOrder([]);
				}}
			>Exit</button>
		</Show>
	</div>;
}
