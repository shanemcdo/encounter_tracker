import { createAsync, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { readFile } from "fs/promises";
import CreatureDetail from "~/components/CreatureDetail";
import { getParent } from "~/utils";
import Back from "~/components/Back";

import styles from "./encounter.module.css";

const API_URL = 'https://www.dnd5eapi.co/api/2014/monsters/';
const REFERENCE_URL = 'https://5thsrd.org/gamemaster_rules/monsters/';

function getIndexFromName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '-')
}

function getReferencePageByName(name: string) {
	return name.toLocaleLowerCase().replace(' ', '_')
}

const fetched: Record<string, any> = {};
async function memoFetch(url: string) {
	if(url in fetched) {
		return fetched[url];
	}
	const res = await fetch(url);
	if(!res.ok) {
		return [false, null];
	}
	const json = await res.json();
	fetched[url] = [true, json];
	return fetched[url];
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
					const [ok, json] = await memoFetch(`${API_URL}${index}`);
					if(!ok) continue;
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
	const path = () => decodeURIComponent(searchParams.path as string);
	const encounter = createAsync(() => getEncounter(path()));
	const name = () => {
		if(typeof searchParams.encounter !== 'string') {
			return null;
		}
		return searchParams.encounter.split('/').at(-1)?.split('.')[0];
	}
	const parent = () => encodeURIComponent(getParent(path()));
	return (
		<main>
			<Back path={parent()} />
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
