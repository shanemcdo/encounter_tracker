import { createAsync, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import CreatureDetail from "~/components/CreatureDetail";
import { getEncounter, getName, getParent } from "~/utils";
import Back from "~/components/Back";

import styles from "./encounter.module.css";

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	const name = () => searchParams.encounter && getName(searchParams.encounter as string);
	const parent = () => encodeURIComponent(getParent(path()));
	return (
		<main>
			<Back path={parent()} />
			<br />
			<a href={`/edit/?path=${searchParams.path}`}>Edit</a>
			<Show when={name()}>
				<Title>{name()}</Title>
				<h1 class={styles.title}>{name()}</h1>
			</Show>
			<div class={styles.grid}>
				<For each={encounter()}>{ creature =>
					<CreatureDetail creature={creature} />
				}</For>
			</div>
		</main>
	);
}
