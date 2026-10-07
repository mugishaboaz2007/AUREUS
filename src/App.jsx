import './App.css';

const features = [
  {
    title: 'Personalized experience',
    text: 'AUREUS brings together your workflow, messages, and daily tools in one polished mobile-first dashboard.',
    accent: '01',
  },
  {
    title: 'Fast installation',
    text: 'Download, run the setup, and open AUREUS instantly in a clean mobile app experience designed to feel native.',
    accent: '02',
  },
  {
    title: 'Built for momentum',
    text: 'Stay productive with clean navigation, quick actions, and a premium look that keeps every interaction simple.',
    accent: '03',
  },
];

const stats = [
  { value: '4.9/5', label: 'User rating' },
  { value: '2 min', label: 'Setup time' },
  { value: '24/7', label: 'Access' },
];

export default function App() {
  return (
    <div className="aureus-page">
      <header className="topbar">
        <div className="topbar__brand" aria-label="AUREUS brand">
          <div className="brand-mark">
            <span>A</span>
          </div>
          <span className="topbar__name">AUREUS</span>
        </div>

        <nav className="topbar__nav" aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#download">Download</a>
          <a href="#about">About</a>
        </nav>

        <a className="download-pill" href="#download">
          Download
        </a>
      </header>

      <main className="page-shell">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Welcome AUREUS</p>
            <h1>
              Welcome to <span>AUREUS</span>
              <br />
              where your mobile app feels premium.
            </h1>
            <p className="hero__text">
              AUREUS is designed to feel fast, elegant, and intuitive from the very first tap. Download the app,
              run the setup, and enjoy a mobile experience built for focus, ease, and everyday productivity.
            </p>

            <div className="hero__actions">
              <a href="/aureus-installation.txt" download="AUREUS-installation.txt" className="button button--primary">
                Download App
              </a>
              <a href="#features" className="button button--secondary">
                Explore Features
              </a>
            </div>

            <div className="hero__stats" aria-label="AUREUS app highlights">
              {stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero__visual" aria-label="AUREUS mobile app preview">
            <div className="phone-frame">
              <div className="phone-notch" />
              <div className="screen">
                <div className="screen__header">
                  <span className="dot dot--green" />
                  <span className="dot dot--yellow" />
                  <span className="dot dot--red" />
                </div>

                <div className="screen__card screen__card--main">
                  <div className="screen__label">Today</div>
                  <h3>Welcome AUREUS</h3>
                  <div className="mini-chart" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>

                <div className="screen__grid">
                  <div className="mini-panel">
                    <small>Tasks</small>
                    <strong>12</strong>
                  </div>
                  <div className="mini-panel accent">
                    <small>Focus</small>
                    <strong>86%</strong>
                  </div>
                </div>

                <div className="screen__list">
                  <div className="list-item">
                    <span className="pill" />
                    <div>
                      <strong>Quick setup</strong>
                      <small>Ready in minutes</small>
                    </div>
                  </div>
                  <div className="list-item">
                    <span className="pill pill--alt" />
                    <div>
                      <strong>Mobile access</strong>
                      <small>Always on hand</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-heading">
            <p className="eyebrow">Why AUREUS</p>
            <h2>Everything you need in one beautiful mobile app.</h2>
          </div>

          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className={`feature-icon feature-icon--${feature.accent}`} aria-hidden="true">
                  {feature.title.charAt(0)}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps" aria-label="How AUREUS works">
          <div className="section-heading">
            <p className="eyebrow">How it works</p>
            <h2>Start in minutes, then enjoy a smoother daily flow.</h2>
          </div>

          <div className="steps-grid">
            <article className="step-card">
              <span className="step-index">01</span>
              <h3>Download</h3>
              <p>Grab the setup package and choose the install path that matches your device.</p>
            </article>
            <article className="step-card">
              <span className="step-index">02</span>
              <h3>Personalize</h3>
              <p>Adjust your dashboard, day plan, and shortcuts so every screen feels tailored to you.</p>
            </article>
            <article className="step-card">
              <span className="step-index">03</span>
              <h3>Focus</h3>
              <p>Jump into your workflow with clean navigation and quick actions that keep momentum high.</p>
            </article>
          </div>
        </section>

        <section className="download-section" id="download">
          <div className="download-copy">
            <p className="eyebrow">Download</p>
            <h2>Install AUREUS and launch it like a native app.</h2>
            <p>
              Once the download is complete, run the setup, follow the quick installation steps, and enjoy the AUREUS
              experience as a sleek mobile app on your device.
            </p>
          </div>

          <div className="download-card" id="about">
            <div className="download-card__top">
              <span className="download-badge">AUREUS</span>
              <span className="download-status">Ready to install</span>
            </div>
            <h3>Download the app now</h3>
            <p>Fast setup. Clean design. Built to work beautifully on mobile.</p>
            <a href="/aureus-installation.txt" download="AUREUS-installation.txt" className="button button--primary button--wide">
              Get Download
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
