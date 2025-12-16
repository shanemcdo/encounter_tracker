import { children, ParentProps, Show } from "solid-js";

export default function MaybeA(props: ParentProps<{
	href?: string,
	target?: string,
}>) {
	const safeChildren = children(() => props.children);
	return <Show
		when={props.href === undefined}
		fallback={<a {...props}>{safeChildren()}</a>}
	>{safeChildren()}</Show>
}
