import { For } from "solid-js";
import { getName, getParent } from "~/utils";
import Back from "~/components/Back";
import MaybeTitle from "~/components/MaybeTitle";

export default function Header(props: {
	path: string,
	links: {
		name: string,
		path: string,
	}[],
}) {
	return <>
		<Back path={getParent(props.path)} />
		<For each={props.links}>{ link =>
			<>
				<br />
				<a href={`/${link.path}/?path=${encodeURIComponent(props.path)}`}>{link.name}</a>
			</>
		}</For>
		<MaybeTitle text={getName(props.path)} />
	</>
}
