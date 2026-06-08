/**
 * Configuración i18n básica (ES/EN) usando i18next + react-i18next.
 * Amplía recursos para secciones principales y textos de UI.
 */

import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

/** Clave de localStorage para persistencia de idioma */
const LS_LANG_KEY = 'app_lang'

/** Idioma inicial desde localStorage o navegador */
const initialLng =
  (typeof window !== 'undefined' && localStorage.getItem(LS_LANG_KEY)) ||
  (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'es')

/** Recursos ES/EN */
const resources = {
  es: {
    common: {
      nav: {
        home: 'Inicio',
        about: 'Sobre mí',
        skills: 'Habilidades',
        services: 'Servicios',
        experience: 'Experiencia',
        projects: 'Proyectos',
        certifications: 'Credenciales',
        testimonials: 'Testimonios',
        contact: 'Contacto',
      },
      actions: {
        pdf: 'PDF',
        cv: 'CV',
        github: 'GitHub',
        contact: 'Contacto',
        mode: 'Modo',
        settings: 'Configuración',
        viewProjects: 'Ver proyectos',
        downloadCV: 'Descargar CV',
        githubProfile: 'Perfil GitHub',
        backHome: 'Volver al inicio',
        send: 'Enviar',
        accent: 'Acento',
        langToggle: 'Cambiar idioma',
      },
      theme: {
        light: 'Claro',
        dark: 'Oscuro',
      },
      lang: {
        es: 'ES',
        en: 'EN',
      },
      hero: {
        hello: 'Hola, soy',
        role: 'Arquitecto de Software & Ingeniero Senior Full Stack | Especialista en Ciberseguridad',
        ctaPrimary: 'Descargar CV',
        ctaSecondary: 'Ver proyectos',
      },
      about: {
        title: 'Sobre mí',
        paragraph:
          'Ingeniero de Software y Arquitecto de Sistemas de élite, especializado en la creación de plataformas web escalables, de alto rendimiento y con seguridad militar. Con amplia experiencia docente universitaria y desarrollo empresarial, diseño arquitecturas robustas y optimizo el rendimiento de extremo a extremo, convirtiendo problemas complejos en productos digitales excepcionales, seguros y listos para millones de usuarios.',
        locatedIn: 'Ubicado en',
        yearsExp: '{{count}} años de experiencia',
      },
      skills: {
        title: 'Habilidades',
        stacks: {
          frontend: 'Frontend',
          backend: 'Backend',
          devops: 'DevOps',
          security: 'Seguridad',
        },
      },
      services: {
        title: 'Servicios',
        items: {
          webapp: {
            title: 'Desarrollo Frontend de Élite',
            desc: 'Creación de aplicaciones SPA y SSR ultrarrápidas, accesibles y optimizadas al milisegundo utilizando arquitecturas modernas como React y Next.js.',
          },
          backend: {
            title: 'Arquitecturas Backend de Alto Rendimiento',
            desc: 'Diseño de APIs y microservicios ultra eficientes con autenticación robusta, telemetría avanzada, pruebas unitarias y de integración bajo estándares de ciberseguridad.',
          },
          cloud: {
            title: 'Infraestructura Cloud, DevOps y Seguridad',
            desc: 'Orquestación de infraestructura resiliente, automatización de tuberías CI/CD seguras y despliegues optimizados en AWS y Docker para cero tiempo de inactividad.',
          },
        },
      },
      experience: {
        title: 'Experiencia',
      },
      projects: {
        title: 'Proyectos recientes',
        empty: 'Sin repositorios públicos para mostrar.',
        filterBy: 'Filtrar por lenguaje',
      },
      certifications: {
        title: 'Credenciales',
      },
      testimonials: {
        title: 'Testimonios',
      },
      contact: {
        title: 'Contacto',
        subtitle: '¿Tienes un proyecto o una idea? Conversemos.',
        form: {
          name: 'Nombre',
          email: 'Correo',
          message: 'Mensaje',
          send: 'Enviar',
        },
        thanksLead: '¡Gracias por tu mensaje!',
        thanksBody: 'Te responderé a la brevedad.',
      },
      thanks: {
        title: '¡Gracias!',
        description: 'Tu mensaje fue enviado. En breve me pondré en contacto.',
      },
      notFound: {
        title: 'Página no encontrada',
        description: 'No pudimos encontrar lo que buscas. Verifica la URL o vuelve al inicio.',
      },
      accent: {
        title: 'Color de acento',
      },
    },
  },
  en: {
    common: {
      nav: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        services: 'Services',
        experience: 'Experience',
        projects: 'Projects',
        certifications: 'Credentials',
        testimonials: 'Testimonials',
        contact: 'Contact',
      },
      actions: {
        pdf: 'PDF',
        cv: 'Resume',
        github: 'GitHub',
        contact: 'Contact',
        mode: 'Mode',
        settings: 'Settings',
        viewProjects: 'View projects',
        downloadCV: 'Download CV',
        githubProfile: 'GitHub Profile',
        backHome: 'Back to Home',
        send: 'Send',
        accent: 'Accent',
        langToggle: 'Toggle language',
      },
      theme: {
        light: 'Light',
        dark: 'Dark',
      },
      lang: {
        es: 'ES',
        en: 'EN',
      },
      hero: {
        hello: 'Hi, I am',
        role: 'Software Architect & Senior Full Stack Engineer | Cybersecurity Specialist',
        ctaPrimary: 'Download CV',
        ctaSecondary: 'View projects',
      },
      about: {
        title: 'About',
        paragraph:
          'Elite Software Engineer and Systems Architect specializing in building highly scalable, high-performance, and militarily secure web platforms. Combining university teaching expertise with corporate software engineering, I design robust architectures and optimize end-to-end performance, turning complex technical challenges into exceptional, secure, and production-ready digital products.',
        locatedIn: 'Based in',
        yearsExp: '{{count}} years of experience',
      },
      skills: {
        title: 'Skills',
        stacks: {
          frontend: 'Frontend',
          backend: 'Backend',
          devops: 'DevOps',
          security: 'Security',
        },
      },
      services: {
        title: 'Services',
        items: {
          webapp: {
            title: 'Elite Frontend Engineering',
            desc: 'Building lightning-fast, accessible, and millisecond-optimized SPA & SSR web applications using modern architectures like React and Next.js.',
          },
          backend: {
            title: 'High-Performance Backend Architectures',
            desc: 'Designing ultra-efficient APIs and microservices with enterprise-grade security, advanced telemetry, and extensive test coverage under rigorous cybersecurity standards.',
          },
          cloud: {
            title: 'Cloud Infrastructure, DevOps & Security',
            desc: 'Orchestrating resilient cloud environments, automating secure CI/CD pipelines, and executing zero-downtime deployments via AWS and containerized systems.',
          },
        },
      },
      experience: {
        title: 'Experience',
      },
      projects: {
        title: 'Recent projects',
        empty: 'No public repositories to show.',
        filterBy: 'Filter by language',
      },
      certifications: {
        title: 'Credentials',
      },
      testimonials: {
        title: 'Testimonials',
      },
      contact: {
        title: 'Contact',
        subtitle: "Got a project or idea? Let's talk.",
        form: {
          name: 'Name',
          email: 'Email',
          message: 'Message',
          send: 'Send',
        },
        thanksLead: 'Thanks for your message!',
        thanksBody: "I'll get back to you shortly.",
      },
      thanks: {
        title: 'Thanks!',
        description: 'Your message was sent. I will contact you soon.',
      },
      notFound: {
        title: 'Page not found',
        description: 'We couldn’t find what you’re looking for. Check the URL or go back home.',
      },
      accent: {
        title: 'Accent color',
      },
    },
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLng,
    fallbackLng: 'es',
    interpolation: { escapeValue: false },
    ns: ['common'],
    defaultNS: 'common',
  })
  .then(() => {
    // sincroniza cambios de idioma con localStorage
    i18n.on('languageChanged', (lng) => {
      try {
        localStorage.setItem(LS_LANG_KEY, lng)
      } catch {}
    })
  })

export default i18n
