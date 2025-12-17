import { Title } from '@solidjs/meta';
import { Show } from 'solid-js';

import styles from "./MaybeTitle.module.css"

export default function MaybeTitle(props: {
	text?: string,
}) {
	return <Show when={props.text}>
		<Title>{props.text}</Title>
		<h1 class={styles.title}>{props.text}</h1>
	</Show>
}
