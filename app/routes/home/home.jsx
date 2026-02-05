import gamestackTexture2Large from '~/assets/gamestack-list-large.jpg';
import gamestackTexture2Placeholder from '~/assets/gamestack-list-placeholder.jpg';
import gamestackTextureLarge from '~/assets/gamestack-login-large.jpg';
import animartLarge from '~/assets/animartLarge.jpg';
import animart2Large from '~/assets/animartLarge2.jpg';
import gamestackTexturePlaceholder from '~/assets/gamestack-login-placeholder.jpg';
import sliceTextureLarge from '~/assets/slice-app-large.png';
import sliceTexturePlaceholder from '~/assets/slice-app-placeholder.jpg';
import sprTexturePlaceholder from '~/assets/spr-lesson-builder-dark-placeholder.jpg';
import sprTexture from '~/assets/spr-lesson-builder-dark.jpg';
import llmControls from '~/assets/llm_controls.png';
import yummyImage from '~/assets/yummy.png';
import yummy2Image from '~/assets/yummy2.png';
import objsImage from '~/assets/objs.png';
import flatlineImage from '~/assets/flatline.png';
import { Footer } from '~/components/footer';
import { baseMeta } from '~/utils/meta';
import { Intro } from './intro';
import { Profile } from './profile';
import { ProjectSummary } from './project-summary';
import { useEffect, useRef, useState } from 'react';
import config from '~/config.json';
import styles from './home.module.css';

// Prefetch draco decoader wasm
export const links = () => {
  return [
    {
      rel: 'prefetch',
      href: '/draco/draco_wasm_wrapper.js',
      as: 'script',
      type: 'text/javascript',
      importance: 'low',
    },
    {
      rel: 'prefetch',
      href: '/draco/draco_decoder.wasm',
      as: 'fetch',
      type: 'application/wasm',
      importance: 'low',
    },
  ];
};

export const meta = () => {
  return baseMeta({
    title: 'Full-Stack Developer',
    description: `Portfolio of ${config.name} — a full-stack software engineer specializing in scalable web apps, AI-driven platforms, and blockchain solutions.`,
  });
};

export const Home = () => {
  const [visibleSections, setVisibleSections] = useState([]);
  const [scrollIndicatorHidden, setScrollIndicatorHidden] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const intro = useRef();
  const projectOne = useRef();
  const projectTwo = useRef();
  const projectThree = useRef();
  const projectFour = useRef();
  const projectFive = useRef();
  const projectSix = useRef();
  const projectSeven = useRef();
  const details = useRef();

  useEffect(() => {
    const sections = [intro, projectOne, projectTwo, projectThree, projectFive, projectSix, projectSeven, details];

    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const section = entry.target;
            observer.unobserve(section);
            if (visibleSections.includes(section)) return;
            setVisibleSections(prevSections => [...prevSections, section]);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    const indicatorObserver = new IntersectionObserver(
      ([entry]) => {
        setScrollIndicatorHidden(!entry.isIntersecting);
      },
      { rootMargin: '-100% 0px 0px 0px' }
    );

    sections.forEach(section => {
      if (section.current) {
        sectionObserver.observe(section.current);
      }
    });

    indicatorObserver.observe(intro.current);

    return () => {
      sectionObserver.disconnect();
      indicatorObserver.disconnect();
    };
  }, [visibleSections]);

  return (
    <div className={styles.home}>
      <Intro
        id="intro"
        sectionRef={intro}
        scrollIndicatorHidden={scrollIndicatorHidden}
      />
      <ProjectSummary
        id="project-1"
        sectionRef={projectOne}
        visible={visibleSections.includes(projectOne.current)}
        index={1}
        title="LLM Controls"
        description="Built an advanced AI control platform for managing and monitoring large language models with real-time analytics, prompt optimization, and security controls. Developed visual workflow orchestration system enabling dynamic configuration of LLMs, vector databases, and tools across multiple client use cases. Implemented MLflow for experiment tracking and performance monitoring, along with an agentic RFP automation system using specialized AI agents."
        buttonText="View Website"
        buttonLink="https://app.llmcontrols.ai/"
        model={{
          type: 'laptop',
          alt: 'LLM Controls platform',
          textures: [
            {
              srcSet: `${llmControls} 800w, ${llmControls} 1920w`,
              placeholder: sliceTexturePlaceholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-2"
        alternate
        sectionRef={projectTwo}
        visible={visibleSections.includes(projectTwo.current)}
        index={2}
        title="FlexiPaisa"
        description="Built a production-grade lending services mobile application using React Native, serving business entities and MSME employees with secure loan management and real-time tracking. Implemented comprehensive financial workflows including loan application processing, credit assessment, and automated repayment scheduling. Integrated secure payment gateways and real-time notifications to enhance user experience and operational efficiency."
        buttonText="View on Play Store"
        buttonLink="https://play.google.com/store/apps/details?id=com.madhurinstalments.flexipaisa&hl=en_IN"
        model={{
          type: 'phone',
          alt: 'FlexiPaisa mobile app',
          textures: [
            {
              srcSet: `${gamestackTextureLarge} 375w, ${gamestackTextureLarge} 750w`,
              placeholder: gamestackTexturePlaceholder,
            },
            {
              srcSet: `${gamestackTexture2Large} 375w, ${gamestackTexture2Large} 750w`,
              placeholder: gamestackTexture2Placeholder,
            },
          ],
        }}
      />
      <ProjectSummary
        id="project-3"
        sectionRef={projectThree}
        visible={visibleSections.includes(projectThree.current)}
        index={3}
        title="Preplix"
        description="Designed and developed a scalable online learning platform for higher education using Next.js, featuring real-time progress tracking and interactive course management. Built comprehensive learning management system with video streaming, assignment submissions, and automated grading capabilities. Implemented advanced analytics dashboard for educators to monitor student engagement and performance metrics."
        buttonText="View Website"
        buttonLink="https://preplix.com/"
        model={{
          type: 'laptop',
          alt: 'Preplix learning platform',
          textures: [
            {
              srcSet: `${sprTexture} 1280w, ${sprTexture} 2560w`,
              placeholder: sprTexturePlaceholder,
            },
          ],
        }}
      />
      {showAllProjects && (
        <>
          <ProjectSummary
            id="project-5"
            sectionRef={projectFive}
            visible={visibleSections.includes(projectFive.current)}
            index={5}
            title="The Crazy Mountaineers"
            description="Designed and developed a dynamic travel agency platform with integrated booking system, payment gateway, and admin dashboard for tour package management"
            buttonText="View Website"
            buttonLink="https://thecrazymountaineers.in/"
            model={{
              type: 'laptop',
              alt: 'The Crazy Mountaineers travel platform',
              textures: [
                {
                  srcSet: `${sliceTextureLarge} 1280w, ${sliceTextureLarge} 2560w`,
                  placeholder: sliceTexturePlaceholder,
                },
              ],
            }}
          />
          <ProjectSummary
            id="project-6"
            alternate
            sectionRef={projectSix}
            visible={visibleSections.includes(projectSix.current)}
            index={6}
            title="Yumy"
            description="Developed a full-featured food ordering platform with restaurant management, real-time order tracking, and integrated payment solutions using MERN stack"
            buttonText="View Website"
            buttonLink="https://yumy.onrender.com/"
            model={{
              type: 'phone',
              alt: 'Yumy food ordering app',
              textures: [
                {
                  srcSet: `${yummyImage} 375w, ${yummyImage} 750w`,
                  placeholder: gamestackTexturePlaceholder,
                },
                {
                  srcSet: `${yummy2Image} 375w, ${yummy2Image} 750w`,
                  placeholder: gamestackTexture2Placeholder,
                },
              ],
            }}
          />
          <ProjectSummary
            id="project-7"
            sectionRef={projectSeven}
            visible={visibleSections.includes(projectSeven.current)}
            index={7}
            title="Objs"
            description="Developed a comprehensive cryptocurrency analytics platform with real-time market data, advanced charting, and portfolio tracking features using React and blockchain APIs"
            buttonText="View Website"
            buttonLink="https://objs.ai/"
            model={{
              type: 'laptop',
              alt: 'Crypto Nova analytics platform',
              textures: [
                {
                  srcSet: `${objsImage} 800w, ${objsImage} 1920w`,
                  placeholder: sliceTexturePlaceholder,
                },
              ],
            }}
          />
        </>
      )}
      {!showAllProjects && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <a
            href="/projects"
            style={{
              background: 'rgb(0, 229, 255)',
              color: 'rgb(0, 0, 0)',
              border: 'none',
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '500',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
              display: 'inline-block',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgb(0, 200, 230)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgb(0, 229, 255)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            View More Projects
          </a>
        </div>
      )}
      <Profile
        sectionRef={details}
        visible={visibleSections.includes(details.current)}
        id="details"
      />
      <Footer />
    </div>
  );
};
