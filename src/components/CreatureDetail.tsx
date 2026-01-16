import { createStore } from 'solid-js/store';
import MaybeA from './MaybeA';

import styles from './CreatureDetail.module.css';

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
				target='_blank'
			>{creature.name}</MaybeA>
		</span>
		<span
			classList={{
				[styles.dead]: creature.hp <= 0,
			}}
		>{creature.hp}/{creature.max_hp}</span>
		<input
			class={styles.input}
			type='number'
			ref={numberInput}
			value={0}
		/>
		<input
			class={styles.input}
			type='button'
			value='Damage'
			onclick={() => setCreature('hp', value => value - numberInput.valueAsNumber)}
		/>
		<input
			class={styles.input}
			type='button'
			value='heal'
			onclick={() => setCreature('hp', value => value + numberInput.valueAsNumber)}
		/>
		<select value=' '>
			<option value=' '> </option>
			<option value='Blinded'>Blinded</option>
			<option value='Charmed'>Charmed</option>
			<option value='Deafened'>Deafened</option>
			<option value='Frightened'>Frightened</option>
			<option value='Grappled'>Grappled</option>
			<option value='Incapacitated'>Incapacitated</option>
			<option value='Invisible'>Invisible</option>
			<option value='Paralyzed'>Paralyzed</option>
			<option value='Petrified'>Petrified</option>
			<option value='Poisoned'>Poisoned</option>
			<option value='Prone'>Prone</option>
			<option value='Restrained'>Restrained</option>
			<option value='Stunned'>Stunned</option>
			<option value='Unconscious'>Unconscious</option>
			<option value='Exhaustion'>Exhaustion</option>
		</select>
	</>;
}

