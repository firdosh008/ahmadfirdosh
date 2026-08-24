import { Button } from '~/components/button';
import { Heading } from '~/components/heading';
import { Text } from '~/components/text';
import { Transition } from '~/components/transition';
import { getWhatsAppLink } from '~/utils/contact';
import styles from './error.module.css';

// The anime videos, the skull and the "Flatlined" gag came with the template.
// They read as a developer's personal site; this one sells services, and the
// people who land here are lost customers who need a way back. Dropping them
// also takes ~7MB of mp4 out of the build, which matters more on a mid-range
// Android over mobile data than the joke did (design spec §8.5).
const NOT_FOUND = {
  title: 'Page not found',
  message:
    'This page isn’t here — it either moved or never existed. The work, the services, and a way to reach me are all one click away.',
};

// Deliberately not `error.statusText`/`error.data`: a raw stack trace in front
// of a clinic owner is worse than no detail at all, and the real error is
// already in the server log.
const FAILED = {
  title: 'Something went wrong',
  message:
    'This one is on me, not on you. Try again in a moment — or send me a message and I’ll get it sorted.',
};

export function Error({ error }) {
  const { title, message } = error.status === 404 ? NOT_FOUND : FAILED;

  return (
    <section className={styles.page}>
      <Transition in>
        {({ visible }) => (
          <div className={styles.text}>
            {!!error.status && (
              <Heading
                className={styles.status}
                data-visible={visible}
                level={0}
                weight="bold"
              >
                {error.status}
              </Heading>
            )}
            <Heading className={styles.title} data-visible={visible} as="h1" level={3}>
              {title}
            </Heading>
            <Text className={styles.description} data-visible={visible} as="p" size="l">
              {message}
            </Text>
            <div className={styles.actions} data-visible={visible}>
              <Button iconEnd="arrow-right" iconHoverShift href="/">
                Back to homepage
              </Button>
              <Button secondary icon="whatsapp" iconHoverShift href={getWhatsAppLink()}>
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </Transition>
    </section>
  );
}
