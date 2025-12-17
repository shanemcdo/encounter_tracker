import { Title } from '@solidjs/meta';
import { HttpStatusCode } from '@solidjs/start';

import styles from './404.module.css'

export default function NotFound() {
  return (
    <main class={styles.fourzerofour}>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
      <a href='/'>Go back to the homepage</a>
    </main>
  );
}
