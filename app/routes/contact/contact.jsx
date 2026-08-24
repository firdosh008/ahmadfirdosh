import { Button } from '~/components/button';
import { Divider } from '~/components/divider';
import { Footer } from '~/components/footer';
import { Heading } from '~/components/heading';
import { Icon } from '~/components/icon';
import { Input } from '~/components/input';
import { Section } from '~/components/section';
import { Text } from '~/components/text';
import { tokens } from '~/components/theme-provider/theme';
import { Transition } from '~/components/transition';
import { useFormInput } from '~/hooks';
import { useRef, useState } from 'react';
import { classes, cssProps, msToNum, numToMs } from '~/utils/style';
import { baseMeta } from '~/utils/meta';
import { getWhatsAppLink } from '~/utils/contact';
import config from '~/config.json';
import { Form, useActionData, useNavigation } from '@remix-run/react';
import styles from './contact.module.css';
import emailjs from '@emailjs/browser';

export const meta = () => {
  return baseMeta({
    title: 'Contact',
    description:
      'Tell me about your project on WhatsApp, or send it through the form. Rough budget optional — I’ll tell you honestly if I’m the right fit.',
  });
};

const MAX_EMAIL_LENGTH = 512;
const MAX_MESSAGE_LENGTH = 4096;
const EMAIL_PATTERN = /(.+)@(.+){2,}\.(.+){2,}/;

const BUDGET_OPTIONS = [
  'Under ₹25,000',
  '₹25,000 – 75,000',
  '₹75,000 – 2,00,000',
  '₹2,00,000+',
  'Not sure yet',
];

export const Contact = () => {
  const errorRef = useRef();
  const email = useFormInput('');
  const message = useFormInput('');
  const initDelay = tokens.base.durationS;
  const actionData = useActionData();
  const { state } = useNavigation();
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setErrors({});

    if (!email.value || !/.+@.+\..+/.test(email.value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      setSending(false);
      return;
    }
    if (!message.value) {
      setErrors((prev) => ({ ...prev, message: 'Please enter a message.' }));
      setSending(false);
      return;
    }

    const budget = new FormData(e.currentTarget.form).get('budget') || 'Not specified';

    try {
      await emailjs.send(
        'service_kgkw9mr',
        'template_y8vhwqq',
        {
          email: email.value,
          message: message.value,
          budget,
        },
        'il0zj6ZLldwJH_0tL'
      );
      setSuccess(true);
    } catch (error) {
      console.error('Email sending failed:', error);
      setErrors((prev) => ({ ...prev, message: 'Failed to send message. Please try again later.' }));
    }
    setSending(false);
  };

  return (
    <Section className={styles.contact}>
      <div className={styles.quickContact}>
        <Text as="p" size="s" className={styles.quickContactLabel}>
          Quicker ways to reach me
        </Text>
        <Button
          className={styles.quickContactButton}
          icon="whatsapp"
          iconHoverShift
          href={getWhatsAppLink()}
        >
          Chat on WhatsApp
        </Button>
        {!!config.calLink && (
          <Button
            secondary
            className={styles.quickContactButton}
            iconEnd="arrow-right"
            iconHoverShift
            href={config.calLink}
          >
            Book a call
          </Button>
        )}
        <a className={styles.quickContactPhone} href="tel:+917017282924">
          {config.whatsappDisplay}
        </a>
      </div>
      <Transition unmount in={!success} timeout={1600}>
        {({ status, nodeRef }) => (
          <Form
            unstable_viewTransition
            className={styles.form}
            method="post"
            ref={nodeRef}
          >
            <Heading
              className={styles.title}
              data-status={status}
              level={3}
              as="h1"
              style={getDelay(tokens.base.durationXS, initDelay, 0.3)}
            >
              Let’s talk
            </Heading>
            <Divider
              className={styles.divider}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
            />
            {/* Hidden honeypot field to identify bots */}
            <Input
              className={styles.botkiller}
              label="Name"
              name="name"
              maxLength={MAX_EMAIL_LENGTH}
            />
            <Input
              required
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationXS, initDelay)}
              autoComplete="email"
              label="Your email"
              type="email"
              name="email"
              maxLength={MAX_EMAIL_LENGTH}
              {...email}
            />
            <Input
              required
              multiline
              className={styles.input}
              data-status={status}
              style={getDelay(tokens.base.durationS, initDelay)}
              autoComplete="off"
              label="Message"
              name="message"
              maxLength={MAX_MESSAGE_LENGTH}
              {...message}
            />
            <div className={classes(styles.input, styles.select)} data-status={status} style={getDelay(tokens.base.durationS, initDelay, 1.2)}>
              <label className={styles.selectLabel} htmlFor="budget">
                Rough budget (optional)
              </label>
              <select className={styles.selectInput} id="budget" name="budget" defaultValue="">
                <option value="" disabled>
                  Select a range
                </option>
                {BUDGET_OPTIONS.map(option => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <Transition
              unmount
              in={!sending && actionData?.errors}
              timeout={msToNum(tokens.base.durationM)}
            >
              {({ status: errorStatus, nodeRef }) => (
                <div
                  className={styles.formError}
                  ref={nodeRef}
                  data-status={errorStatus}
                  style={cssProps({
                    height: errorStatus ? errorRef.current?.offsetHeight : 0,
                  })}
                >
                  <div className={styles.formErrorContent} ref={errorRef}>
                    <div className={styles.formErrorMessage}>
                      <Icon className={styles.formErrorIcon} icon="error" />
                      {actionData?.errors?.email}
                      {actionData?.errors?.message}
                    </div>
                  </div>
                </div>
              )}
            </Transition>
            <div className={styles.buttonContainer}>
              <Button
                className={styles.button}
                data-status={status}
                data-sending={sending}
                style={getDelay(tokens.base.durationM, initDelay)}
                disabled={sending}
                loading={sending}
                loadingText="Sending..."
                icon="send"
                type="button"
                onClick={sendEmail}
              >
                Send message
              </Button>
            </div>

          </Form>
        )}
      </Transition>
      <Transition unmount in={success}>
        {({ status, nodeRef }) => (
          <div className={styles.complete} aria-live="polite" ref={nodeRef}>
            <Heading
              level={3}
              as="h3"
              className={styles.completeTitle}
              data-status={status}
            >
              Message sent
            </Heading>
            <Text
              size="l"
              as="p"
              className={styles.completeText}
              data-status={status}
              style={getDelay(tokens.base.durationXS)}
            >
              I’ll get back to you within a day. If it’s urgent, WhatsApp is faster.
            </Text>
            <Button
              secondary
              iconHoverShift
              className={styles.completeButton}
              data-status={status}
              style={getDelay(tokens.base.durationM)}
              href="/"
              icon="chevron-right"
            >
              Back to homepage
            </Button>
          </div>
        )}
      </Transition>
      <Footer className={styles.footer} />
    </Section>
  );
};

function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
