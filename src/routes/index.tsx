import { createAsync } from "@solidjs/router";
import { For } from "solid-js";
import { readFile } from "fs/promises";
import Creature from "~/components/Creature";

async function getEncounter(filename: string): Promise<Encounter> {
	"use server";
	const file = await readFile(filename, 'utf-8');
	return JSON.parse(file);
}

export default function Home() {
	const encounter = createAsync(() => getEncounter('example.json'));
	return (
		<main>
			<For each={encounter()}>{ creature =>
				<Creature creature={creature} />
			}</For>
		</main>
	); }
