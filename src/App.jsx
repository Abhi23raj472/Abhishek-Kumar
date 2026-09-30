
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useMotionValue, MotionConfig } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download, Mail, Layers3, Workflow, DatabaseZap, ShieldCheck, Sparkles, Sun, Moon } from "lucide-react";
import { useRef, useEffect, useState } from "react";
const cards = [
    { n: "01", icon: Layers3, title: "Reusable automation", text: "Designed Tosca suites for web and desktop applications, with XScan modules and shared templates that make new coverage easier to build and maintain.", tags: ["Tricentis Tosca", "XScan", "TCD"] },
    { n: "02", icon: Workflow, title: "Execution at scale", text: "Ran distributed, parallel regression through Tosca DEX across remote agents, using event-driven and scheduled execution to shorten feedback cycles.", tags: ["Tosca DEX", "Regression", "CI/CD"] },
    { n: "03", icon: DatabaseZap, title: "API & data validation", text: "Expanded REST and SOAP coverage by validating payloads, status codes and headers, while using data-driven scenarios to test across product lines.", tags: ["REST / SOAP", "Postman", "MySQL"] },
];
const tools = ["Tricentis Tosca", "XScan", "TCD", "Tosca DEX", "TQL", "Postman", "SOAP UI", "MySQL", "JIRA", "Confluence", "Agile QA", "CI/CD"];
const easing = [.22, 1, .36, 1];
function Reveal({ children, className = "", delay = 0 }) {
    const reduce = useReducedMotion();
    return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 42, filter: "blur(6px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .12 }} transition={{ duration: .85, ease: easing, delay }}>{children}</motion.div>;
}
function MagneticLink({ children, className, href, download }) {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 240, damping: 20 });
    const sy = useSpring(y, { stiffness: 240, damping: 20 });
    function move(e) { if (reduce || e.pointerType !== "mouse")
        return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .14); y.set((e.clientY - r.top - r.height / 2) * .2); }
    return <motion.a className={className} href={href} download={download} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} onBlur={() => { x.set(0); y.set(0); }} whileTap={reduce ? undefined : { scale: .97 }}>{children}</motion.a>;
}
function TiltCard({ children, className }) {
    const reduce = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rx = useSpring(x, { stiffness: 170, damping: 22 });
    const ry = useSpring(y, { stiffness: 170, damping: 22 });
    function move(e) { if (reduce || e.pointerType !== "mouse")
        return; const r = e.currentTarget.getBoundingClientRect(); x.set(-((e.clientY - r.top) / r.height - .5) * 5); y.set(((e.clientX - r.left) / r.width - .5) * 5); }
    return <motion.article className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }} onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} whileHover={reduce ? undefined : { y: -4 }} transition={{ type: "spring", stiffness: 180, damping: 22 }}>{children}</motion.article>;
}
function Timeline({ children }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 65%"] });
    const reduce = useReducedMotion();
    return <div className="timeline" ref={ref}><motion.div className="timeline-progress" style={{ scaleY: reduce ? 1 : scrollYProgress }} aria-hidden="true"/>{children}</div>;
}
function ThemeToggle() {
    const [dark, setDark] = useState(false);
    useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);
    function toggle() {
        const next = !dark;
        document.documentElement.dataset.theme = next ? "dark" : "light";
        setDark(next);
        try {
            localStorage.setItem("ak-portfolio-theme", next ? "dark" : "light");
        }
        catch { }
    }
    return <motion.button className="theme-toggle" type="button" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={toggle} whileTap={{ scale: .94 }}><Sun size={16} aria-hidden="true"/><span className="toggle-track"><motion.span className="toggle-thumb" animate={{ x: dark ? 18 : 0 }} transition={{ type: "spring", stiffness: 450, damping: 30 }}/></span><Moon size={16} aria-hidden="true"/><span className="sr-only">{dark ? "Dark mode on" : "Dark mode off"}</span></motion.button>;
}
function Heading({ n, label, title, aside }) {
    const reduce = useReducedMotion();
    return <div className="section-heading"><div><p className="eyebrow"><i />{n} / {label}</p><h2 aria-label={title}>{title.split(" ").map((word, i) => <span className="word-mask" key={i}><motion.span aria-hidden="true" initial={reduce ? false : { y: "105%" }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: i * .05, ease: easing }}>{word}</motion.span></span>)}</h2></div>{aside && <p className="section-aside">{aside}</p>}</div>;
}
export default function Home() {
    const reduce = useReducedMotion();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
    const heroRef = useRef(null);
    const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(heroScroll, [0, 1], [0, 110]);
    const orbitY = useTransform(heroScroll, [0, 1], [0, 170]);
    const orbitRotate = useTransform(heroScroll, [0, 1], [0, 25]);
    const heroOpacity = useTransform(heroScroll, [0, .8], [1, .25]);
    return <MotionConfig reducedMotion="user"><main><motion.div className="progress" style={{ scaleX }} aria-hidden="true"/>
    <header className="header"><a href="#top" className="brand" aria-label="Abhishek Kumar, back to top">AK<span>.</span><small>Abhishek Kumar</small></a><nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#recognition">Recognition</a></nav><div className="header-actions"><ThemeToggle /><a className="header-cta" href="mailto:rajputabhishek677@gmail.com">Let&apos;s connect <ArrowUpRight size={16}/></a></div></header>
    <section className="hero" id="top" ref={heroRef}><div className="grid-bg" aria-hidden="true"/><motion.div className="orbit" style={reduce ? undefined : { y: orbitY, rotate: orbitRotate }} aria-hidden="true"><motion.div className="ring ring-outer" animate={reduce ? undefined : { rotate: [0, 360] }} transition={{ duration: 70, repeat: Infinity, ease: "linear" }}/><motion.div className="ring ring-inner" animate={reduce ? undefined : { rotate: [360, 0] }} transition={{ duration: 55, repeat: Infinity, ease: "linear" }}/><motion.div className="core" animate={reduce ? undefined : { scale: [1, 1.04, 1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}><strong>QA</strong><span>ENGINEER</span></motion.div><b className="node node-one"/><b className="node node-two"/><span className="orbit-label label-one">AUTOMATION / 01</span><span className="orbit-label label-two">PRECISION / 02</span></motion.div><motion.div className="hero-copy" style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}><motion.p className="status" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><i /> QUALITY ENGINEER · TOSCA AUTOMATION</motion.p><motion.h1 initial={reduce ? false : { opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}><span className="hero-line"><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: easing, delay: .15 }}>Building confidence</motion.span></span><span className="hero-line"><motion.span initial={reduce ? false : { y: "110%" }} animate={{ y: 0 }} transition={{ duration: 1, ease: easing, delay: .3 }}>into every <em>release.</em></motion.span></span></motion.h1><motion.p className="hero-lede" initial={reduce ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }}>I&apos;m Abhishek Kumar. I design scalable test automation for complex web, desktop and API experiences, helping teams release with speed and confidence.</motion.p><motion.div className="hero-actions" initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35 }}><MagneticLink className="primary" href="#work">Explore my work <ArrowUpRight size={18}/></MagneticLink><MagneticLink className="text-link" href={`${import.meta.env.BASE_URL}Abhishek_Kumar_Resume.pdf`} download>Download resume <Download size={16}/></MagneticLink></motion.div></motion.div><div className="hero-meta"><span>5 YEARS IN QUALITY ENGINEERING</span><a href="#work">SCROLL TO EXPLORE <ArrowDown size={15}/></a><span>BASED IN INDIA · WORKING GLOBALLY</span></div></section>
    <div className="ticker" aria-label="Focus areas"><div>{[0, 1].map(i => <span key={i}>AUTOMATION STRATEGY ✳ DISTRIBUTED EXECUTION ✳ RELEASE CONFIDENCE ✳ API VALIDATION ✳ </span>)}</div></div>
    <section className="section work" id="work"><Reveal><Heading n="01" label="SELECTED WORK" title="Quality, engineered." aside="A few ways I turn complex testing needs into dependable release processes."/></Reveal><div className="work-list">{cards.map((c, i) => <Reveal key={c.n} delay={i * .08}><TiltCard className="work-card"><span className="card-num">/{c.n}</span><div className="card-icon"><c.icon size={28} strokeWidth={1.4}/></div><div className="card-copy"><h3>{c.title}</h3><p>{c.text}</p><div className="tags">{c.tags.map(t => <span key={t}>{t}</span>)}</div></div><ArrowUpRight className="card-arrow" size={24}/></TiltCard></Reveal>)}</div></section>
    <section className="section about" id="about"><div className="about-grid"><Reveal><Heading n="02" label="ABOUT" title="A systems mindset for better software."/><p className="about-copy">I work where test strategy, automation and delivery meet. From reusable modules and data-driven design to parallel execution and defect triage, I build quality into the way teams ship.</p><div className="stat"><strong>5<span>+</span></strong><span>years of experience<br />in quality engineering</span></div></Reveal><Reveal delay={.1}><Timeline><motion.article initial={reduce ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}><p className="date">NOV 2025 — PRESENT</p><h3>Quality Engineer</h3><b>Optum Global Solutions</b><p>Developing Tosca automation for web and desktop applications, designing data-driven cases and supporting CI/CD integration.</p></motion.article><motion.article initial={reduce ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}><p className="date">SEP 2021 — NOV 2025</p><h3>Senior Software Engineer</h3><b>Expleo Group · Pune, India</b><p>Owned end-to-end automation suite design and delivery, expanded API coverage, and led distributed test execution and release-level planning.</p></motion.article><motion.article initial={reduce ? false : { opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}><p className="date">2021</p><h3>B.Tech, Computer Science & Engineering</h3><b>Galgotias University · Greater Noida</b></motion.article></Timeline></Reveal></div></section>
    <section className="section toolkit"><Reveal><Heading n="03" label="TOOLKIT" title="The tools behind the work."/></Reveal><Reveal><div className="tool-cloud">{tools.map((t, i) => <motion.span key={t} className={i < 5 ? "featured" : ""} initial={reduce ? false : { opacity: 0, y: 20, scale: .94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * .04, duration: .45 }} whileHover={reduce ? undefined : { y: -5, scale: 1.03 }}>{t}</motion.span>)}</div><div className="cert"><ShieldCheck size={24}/><p><strong>Certified to go deeper.</strong> Tricentis AS1, AS2, TDS1, TDS2, AE1, API & TQL · ISTQB Foundation Level</p></div></Reveal></section>
    <section className="section recognition" id="recognition"><Reveal><Heading n="04" label="RECOGNITION" title="The work gets noticed." aside="Recognition for identifying critical issues and improving automation delivery."/></Reveal><div className="awards"><Reveal><TiltCard className="award-feature"><motion.div className="spark" animate={reduce ? undefined : { rotate: [0, 15, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}><Sparkles size={32} strokeWidth={1.2}/></motion.div><div><p className="date">2026 · UNITEDHEALTH GROUP</p><h3>Bravo! Diamond Award</h3><p>For proactively identifying and escalating a critical production-impacting defect in the Tosca Automation team.</p></div><span>01 / 04</span></TiltCard></Reveal><Reveal delay={.1}><div className="award-list"><article><small>2024</small><div><h3>Bold Mind Award</h3><p>Innovative solutions and test strategy enhancement</p></div><ArrowUpRight size={20}/></article><article><small>2024</small><div><h3>Applause Award</h3><p>Reducing regression cycle time through automation</p></div><ArrowUpRight size={20}/></article><article><small>2023</small><div><h3>WoW Award</h3><p>Enterprise automation delivery</p></div><ArrowUpRight size={20}/></article></div></Reveal></div></section>
    <footer id="contact"><div className="footer-main"><Reveal><p className="eyebrow"><i />05 / GET IN TOUCH</p><h2>Let&apos;s make the next<br /><em>release better.</em></h2><p>Have a quality engineering challenge or an opportunity to collaborate? I&apos;d love to hear about it.</p><MagneticLink className="email" href="mailto:rajputabhishek677@gmail.com">rajputabhishek677@gmail.com <ArrowUpRight size={28}/></MagneticLink></Reveal><div className="footer-monogram" aria-hidden="true">AK.</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ABHISHEK KUMAR</span><div><a href="https://www.linkedin.com/in/abhishek-kumar2301" target="_blank" rel="noopener noreferrer">LINKEDIN</a><a href="mailto:rajputabhishek677@gmail.com"><Mail size={16}/> EMAIL</a><a href={`${import.meta.env.BASE_URL}Abhishek_Kumar_Resume.pdf`} download><Download size={16}/> RESUME</a></div><a href="#top">BACK TO TOP ↑</a></div></footer>
  </main></MotionConfig>;
}
