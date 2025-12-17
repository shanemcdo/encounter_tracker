import { createStore } from 'solid-js/store';

import styles from './CreatureDetail.module.css';
import MaybeA from './MaybeA';

export default function CreatureDetail(props: {
	creature: CreatureBlueprint
}) {
	const [creature, setCreature] = createStore<CreatureInstance>({
		hp: props.creature.max_hp,
		...props.creature
	});
	let numberInput!: HTMLInputElement;
	return <>
		<span
			classList={{
				[styles.dead]: creature.hp <= 0,
			}}
		>
			<MaybeA
				href={creature.href}
				target="_blank"
			>{creature.name}</MaybeA>
		</span>
		<span
			classList={{
				[styles.dead]: creature.hp <= 0,
			}}
		>{creature.hp}/{creature.max_hp}</span>
		<input
			class={styles.input}
			type="number"
			ref={numberInput}
			value={0}
		/>
		<input
			class={styles.input}
			type="button" 
			value="Damage"
			onclick={() => setCreature('hp', value => value - numberInput.valueAsNumber)}
		/>
		<input
			class={styles.input}
			type="button" 
			value="heal"
			onclick={() => setCreature('hp', value => value + numberInput.valueAsNumber)}
		/>
	</>;
}

