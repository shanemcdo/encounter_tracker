import { createAsync, useSearchParams } from '@solidjs/router';
import { For, Show } from 'solid-js';
import CreatureDetail from '~/components/CreatureDetail';
import { getEncounter, getName, getParent } from '~/utils';
import Back from '~/components/Back';
import MaybeTitle from '~/components/MaybeTitle';

import styles from './encounter.module.css';

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	const name = () => getName(path());
	return (
		<main>
			<Back path={getParent(path())} />
			<br />
			<a href={`/edit/?path=${encodeURIComponent(path())}`}>Edit</a>
			<MaybeTitle text={name()} />
			<div class={styles.grid}>
				<For each={encounter()}>{ creature =>
					<CreatureDetail creature={creature} />
				}</For>
			</div>
		</main>
	);
}
