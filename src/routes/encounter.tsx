import { createAsync, useSearchParams } from '@solidjs/router';
import { For } from 'solid-js';
import { getEncounter } from '~/utils';
import CreatureDetail from '~/components/CreatureDetail';
import Header from '~/components/Header';
import Initiative from '~/components/Initiative';

import styles from './encounter.module.css';

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	const uniqueNamedEncounter = () => {
		const names: Record<string, number> = {};
		return encounter()?.map(obj => {
			if(obj.name in names) {
				obj.name = `${obj.name} ${++names[obj.name]}`;
			} else {
				names[obj.name] = 1;
			}
			return obj;
		})
	};

	return (
		<main>
			<Header
				path={path()}
				links={[
					{ path: 'edit', name: 'Edit' },
				]}
			/>
			<div class={styles.container}>
				<div class={styles.grid}>
					<For each={uniqueNamedEncounter()}>{ creature =>
						<CreatureDetail creature={creature} />
					}</For>
				</div>
				<Initiative encounter={uniqueNamedEncounter()!} />
			</div>
		</main>
	);
}
