import { createAsync } from "@solidjs/router";
import { For } from "solid-js";
import { readFile } from "fs/promises";
import Creature from "~/components/Creature";

async function getEncounter(): Promise<Encounter> {
	"use server";
	const file = await readFile('example.json', 'utf-8');
	return JSON.parse(file);
}

export default function Home() {
	const encounter = createAsync(getEncounter);
	return (
		<main>
			<For each={encounter()}>{ creature =>
				<Creature creature={creature} />
			}</For>
		</main>
	); }
