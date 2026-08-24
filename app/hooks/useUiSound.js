import { useEffect } from 'react';
import { clickSound, hoverSound } from '~/utils/sound';

// What counts as something worth making a noise about. Sounding on every
// element would fire on the page background, and again on every span inside a
// button. `[tabindex]` is what catches the two carousels, whose input surfaces
// are focusable divs rather than buttons.
const INTERACTIVE =
  'a, button, summary, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])';

export function useUiSound(muted) {
  useEffect(() => {
    if (muted) return;

    const reach = event => event.target?.closest?.(INTERACTIVE);
    let last = null;

    // pointerover, not mousemove: it fires once on entering an element, so it
    // needs no throttling. `last` is what stops a second blip as the pointer
    // crosses from a button's icon onto its own label — both are inside the
    // same button, and only the button is worth a sound.
    const onOver = event => {
      // A tap fires pointerover immediately before click. Left alone that's
      // two sounds for one press on every phone.
      if (event.pointerType === 'touch') return;

      const el = reach(event);
      if (!el || el === last) return;

      last = el;
      hoverSound();
    };

    const onOut = event => {
      if (reach(event) === last) last = null;
    };

    const onClick = event => {
      if (reach(event)) clickSound();
    };

    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.removeEventListener('click', onClick);
    };
  }, [muted]);
}
