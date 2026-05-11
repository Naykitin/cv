import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  GitBranch,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Send,
  Sparkles,
} from 'lucide-react';
import './App.css';

const cvFile = `${process.env.PUBLIC_URL}/Nikitin Vladyslav CV.pdf`;

const contactLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nikitin-vladyslav/',
    icon: ExternalLink,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Naykitin',
    icon: GitBranch,
  },
  {
    label: 'Email',
    href: 'mailto:n.vladyslav@icloud.com',
    icon: Mail,
  },
];

const stats = [
  { value: '5+', label: 'Years building web products' },
  { value: '2026', label: 'Latest full-stack role' },
  { value: '15+', label: 'CMS and commerce stacks shipped' },
];

const expertise = [
  'React',
  'Next.js',
  'TypeScript',
  'WordPress',
  'WooCommerce',
  'Shopify',
  'GraphQL',
  'Apollo',
  'Tailwind CSS',
  'PHP',
  'CRM Integration',
  'SEO Optimization',
];

const experience = [
  {
    role: 'Full Stack Developer',
    company: 'Foxes',
    period: 'February 2023 - April 2026',
    location: 'Remote',
    points: [
      'Built dynamic React and Next.js interfaces, landing pages, API-powered forms, and data-driven components.',
      'Designed and deployed WordPress and Shopify e-commerce stores with polished checkout flows.',
      'Developed secure payment solutions, third-party API integrations, and CRM tracking systems.',
      'Mentored developers, defined technical standards, and improved internal development workflows.',
      'Used AI tools to speed up delivery, optimize code, and understand new APIs and technologies quickly.',
    ],
  },
  {
    role: 'WordPress Developer',
    company: 'NextG',
    period: 'March 2023 - June 2024',
    location: 'Remote',
    points: [
      'Designed and developed landing pages from customer requirements.',
      'Collaborated with teams to ship new features and improve existing websites.',
      'Translated customer needs into practical technical solutions.',
    ],
  },
  {
    role: 'Front-End Developer',
    company: 'Remote Helpers',
    period: 'April 2022 - March 2023',
    location: 'Remote',
    points: [
      'Developed recruitment-focused WordPress web applications.',
      'Maintained and enhanced company websites with a small product team.',
      'Built a strong foundation across frontend, backend, and clean functional UI delivery.',
    ],
  },
  {
    role: 'HTML Coder',
    company: 'Aweb Systems',
    period: 'February 2021 - March 2022',
    location: 'Office',
    points: [
      'Created website layouts for WordPress, Joomla, Bitrix, and ModX.',
      'Improved site designs and SEO foundations to support visibility and performance.',
    ],
  },
];

const projectHighlights = [
  'Headless CMS architecture with Next.js 15 App Router and WordPress/WooCommerce as a decoupled backend.',
  'GraphQL and Apollo Client data fetching to reduce payload size and keep queries precise.',
  'React Server Components, Turbopack, strict TypeScript interfaces, and mobile-first Tailwind styling.',
  'Linux-based WSL 2 workflow for environment parity and Node.js stability.',
];

const services = [
  {
    title: 'Full-stack product delivery',
    text: 'From pixel-perfect React frontends to PHP and Node.js backend logic, focused on maintainable business outcomes.',
    icon: Code2,
  },
  {
    title: 'Commerce systems',
    text: 'WooCommerce and Shopify builds with cleaner user flows, faster storefronts, and secure payment integrations.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Modern WordPress',
    text: 'Headless WordPress architecture that keeps editorial flexibility while improving frontend performance.',
    icon: Rocket,
  },
];

function useScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);
}

function App() {
  const shellRef = useRef(null);
  const [formStatus, setFormStatus] = useState('');

  useScrollReveal();

  const handlePointerMove = (event) => {
    const shell = shellRef.current;

    if (!shell) {
      return;
    }

    const { innerWidth, innerHeight } = window;
    const x = event.clientX / innerWidth;
    const y = event.clientY / innerHeight;

    shell.style.setProperty('--pointer-x', `${event.clientX}px`);
    shell.style.setProperty('--pointer-y', `${event.clientY}px`);
    shell.style.setProperty('--tilt-x', `${(y - 0.5) * -8}deg`);
    shell.style.setProperty('--tilt-y', `${(x - 0.5) * 10}deg`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const subject = encodeURIComponent(`CV website contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);

    window.location.href = `mailto:n.vladyslav@icloud.com?subject=${subject}&body=${body}`;
    setFormStatus('Your email client is opening with the message ready to send.');
    event.currentTarget.reset();
  };

  return (
    <main className="portfolio-shell" ref={shellRef} onPointerMove={handlePointerMove}>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-grid">
          <div className="hero-copy reveal is-visible">
            <p className="eyebrow">
              <Sparkles size={16} aria-hidden="true" />
              Available for modern web builds
            </p>
            <h1 id="hero-title">Vladyslav Nikitin</h1>
            <p className="hero-role">Full Stack Developer | WordPress Specialist</p>
            <p className="hero-text">
              I build high-performance websites and web applications, bridging polished frontend experiences
              with secure backend logic, e-commerce systems, and advanced integrations.
            </p>

            <div className="hero-actions" aria-label="Primary actions">
              <a className="button button-primary" href={cvFile} download>
                <Download size={18} aria-hidden="true" />
                Download CV
              </a>
              <a className="button button-secondary" href="#contact">
                <Mail size={18} aria-hidden="true" />
                Contact me
              </a>
            </div>

            <div className="contact-strip" aria-label="Contact details">
              <a href="tel:+34672806935">
                <Phone size={16} aria-hidden="true" />
                +34 672 806 935
              </a>
              <span>
                <MapPin size={16} aria-hidden="true" />
                Spain
              </span>
            </div>
          </div>

          <aside className="profile-panel reveal is-visible" aria-label="Profile overview">
            <div className="avatar-card">
              <div className="avatar-mark" aria-hidden="true">
                VN
              </div>
              <div>
                <p className="panel-kicker">Core focus</p>
                <h2>Fast, scalable commerce and CMS platforms</h2>
              </div>
            </div>
            <div className="stats-grid">
              {stats.map((item) => (
                <div className="stat-card" key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="link-row">
              {contactLinks.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <Icon size={18} aria-hidden="true" />
                  <span>{label}</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-grid section-intro reveal" aria-labelledby="summary-title">
        <div>
          <p className="section-label">Profile</p>
          <h2 id="summary-title">Clean code for business problems.</h2>
        </div>
        <div className="summary-copy">
          <p>
            I specialize in complex e-commerce ecosystems, but my work spans bespoke landing pages,
            corporate platforms, CMS products, and custom integrations. My goal is to create software
            that is fast, secure, scalable, and easy for teams to maintain.
          </p>
        </div>
      </section>

      <section className="cards-section reveal" aria-labelledby="expertise-title">
        <div className="section-heading">
          <p className="section-label">Expertise</p>
          <h2 id="expertise-title">What I bring to a product team</h2>
        </div>
        <div className="service-grid">
          {services.map(({ title, text, icon: Icon }) => (
            <article className="service-card" key={title}>
              <Icon size={24} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="skill-cloud" aria-label="Technical skills">
          {expertise.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </section>

      <section className="section-grid reveal" aria-labelledby="experience-title">
        <div className="sticky-heading">
          <p className="section-label">Experience</p>
          <h2 id="experience-title">Recent roles and impact</h2>
        </div>
        <div className="timeline">
          {experience.map((job, index) => (
            <article className="timeline-card" key={`${job.company}-${job.role}`} style={{ '--delay': `${index * 90}ms` }}>
              <div className="timeline-meta">
                <span>{job.period}</span>
                <span>{job.location}</span>
              </div>
              <h3>{job.role}</h3>
              <p className="company">{job.company}</p>
              <ul>
                {job.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="project-section reveal" aria-labelledby="project-title">
        <div className="project-copy">
          <p className="section-label">Personal project</p>
          <h2 id="project-title">Headless WordPress & Next.js Platform</h2>
          <p>
            An in-progress platform exploring a modern WordPress architecture with Next.js, TypeScript,
            GraphQL, Apollo, Tailwind CSS, and WooCommerce.
          </p>
          <a className="text-link" href="https://github.com/Naykitin/frontend-next" target="_blank" rel="noreferrer">
            View repository
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <div className="project-list">
          {projectHighlights.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
      </section>

      <section className="education-section reveal" aria-labelledby="education-title">
        <div>
          <p className="section-label">Education</p>
          <h2 id="education-title">Kharkiv National University of Radioelectronics</h2>
          <p>Master of Science, Mechatronics, Robotics, and Automation Engineering</p>
        </div>
        <span>Sep 2018 - Dec 2022</span>
      </section>

      <section className="contact-section reveal" id="contact" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="section-label">Contact</p>
          <h2 id="contact-title">Let’s build something fast, clear, and useful.</h2>
          <p>
            Send a short brief, a role description, or a project idea. The form prepares an email so
            you can review everything before it leaves your device.
          </p>
          <div className="contact-options">
            <a href="mailto:n.vladyslav@icloud.com">
              <Mail size={18} aria-hidden="true" />
              n.vladyslav@icloud.com
            </a>
            <a href="tel:+34672806935">
              <Phone size={18} aria-hidden="true" />
              +34 672 806 935
            </a>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name
            <input name="name" type="text" autoComplete="name" placeholder="Your name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="6" placeholder="Tell me about the project or opportunity" required />
          </label>
          <button className="button button-primary" type="submit">
            <Send size={18} aria-hidden="true" />
            Send message
          </button>
          <p className="form-status" aria-live="polite">{formStatus}</p>
        </form>
      </section>

      <footer className="site-footer">
        <p>Built with React for a focused, modern CV presentation.</p>
        <div className="footer-actions">
          <a href={cvFile} target="_blank" rel="noreferrer">Open PDF</a>
          <a href="mailto:n.vladyslav@icloud.com">n.vladyslav@icloud.com</a>
        </div>
      </footer>
    </main>
  );
}

export default App;
