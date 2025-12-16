import { createAsync, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
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
	const name = () => {
		if(typeof searchParams.encounter !== 'string') {
			return null;
		}
		const result = searchParams.encounter.split('/').at(-1);
		return result;
	}
	return (
		<main>
			<Show when={searchParams.prev}>
				<a href={`../?path=${searchParams.prev as string}`}>Back</a>
			</Show>
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
