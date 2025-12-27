import { createAsync, useSearchParams } from '@solidjs/router';
import { For } from 'solid-js';
import CreatureDetail from '~/components/CreatureDetail';
import { getEncounter } from '~/utils';
import Header from '~/components/Header';

import styles from './encounter.module.css';

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	return (
		<main>
			<Header
				path={path()}
				links={[
					{ path: 'edit', name: 'Edit' },
				]}
			/>
			<div class={styles.grid}>
				<For each={encounter()}>{ creature =>
					<CreatureDetail creature={creature} />
				}</For>
			</div>
		</main>
	);
}
