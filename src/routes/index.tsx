import { For } from "solid-js";
import { readFileSync } from "fs";
import Creature from "~/components/Creature";

function getEncounter(): Encounter {
	"use server";
	return [
		{
			name: "Ghost Pirate",
			max_hp: 50
		},
		{
			name: "Vampire Spawn",
			max_hp: 70
		}
	];
	const file = readFileSync('example.json', 'utf-8');
	return JSON.parse(file);
}

export default function Home() {
	const encounter = getEncounter();
	return (
		<main>
			<For each={encounter}>{ creature =>
				<Creature creature={creature} />
			}</For>
		</main>
	); }
