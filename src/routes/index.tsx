import { createAsync, useSearchParams } from "@solidjs/router";
import { glob, readdir } from "fs/promises";
import { For, Show } from "solid-js";
import { homedir } from "os";

import styles from './index.module.css';

// https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
async function getDirs(cwd: string) {
	"use server";
	return (await readdir(cwd, { withFileTypes: true }))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name);
}

async function getFiles(cwd: string) {
	"use server";
	const result = [];
	for await(const file of glob('*.json', { cwd })) {
		result.push(file);
	}
	return result;
}

async function getHomedir() {
	"use server";
	return homedir();
}

export default function Home() {
	const [searchParams,] = useSearchParams();
	const home = createAsync(getHomedir);
	const path = () => (
		(searchParams.path ? decodeURIComponent(searchParams.path as string) : null )
		?? home()
		?? "/"
	) as string;
	const files = createAsync(() => getFiles(path()));
	const dirs = createAsync(() => getDirs(path()));
	return (
		<main class={styles.explorer}>
			<Show when={searchParams.prev}>
				<a href={`/?path=${decodeURIComponent(searchParams.prev as string)}`}>Back</a>
			</Show>
			<h1>{path()}</h1>
			<h2>Directories</h2>
			<ul>
				<For each={dirs()}>{ dir =>
					<li>
						<a
							href={`./?path=${encodeURIComponent(path())}/${encodeURIComponent(dir)}&prev=${encodeURIComponent(path())}`}
						>{dir}</a>
					</li>
				}</For>
			</ul>
			<h2>JSON Files</h2>
			<ul>
				<For each={files()}>{ file =>
					<li>
						<a
							href={`encounter/?encounter=${encodeURIComponent(path())}/${encodeURIComponent(file)}&prev=${encodeURIComponent(path())}`}
						>{file}</a>
					</li>
				}</For>
			</ul>
		</main>
	);
}
