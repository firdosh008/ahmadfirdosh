import gamestackTextureLarge from '~/assets/gamestack-login-large.jpg';
import gamestackTexturePlaceholder from '~/assets/gamestack-login-placeholder.jpg';
import sliceTexturePlaceholder from '~/assets/slice-app-placeholder.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import ladderbrief1 from '~/assets/ladderbrief-1-hero.jpg';
import ladderbrief1Placeholder from '~/assets/ladderbrief-1-hero-placeholder.jpg';
import ladderbrief2 from '~/assets/ladderbrief-2-script.jpg';
import ladderbrief2Placeholder from '~/assets/ladderbrief-2-script-placeholder.jpg';
import ladderbrief3 from '~/assets/ladderbrief-3-brain.jpg';
import ladderbrief3Placeholder from '~/assets/ladderbrief-3-brain-placeholder.jpg';
import llmControlsImage from '~/assets/llm_controls.png';
import objsImage from '~/assets/objs.png';
import sra1 from '~/assets/sra-1-home.jpg';
import sra1Placeholder from '~/assets/sra-1-home-placeholder.jpg';
import sra2 from '~/assets/sra-2-rooms.jpg';
import sra2Placeholder from '~/assets/sra-2-rooms-placeholder.jpg';
import sra3 from '~/assets/sra-3-gallery.jpg';
import sra3Placeholder from '~/assets/sra-3-gallery-placeholder.jpg';
import ad1 from '~/assets/admissiondesk-1-hero.jpg';
import ad1Placeholder from '~/assets/admissiondesk-1-hero-placeholder.jpg';
import ad2 from '~/assets/admissiondesk-2-process.jpg';
import ad2Placeholder from '~/assets/admissiondesk-2-process-placeholder.jpg';
import ad3 from '~/assets/admissiondesk-3-outcomes.jpg';
import ad3Placeholder from '~/assets/admissiondesk-3-outcomes-placeholder.jpg';
import yumy1 from '~/assets/yumy-1-hero.jpg';
import yumy1Placeholder from '~/assets/yumy-1-hero-placeholder.jpg';
import yumy2 from '~/assets/yumy-2-gallery.jpg';
import yumy2Placeholder from '~/assets/yumy-2-gallery-placeholder.jpg';
import yumy3 from '~/assets/yumy-3-menu.jpg';
import yumy3Placeholder from '~/assets/yumy-3-menu-placeholder.jpg';
import anymart1 from '~/assets/anymart-1-hero.jpg';
import anymart1Placeholder from '~/assets/anymart-1-hero-placeholder.jpg';
import anymart2 from '~/assets/anymart-2-categories.jpg';
import anymart2Placeholder from '~/assets/anymart-2-categories-placeholder.jpg';
import anymart3 from '~/assets/anymart-3-anime.jpg';
import anymart3Placeholder from '~/assets/anymart-3-anime-placeholder.jpg';
import crazy1 from '~/assets/crazy-1-home.jpg';
import crazy1Placeholder from '~/assets/crazy-1-home-placeholder.jpg';
import crazy2 from '~/assets/crazy-2-treks.jpg';
import crazy2Placeholder from '~/assets/crazy-2-treks-placeholder.jpg';
import crazy3 from '~/assets/crazy-3-blog.jpg';
import crazy3Placeholder from '~/assets/crazy-3-blog-placeholder.jpg';
import hotel1 from '~/assets/hotelclassic-1-hero.jpg';
import hotel1Placeholder from '~/assets/hotelclassic-1-hero-placeholder.jpg';
import hotel2 from '~/assets/hotelclassic-2-rooms.jpg';
import hotel2Placeholder from '~/assets/hotelclassic-2-rooms-placeholder.jpg';
import hotel3 from '~/assets/hotelclassic-3-gallery.jpg';
import hotel3Placeholder from '~/assets/hotelclassic-3-gallery-placeholder.jpg';
import dental1 from '~/assets/drsachin-1-hero.jpg';
import dental1Placeholder from '~/assets/drsachin-1-hero-placeholder.jpg';
import dental2 from '~/assets/drsachin-2-services.jpg';
import dental2Placeholder from '~/assets/drsachin-2-services-placeholder.jpg';
import dental3 from '~/assets/drsachin-3-testimonials.jpg';
import dental3Placeholder from '~/assets/drsachin-3-testimonials-placeholder.jpg';

// Single source of truth for every project card, used by the home page
// (featured subset), the /work page (full, categorized list), so the two
// can't drift apart.
//
// Categories, in display priority order (see design spec §5, revised):
// - 'Business Websites'  — leads. Local business buyers are the primary goal.
// - 'Client Products'    — real shipped products with real users.
// - 'AI & Automation'    — the technical proof stack, for agency/technical buyers.
export const ProjectCategory = {
  BusinessWebsites: 'Business Websites',
  ClientProducts: 'Client Products',
  AI: 'AI & Automation',
};

// Anchor ids for /work category sections, also used by the "Who I work with"
// cards on the home page so the two can't drift apart.
export const categorySlugs = {
  [ProjectCategory.BusinessWebsites]: 'business-websites',
  [ProjectCategory.ClientProducts]: 'client-products',
  [ProjectCategory.AI]: 'ai-automation',
};

export const projects = [
  // --- Business Websites ---------------------------------------------
  {
    id: 'admissiondesk',
    title: 'AdmissionDesk',
    category: ProjectCategory.BusinessWebsites,
    summary:
      'College admissions counselling website for a Dehradun-based business, live since 2020.',
    buttonText: 'View Website',
    buttonLink: 'https://www.admissiondesk.info/',
    images: [
      { src: ad1, placeholder: ad1Placeholder, alt: 'AdmissionDesk homepage' },
      { src: ad2, placeholder: ad2Placeholder, alt: 'AdmissionDesk counselling process' },
      { src: ad3, placeholder: ad3Placeholder, alt: 'AdmissionDesk student outcomes' },
    ],
    testimonial: {
      quote:
        'We needed a website that felt as trustworthy as the advice we give students, and Firdosh delivered exactly that — clean, fast, and easy for our team to manage ourselves.',
      // Pulled out for the hero note, where only ~3 lines fit: the opening
      // sets up context, this is the part that's about the work.
      highlight:
        'Firdosh delivered exactly that — clean, fast, and easy for our team to manage ourselves.',
      name: 'Shubham Panwar',
      role: 'AdmissionDesk',
      rating: 5,
    },
  },
  {
    id: 'yumy',
    title: 'Yumy',
    category: ProjectCategory.BusinessWebsites,
    summary:
      'Food ordering platform with live order tracking and a restaurant dashboard.',
    buttonText: 'View Website',
    buttonLink: 'https://yumy.onrender.com/',
    images: [
      { src: yumy1, placeholder: yumy1Placeholder, alt: 'Yumy homepage' },
      { src: yumy2, placeholder: yumy2Placeholder, alt: 'Yumy restaurant gallery' },
      { src: yumy3, placeholder: yumy3Placeholder, alt: 'Yumy menu page' },
    ],
    testimonial: {
      quote:
        'From the first call, Firdosh got what we needed — a food ordering site that’s simple for customers and even simpler for us to manage on the backend.',
      name: 'Mansi Maithani',
      role: 'Yumy',
      rating: 5,
    },
  },
  {
    id: 'sra-hotels',
    title: 'SRA Hotels',
    category: ProjectCategory.BusinessWebsites,
    summary: 'Multi-page hotel website with room booking and a photo gallery.',
    buttonText: 'View Website',
    buttonLink: 'https://firdosh008.github.io/Sra-hotles/',
    images: [
      { src: sra1, placeholder: sra1Placeholder, alt: 'SRA Hotels homepage' },
      { src: sra2, placeholder: sra2Placeholder, alt: 'SRA Hotels room booking page' },
      { src: sra3, placeholder: sra3Placeholder, alt: 'SRA Hotels photo gallery' },
    ],
    testimonial: {
      quote:
        'Firdosh understood exactly what a hotel website needs — it looks premium, loads fast, and guests can actually find what they’re looking for.',
      name: 'Lucky Singh Rana',
      role: 'SRA Hotels',
      rating: 5,
    },
  },
  {
    id: 'hotel-classic-inn',
    title: 'Hotel Classic Inn',
    category: ProjectCategory.BusinessWebsites,
    summary: 'Boutique hotel website with room types, gallery, and online booking.',
    buttonText: 'View Website',
    buttonLink: 'https://hotelclassicinn.in/',
    images: [
      { src: hotel1, placeholder: hotel1Placeholder, alt: 'Hotel Classic Inn homepage' },
      {
        src: hotel2,
        placeholder: hotel2Placeholder,
        alt: 'Hotel Classic Inn room types',
      },
      {
        src: hotel3,
        placeholder: hotel3Placeholder,
        alt: 'Hotel Classic Inn photo gallery',
      },
    ],
  },
  {
    id: 'dr-sachins-dental',
    title: "Dr Sachin's Dental Clinic",
    category: ProjectCategory.BusinessWebsites,
    summary: 'Clinic website with services, booking, and patient testimonials.',
    buttonText: 'View Website',
    buttonLink: 'https://drsachinsdental.com/',
    images: [
      {
        src: dental1,
        placeholder: dental1Placeholder,
        alt: "Dr Sachin's Dental Clinic homepage",
      },
      {
        src: dental2,
        placeholder: dental2Placeholder,
        alt: "Dr Sachin's Dental Clinic services",
      },
      {
        src: dental3,
        placeholder: dental3Placeholder,
        alt: "Dr Sachin's Dental Clinic patient testimonials",
      },
    ],
    // PLACEHOLDER — not a real client quote. Written to hold the layout until
    // Dr Sachin's own words replace it. Swap the quote, highlight, name and
    // role before this goes live.
    testimonial: {
      quote:
        'Patients used to call just to ask about timings and treatments. The site answers all of that now, and the bookings that come through are people who already know what they want.',
      // Pulled out for the hero note, where only ~3 lines fit.
      highlight:
        'The bookings that come through are people who already know what they want.',
      name: 'Dr Sachin',
      role: "Dr Sachin's Dental Clinic",
      rating: 5,
    },
  },

  // --- Client Products -------------------------------------------------
  {
    id: 'crazy-mountaineers',
    title: 'The Crazy Mountaineers',
    category: ProjectCategory.ClientProducts,
    summary: 'Travel booking platform with real-time itineraries and online payments.',
    buttonText: 'View Website',
    buttonLink: 'https://thecrazymountaineers.com/',
    images: [
      {
        src: crazy1,
        placeholder: crazy1Placeholder,
        alt: 'The Crazy Mountaineers homepage',
      },
      {
        src: crazy2,
        placeholder: crazy2Placeholder,
        alt: 'The Crazy Mountaineers treks listing',
      },
      {
        src: crazy3,
        placeholder: crazy3Placeholder,
        alt: 'The Crazy Mountaineers travel blog',
      },
    ],
    testimonial: {
      quote:
        'Our old booking process was all over WhatsApp and phone calls. Firdosh built us a proper system for it — itineraries, payments, everything in one place — without making it complicated for our team.',
      name: 'Abhishek Bahuguna',
      role: 'The Crazy Mountaineers',
      rating: 5,
    },
  },
  {
    id: 'anymart',
    title: 'Anymart',
    category: ProjectCategory.ClientProducts,
    summary: 'E-commerce platform with payments, inventory, and an admin dashboard.',
    buttonText: 'View Website',
    buttonLink: 'https://anymart.onrender.com/',
    images: [
      { src: anymart1, placeholder: anymart1Placeholder, alt: 'Anymart homepage' },
      { src: anymart2, placeholder: anymart2Placeholder, alt: 'Anymart top categories' },
      {
        src: anymart3,
        placeholder: anymart3Placeholder,
        alt: 'Anymart top anime section',
      },
    ],
  },
  {
    id: 'flexipaisa',
    title: 'FlexiPaisa',
    category: ProjectCategory.ClientProducts,
    summary: 'Lending app for MSME loan management, live on the Play Store.',
    buttonText: 'View on Play Store',
    buttonLink:
      'https://play.google.com/store/apps/details?id=com.madhurinstalments.flexipaisa&hl=en_IN',
    image: {
      srcSet: `${gamestackTextureLarge} 375w, ${gamestackTextureLarge} 750w`,
      placeholder: gamestackTexturePlaceholder,
      alt: 'FlexiPaisa mobile app',
    },
  },
  {
    id: 'preplix',
    title: 'Preplix',
    category: ProjectCategory.ClientProducts,
    summary: 'Online learning platform connecting students with expert instructors.',
    buttonText: null,
    buttonLink: null,
    image: {
      srcSet: `${sprTexture} 1280w, ${sprTexture} 2560w`,
      placeholder: sprTexturePlaceholder,
      alt: 'Preplix learning platform',
    },
  },

  // --- AI & Automation ---------------------------------------------------
  {
    id: 'ladderbrief',
    title: 'Ladder Brief',
    category: ProjectCategory.AI,
    summary:
      'AI content pipeline that takes founders from research to script to video, powered by a custom long-term memory system and MCP server.',
    buttonText: 'View Website',
    buttonLink: 'https://ladderbrief.com/',
    images: [
      {
        src: ladderbrief1,
        placeholder: ladderbrief1Placeholder,
        alt: 'Ladder Brief homepage',
      },
      {
        src: ladderbrief2,
        placeholder: ladderbrief2Placeholder,
        alt: 'Ladder Brief AI script generation',
      },
      {
        src: ladderbrief3,
        placeholder: ladderbrief3Placeholder,
        alt: 'Ladder Brief Digital Brain knowledge graph',
      },
    ],
    testimonial: {
      quote:
        'Firdosh built our entire AI content pipeline from the ground up — research to script to finished video, with real memory behind it instead of a one-off script. It changed how fast we can put out content.',
      name: 'Shivam Chandhok',
      role: 'Ladder Brief',
      rating: 5,
    },
  },
  {
    id: 'llm-controls',
    title: 'LLM Controls',
    category: ProjectCategory.AI,
    summary: 'AI control platform for LLM workflows and agent monitoring.',
    buttonText: 'View Website',
    buttonLink: 'https://app.llmcontrols.ai/',
    image: {
      srcSet: `${llmControlsImage} 800w, ${llmControlsImage} 1920w`,
      placeholder: sliceTexturePlaceholder,
      alt: 'LLM Controls platform interface',
    },
    testimonial: {
      quote:
        'We needed real visibility into what our agents were actually doing, not just logs. Firdosh built us a platform that gives us that control.',
      name: 'Pradeep',
      role: 'LLM Controls',
      rating: 5,
    },
  },
  {
    id: 'objs',
    title: 'Objs',
    category: ProjectCategory.AI,
    summary: 'AI workspace that turns uploaded files into a searchable knowledge base.',
    buttonText: null,
    buttonLink: null,
    image: {
      srcSet: `${objsImage} 800w, ${objsImage} 1920w`,
      placeholder: sliceTexturePlaceholder,
      alt: 'Objs AI workspace platform',
    },
    testimonial: {
      quote:
        'Firdosh built exactly what we needed — a place to dump every file and actually find what mattered again. It just works.',
      name: 'Jimmy',
      role: 'Objs',
      rating: 5,
    },
  },
];

// Curated, ordered subset for the home page — Ladder Brief leads.
const FEATURED_IDS = ['ladderbrief', 'admissiondesk', 'crazy-mountaineers'];

export const featuredProjects = FEATURED_IDS.map(id =>
  projects.find(project => project.id === id)
);

export const testimonials = projects
  .filter(project => project.testimonial)
  .map(project => project.testimonial);

export const projectsByCategory = Object.values(ProjectCategory).map(category => ({
  category,
  projects: projects.filter(project => project.category === category),
}));
