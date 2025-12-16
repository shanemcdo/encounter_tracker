export default function Home() {
	return (
		<main>
			<form
				action="/encounter"
				method="get"
			>
				<label for="encounter">Encounter:</label>
				<input
					type="file"
					id="encounter"
					name="encounter"
					accept=".json"
				/>
				<button type="submit">Submit</button>
			</form>
		</main>
	); }
