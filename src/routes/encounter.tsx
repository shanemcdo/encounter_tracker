import { createAsync, useSearchParams } from "@solidjs/router";
import { For, Show } from "solid-js";
import { readFile } from "fs/promises";
import CreatureDetail from "~/components/CreatureDetail";

import styles from "./encounter.module.css";

async function getEncounter(filename: string): Promise<Encounter> {
	"use server";
	try {
		const file = await readFile(filename, 'utf-8');
		return JSON.parse(file);
	} catch {
		return [];
	}
}

export default function Encounter() {
	const [searchParams, ] = useSearchParams()
	const encounter = createAsync(() => getEncounter(decodeURIComponent(searchParams.encounter as string)));
	return (
		<main>
			<Show when={searchParams.prev}>
				<a href={`../?path=${searchParams.prev as string}`}>Back</a>
			</Show>
			<div class={styles.grid}>
				<For each={encounter()}>{ creature =>
					<CreatureDetail creature={creature} />
				}</For>
			</div>
		</main>
	);
}
