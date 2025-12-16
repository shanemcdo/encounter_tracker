import { createAsync, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { readFile } from "fs/promises";
import CreatureDetail from "~/components/CreatureDetail";

import styles from "./encounter.module.css";

const API_URL = 'https://www.dnd5eapi.co/api/2014/monsters/';
const REFERENCE_URL = 'https://5thsrd.org/gamemaster_rules/monsters/';

function getIndexFromName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '-')
}

function getReferencePageByName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '_')
}

async function getEncounter(filename: string): Promise<Encounter> {
	"use server";
	try {
		const file = await readFile(filename, 'utf-8');
		const encounters = JSON.parse(file);
		if(Array.isArray(encounters)) {
			for(const obj of encounters) {
				const index = obj.api_index ?? getIndexFromName(obj.name ?? '');
				if(index) {
					const res = await fetch(`${API_URL}${index}`);
					if(!res.ok) continue;
					const json = await res.json();
					if(obj.name === undefined) obj.name = json.name;
					if(obj.max_hp === undefined) obj.max_hp = json.hit_points;
					if(obj.href === undefined) obj.href = `${REFERENCE_URL}${getReferencePageByName(json.name)}`;
				}
			}
		}
		return encounters;
	} catch(e) {
		console.error(e)
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
		return searchParams.encounter.split('/').at(-1)?.split('.')[0];
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
