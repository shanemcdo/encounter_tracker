import type { APIEvent } from "@solidjs/start/server";
import { writeFile } from "fs/promises";

export async function POST({ request }: APIEvent) {
	console.log('We got it');
	const json = await request.json();
	console.log(json);
	console.log(json.filepath)
	console.log(json.data)
	await writeFile(
		json.filepath,
		JSON.stringify(json.data),
		'utf-8'
	);
	return new Response('ok');
}
