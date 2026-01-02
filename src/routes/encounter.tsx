import { createAsync, useSearchParams } from '@solidjs/router';
import { For } from 'solid-js';
import { getEncounter } from '~/utils';
import CreatureDetail from '~/components/CreatureDetail';
import Header from '~/components/Header';
import Notes from '~/components/Notes';
import Initiative from '~/components/Initiative';

import styles from './encounter.module.css';

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	const creatures = () => {
		const enc = encounter();
		if(enc === undefined) return undefined;
		const names: Record<string, number> = {};
		return enc.creatures.map(obj => {
			if(obj.name in names) {
				obj.name = `${obj.name} ${++names[obj.name]}`;
			} else {
				names[obj.name] = 1;
			}
			return obj;
		});
	};

	return (
		<main class={styles.encounter}>
			<Header
				path={path()}
				links={[
					{ path: 'edit', name: 'Edit' },
				]}
			/>
			<div class={styles.row}>
				<div class={styles.grid}>
					<h2>Creatures</h2>
					<For each={creatures()}>{ creature =>
						<CreatureDetail creature={creature} />
					}</For>
				</div>
				<Initiative creatures={creatures()!} />
			</div>
			<Notes value={encounter()?.notes} />
		</main>
	);
}
