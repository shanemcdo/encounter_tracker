import { createAsync, useSearchParams } from "@solidjs/router";
import { For } from "solid-js";
import { readFile } from "fs/promises";
import Creature from "~/components/Creature";

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
	const [searchParams, setSearchParams] = useSearchParams()
	const encounter = createAsync(() => getEncounter(searchParams.encounter));
	return (
		<main>
			<For each={encounter()}>{ creature =>
				<Creature creature={creature} />
			}</For>
		</main>
	); }
