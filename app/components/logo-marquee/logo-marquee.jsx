import ladderbriefLogo from '~/assets/ladderbrief-logo.svg';
import admissiondeskLogo from '~/assets/logos/admissiondesk-logo.png';
import anymartLogo from '~/assets/logos/anymart-logo.png';
import crazyMountaineersLogo from '~/assets/logos/crazy-mountaineers-logo.png';
import drSachinsDentalLogo from '~/assets/logos/dr-sachins-dental-logo.png';
import flexipaisaLogo from '~/assets/logos/flexipaisa-logo.png';
import hotelClassicInnLogo from '~/assets/logos/hotel-classic-inn-logo.png';
import sraHotelsLogo from '~/assets/logos/sra-hotels-logo.png';
import yumyLogo from '~/assets/logos/yumy-logo.png';
import styles from './logo-marquee.module.css';

// `wordmark: true` means the logo image already contains the client's
// name — no text label is rendered alongside it.
const LOGOS = [
  { name: 'Ladder Brief', src: ladderbriefLogo, wordmark: false },
  { name: 'AdmissionDesk', src: admissiondeskLogo, wordmark: true },
  { name: 'Hotel Classic Inn', src: hotelClassicInnLogo, wordmark: true },
  { name: "Dr Sachin's Dental Clinic", src: drSachinsDentalLogo, wordmark: true },
  { name: 'The Crazy Mountaineers', src: crazyMountaineersLogo, wordmark: true },
  { name: 'Yumy', src: yumyLogo, wordmark: true },
  { name: 'SRA Hotels', src: sraHotelsLogo, wordmark: true },
  { name: 'Anymart', src: anymartLogo, wordmark: true },
  { name: 'Preplix', src: null, wordmark: false },
  { name: 'FlexiPaisa', src: flexipaisaLogo, wordmark: false },
];

export const LogoMarquee = () => (
  <div className={styles.marquee} aria-hidden>
    <div className={styles.track}>
      <LogoGroup />
      <LogoGroup />
    </div>
  </div>
);

const LogoGroup = () => (
  <div className={styles.group}>
    {LOGOS.map((logo, index) => (
      <span className={styles.item} key={index}>
        {logo.src && (
          <img
            src={logo.src}
            alt={logo.name}
            className={logo.wordmark ? styles.wordmarkImg : styles.iconImg}
          />
        )}
        {!logo.wordmark && <span className={styles.name}>{logo.name}</span>}
      </span>
    ))}
  </div>
);
