import { createAsync } from "@solidjs/router";
import { glob } from "fs/promises";
import { createSignal, For, untrack } from "solid-js";

async function getFiles(cwd: string) {
	"use server";
	const result = [];
	for await(const file of glob('*.json', { cwd })) {
		result.push(file);
	}
	return result;
}

function getCwd() {
	"use server";
	return process.cwd();
}

export default function Home() {
	const [cwd, setCwd] = createSignal(getCwd());
	const files = createAsync(() => getFiles(cwd()));
	return (
		<main>
			<label for="cwd">Directory:</label>
			<input
				id="cwd"
				value={untrack(cwd)}
				onchange={event => {
					setCwd(event.currentTarget.value);
				}}
			/>
			<br />
			<For each={files()}>{ file =>
				<a href={`encounter/?encounter=${cwd()}/${file}`}>{file}</a>
			}</For>
		</main>
	);
}
