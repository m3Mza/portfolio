import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ReplicationPage.css";

const teme = ['apple', 'claude', 'mastercard', 'playstation'] as const;
type Tema = typeof teme[number];

const temeNazivi: Record<Tema, string> = {
  apple:       'Apple',
  claude:      'Claude',
  mastercard:  'Mastercard',
  playstation: 'PlayStation',
};

export default function ReplicationPage() {
  const navigate = useNavigate();
  const [aktivnaTema, setAktivnaTema] = useState<Tema>('apple');
  const [copied, setCopied] = useState(false);

  const copyInstallCmd = () => {
    navigator.clipboard.writeText('curl -fsSL https://claude.ai/install.sh | bash');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rp-root" data-theme={aktivnaTema}>

      <nav className="rp-nav">
        <button className="rp-nav-back" onClick={() => navigate(-1)}>← Nazad</button>
        <div className="rp-nav-themes">
          {teme.map((t) => (
            <button
              key={t}
              className={`rp-nav-theme-link${t === aktivnaTema ? ' rp-nav-theme-link--active' : ''}`}
              onClick={() => setAktivnaTema(t)}
            >
              {temeNazivi[t]}
            </button>
          ))}
        </div>
      </nav>

      {/* ════════════════════════════════════════════
          APPLE
          ════════════════════════════════════════════ */}
      {aktivnaTema === 'apple' && <>

        {/* ── Tile 1: iPhone — parchment, centered ── */}
        <section className="rp-tile rp-tile--parchment rp-apple-hero-tile">
          <div className="rp-tile-inner rp-apple-centered">
            <h1 className="rp-hero-display rp-apple-ink-display">iPhone 17 Pro.</h1>
            <p className="rp-lead rp-apple-ink-lead">Titanijum. Jak kao i ikad.</p>
            <div className="rp-cta-row rp-cta-row--center">
              <button className="comp-button-primary">Saznaj više</button>
              <button className="comp-button-secondary-pill">Kupi</button>
            </div>
            <img src="/diplomski/apple1.png" alt="iPhone 17 Pro" className="rp-apple-render" />
          </div>
        </section>

        {/* ── Tile 2: MacBook Air — light-blue gradient ── */}
        <section className="rp-tile rp-apple-macbook-tile">
          <div className="rp-tile-inner rp-apple-centered">
            <h2 className="rp-display-lg rp-apple-ink-display">MacBook Air.</h2>
            <p className="rp-lead rp-apple-ink-lead">Napredniji M5 čip. Isti Air.</p>
            <div className="rp-cta-row rp-cta-row--center">
              <button className="comp-button-primary">Saznaj više</button>
              <button className="comp-button-secondary-pill">Kupi</button>
            </div>
            <img src="/diplomski/apple2.png" alt="MacBook Air" className="rp-apple-render" />
          </div>
        </section>

        {/* ── Tile 3: 50/50 split — apple3 + apple4 ── */}
        <div className="rp-apple-split">
          <div className="rp-apple-split-cell">
            <div className="rp-apple-split-copy">
              <h2 className="rp-display-lg rp-apple-ink-display">Apple for College.</h2>
              <p className="rp-lead rp-apple-ink-lead">Mac i iPad. Odlični u svakom smeru.</p>
              <div className="rp-cta-row rp-cta-row--center">
                <button className="comp-button-primary">Saznaj više</button>
              </div>
            </div>
            <img src="/diplomski/apple3.png" alt="Mac i iPad" className="rp-apple-split-img" />
          </div>
          <div className="rp-apple-split-cell rp-apple-split-cell--alt">
            <div className="rp-apple-split-copy">
              <h2 className="rp-display-lg rp-apple-ink-display">Apple Watch Series 11.</h2>
              <p className="rp-lead rp-apple-ink-lead">Ultimativni pratilac za zdravlje.</p>
              <div className="rp-cta-row rp-cta-row--center">
                <button className="comp-button-primary">Saznaj više</button>
                <button className="comp-button-secondary-pill">Kupi</button>
              </div>
            </div>
            <img src="/diplomski/apple4.png" alt="Apple Watch" className="rp-apple-split-img" />
          </div>
        </div>

        {/* ── Tile 4: Store — parchment ── */}
        <section className="rp-tile rp-tile--parchment">
          <div className="rp-tile-inner rp-apple-centered">
            <p className="rp-section-label">Apple prodavnica</p>
            <h2 className="rp-display-lg rp-apple-ink-display">Pronađi pravi uređaj za tebe.</h2>
            <div className="rp-apple-chips">
              {["Svi uređaji", "iPhone", "Mac", "iPad", "Apple Watch"].map((c, i) => (
                <button key={c} className={i === 0
                  ? "comp-configurator-option-chip comp-configurator-option-chip-selected"
                  : "comp-configurator-option-chip"}>
                  {c}
                </button>
              ))}
            </div>
            <div className="rp-card-grid">
              {[
                { name: "iPhone 17 Pro", price: "Od 149.990 din." },
                { name: "MacBook Air M5", price: "Od 129.990 din." },
                { name: "AirPods Pro 2",  price: "Od 39.990 din."  },
              ].map(item => (
                <div key={item.name} className="comp-store-utility-card rp-card">
                  <div className="rp-card-img-placeholder" />
                  <p className="rp-card-naziv">{item.name}</p>
                  <p className="rp-card-cena">{item.price}</p>
                  <a href="#" className="comp-text-link rp-card-link">Kupi →</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tile 5: Search — dark ── */}
        <section className="rp-tile rp-tile--dark">
          <div className="rp-tile-inner rp-apple-centered">
            <p className="rp-section-label rp-section-label--on-dark">Pretraga</p>
            <h2 className="rp-display-lg">Pronađi šta ti treba.</h2>
            <p className="rp-body rp-apple-search-body">
              Pretraži sav sadržaj Apple prodavnice — od uređaja do pribora i softvera.
            </p>
            <input className="comp-search-input rp-apple-search-input" type="text" placeholder="Pretraži apple.com..." />
          </div>
        </section>

      </>}

      {/* ════════════════════════════════════════════
          CLAUDE
          ════════════════════════════════════════════ */}
      {aktivnaTema === 'claude' && <>

        {/* ── Hero ── centered, "Built for > coders" */}
        <section className="rp-tile rp-tile--light rp-claude-hero">
          <div className="rp-tile-inner rp-claude-hero-inner">
            <div className="rp-claude-status-pill">
              <span className="rp-claude-status-dot" />
              Analiziram...
            </div>
            <h1 className="rp-claude-hero-headline">
              Napravljeno za{' '}
              <span className="rp-claude-coral">&gt;&nbsp;programere</span>
            </h1>
            <p className="rp-claude-hero-body">
              Radite sa Claudom direktno u vašem projektu. Gradite, debagujte i isporučujte iz terminala, IDE-a ili weba. Opišite šta vam treba — Claude obavlja ostatak.
            </p>
            <div className="rp-claude-hero-cta-row">
              <button className="rp-claude-hero-cta-btn">
                Nabavite Claude Code <span className="rp-claude-chevron">▾</span>
              </button>
              <div className="rp-claude-install-cmd">
                <code className="rp-claude-install-code">
                  <span className="rp-claude-cmd-dim">curl -fsSL</span>
                  {' https://claude.ai/install.sh '}
                  <span className="rp-claude-cmd-dim">| bash</span>
                </code>
                <button className="rp-claude-copy-inline" onClick={copyInstallCmd} title="Kopiraj komandu">
                  {copied ? '✓' : '⧉'}
                </button>
              </div>
            </div>
            <p className="rp-claude-or-docs">
              Ili pročitajte <span className="rp-claude-link">dokumentaciju</span>
            </p>
            <div className="rp-claude-logo-strip">
              {['Intercom', 'Spotify', 'ramp', 'PagerDuty', 'Shopify'].map(co => (
                <span key={co} className="rp-claude-logo-name">{co}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="rp-tile rp-tile--light rp-claude-pricing-section">
          <div className="rp-tile-inner">
            <div className="rp-claude-plan-toggle">
              <button className="rp-claude-plan-tab rp-claude-plan-tab--active">Individualni</button>
              <button className="rp-claude-plan-tab">Tim &amp; Enterprise</button>
            </div>
            <div className="rp-claude-pricing-grid">
              {[
                {
                  icon: "⟁",
                  tier: "Pro",
                  desc: "Claude Code je uključen u vaš Pro plan. Idealno za kratke razvojne sprinteve u manjim bazama koda.",
                  price: "$17",
                  period: "Mesečno uz godišnju pretplatu ($200 godišnje). $20 mesečno.",
                },
                {
                  icon: "⟁⟁",
                  tier: "Max 5×",
                  desc: "Claude Code je uključen u vaš Max plan. Odlična vrednost za svakodnevnu upotrebu u većim projektima.",
                  price: "$100",
                  period: "Mesečno",
                },
                {
                  icon: "⟁⟁⟁",
                  tier: "Max 20×",
                  desc: "Još više Claude Code-a u vašem Max planu. Za profesionalce koji žele maksimalan pristup modelima.",
                  price: "$200",
                  period: "Mesečno",
                },
              ].map(plan => (
                <div key={plan.tier} className="rp-claude-plan-card">
                  <span className="rp-claude-plan-icon">{plan.icon}</span>
                  <h3 className="rp-claude-plan-tier">{plan.tier}</h3>
                  <p className="rp-claude-plan-desc">{plan.desc}</p>
                  <p className="rp-claude-plan-price">{plan.price}</p>
                  <p className="rp-claude-plan-period">{plan.period}</p>
                  <button className="rp-claude-plan-cta">Isprobajte Claude</button>
                </div>
              ))}
            </div>
            <p className="rp-claude-pricing-note">Ograničenja upotrebe se primenjuju. Cene ne uključuju porez. Podložno promenama.</p>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="rp-tile rp-tile--light rp-claude-testimonials">
          <div className="rp-tile-inner">
            <h2 className="rp-claude-testimonials-heading">Šta programeri kažu</h2>
            <div className="rp-claude-testimonial-list">
              {[
                {
                  company: "ramp",
                  quote: "Claude Code je dramatično ubrzao efikasnost kodiranja našeg tima. Mogu da pišem EDA kod u notebooku — povlačim podatke, treniram model i evaluiram ga — a zatim tražim od Claude-a da to pretvori u Metaflow pipeline. Ovaj proces štedi 1–2 dana rutinskog rada po modelu.",
                  author: "Anton Biryukov, Staff Software Engineer",
                },
                {
                  company: "Intercom",
                  quote: "Promenilo je način na koji pristupamo refaktorisanju. Ranije bi analiza i pisanje novih testova trajali danima — sa Claude Code-om završimo za sat.",
                  author: "Ciara Murphy, Engineering Lead",
                },
                {
                  company: "Shopify",
                  quote: "Claude razume naš ceo monorepo. Možemo da mu damo kontekst čitavog sistema i on odmah zna koje izmene su bezbedne, a koje zahtevaju pažnju.",
                  author: "Tarik Šabović, Senior Developer",
                },
              ].map((t, i) => (
                <div key={i} className="rp-claude-testimonial-row">
                  <div className="rp-claude-testimonial-company">{t.company}</div>
                  <div className="rp-claude-testimonial-content">
                    <blockquote className="rp-claude-testimonial-quote">"{t.quote}"</blockquote>
                    <p className="rp-claude-testimonial-author">{t.author}</p>
                    <button className="rp-claude-testimonial-btn">Pročitajte priču</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </>}

      {/* ════════════════════════════════════════════
          MASTERCARD
          ════════════════════════════════════════════ */}
      {aktivnaTema === 'mastercard' && <>

        {/* ── Hero ── full-bleed with mastercardhero.avif */}
        <section className="rp-mc-hero-fullbleed">
          <img src="/diplomski/mastercardhero.avif" alt="" className="rp-mc-hero-bg" aria-hidden="true" />
          <div className="rp-mc-deco-circle" aria-hidden="true" />
          <div className="rp-mc-frost-circle" aria-hidden="true" />
          <div className="rp-mc-hero-content">
            <h1 className="rp-mc-hero-headline">
              Dobro došli u{' '}
              <img src="/diplomski/mastercard1.svg" alt="Mastercard" className="rp-mc-hero-logo" />
              <br />priceless svet
            </h1>
            <div className="rp-mc-hero-cta-row">
              <button className="comp-button-primary">Istraži</button>
              <button className="rp-mc-btn-ghost">Saznaj više →</button>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="rp-tile rp-tile--light">
          <div className="rp-tile-inner">
            <div className="rp-mc-stats-bar">
              {[
                { number: "210+",   label: "zemalja i teritorija" },
                { number: "7B+",    label: "korisnika širom sveta" },
                { number: "100M+",  label: "prodajnih mesta" },
                { number: "99.99%", label: "dostupnost mreže" },
              ].map(s => (
                <div key={s.label} className="rp-mc-stat">
                  <p className="rp-mc-stat-number">{s.number}</p>
                  <p className="rp-mc-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services — asymmetric portrait circles ── */}
        <section className="rp-tile rp-tile--light rp-mc-services">
          <div className="rp-mc-ghost-text" aria-hidden="true">USLUGE</div>
          <div className="rp-tile-inner rp-mc-portrait-row">
            <div className="rp-mc-portrait-card">
              <div className="rp-mc-portrait-outer rp-mc-portrait-outer--lg">
                <div className="rp-mc-portrait-circle rp-mc-portrait-circle--lg">
                  <img src="/diplomski/mastercard2.jpeg" alt="Mastercard inovacije" className="rp-mc-portrait-img" />
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• INOVACIJE</p>
              <h3 className="rp-mc-card-title">Tehnologija koja pokreće budućnost finansija.</h3>
            </div>
            <div className="rp-mc-portrait-card rp-mc-portrait-card--offset">
              <div className="rp-mc-portrait-outer rp-mc-portrait-outer--sm">
                <div className="rp-mc-portrait-circle rp-mc-portrait-circle--sm">
                  <img src="/diplomski/mastercard1.svg" alt="Mastercard" className="rp-mc-portrait-img rp-mc-portrait-img--logo" />
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• PLAĆANJE</p>
              <h3 className="rp-mc-card-title">Sigurne transakcije za svaki trenutak.</h3>
            </div>
            <div className="rp-mc-portrait-card">
              <div className="rp-mc-portrait-outer rp-mc-portrait-outer--md">
                <div className="rp-mc-portrait-circle rp-mc-portrait-circle--md rp-mc-portrait-circle--slot">
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• SVAKODNEVNO</p>
              <h3 className="rp-mc-card-title">Plaćajte jednostavno, gde god da ste.</h3>
            </div>
          </div>
        </section>

        {/* ── Kartice i pogodnosti ── headline + oval pill card */}
        <section className="rp-tile rp-tile--light rp-mc-kartice-section">
          <div className="rp-mc-kartice-deco-circle" aria-hidden="true" />
          <div className="rp-tile-inner">
            <div className="rp-mc-kartice-header">
              <p className="rp-mc-eyebrow">• KARTICE I POGODNOSTI</p>
              <h2 className="rp-mc-kartice-headline">
                Pogodnosti i usluge koje<br />podržavaju vaše ambicije
              </h2>
              <p className="rp-mc-kartice-body">
                Pogodnosti, usluge i nagrade, uz kupovnu moć koja vas prati — kod kuće i u pokretu.
              </p>
              <button className="comp-button-primary">Saznajte više</button>
            </div>
            <div className="rp-mc-oval-pill">
              <div className="rp-mc-oval-pill-left">
                <h3 className="rp-mc-oval-pill-title">Pronađite karticu<br />prema vašim potrebama</h3>
                <button className="rp-mc-oval-pill-btn">Saznajte više</button>
              </div>
              <div className="rp-mc-oval-pill-right">
                {/* mastercard3.jpeg — photo of a Mastercard credit/debit card */}
                <div className="rp-mc-img-slot rp-mc-img-slot--card">
                  <span>mastercard3.jpeg</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <section className="rp-mc-dark-footer">
          <div className="rp-tile-inner">
            <h2 className="rp-mc-footer-headline">Uvek smo tu<br />kada nam zatreba.</h2>
            <div className="rp-mc-footer-grid">
              {[
                { col: "Za vas",       links: ["Lična karta", "Debitna kartica", "Prepaid", "Nagrade programa"] },
                { col: "Za firme",     links: ["Poslovne kartice", "B2B plaćanja", "Expense management", "Fraud zaštita"] },
                { col: "Za inovatore", links: ["Mastercard API", "Open Banking", "Digital First", "Sandbox"] },
                { col: "Vesti",        links: ["Newsroom", "Izveštaji", "Istraživanja", "Kontakt"] },
              ].map(({ col, links }) => (
                <div key={col} className="rp-mc-footer-col">
                  <p className="rp-mc-footer-col-heading">{col.toUpperCase()}</p>
                  <ul>
                    {links.map(l => <li key={l}><a href="#">{l} ↗</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </>}

      {/* ════════════════════════════════════════════
          PLAYSTATION
          ════════════════════════════════════════════ */}
      {aktivnaTema === 'playstation' && <>

        {/* Featured game hero */}
        <section className="rp-ps-hero">
          <div className="rp-ps-hero-bg">
            <img src="/diplomski/igrica1.jpg" alt="Yakuza 0" className="rp-ps-hero-img" />
            <div className="rp-ps-hero-overlay" />
          </div>
          <div className="rp-tile-inner rp-ps-hero-content">
            <span className="rp-ps-featured-tag">⭐ Istaknuto</span>
            <h1 className="rp-hero-display">Yakuza<br />0</h1>
            <p className="rp-ps-body">Uputite se u svet Yakuze i svetlucavi Kamurocho 80-ih godina.</p>
            <p className="rp-ps-hero-price">3.999 RSD</p>
            <div className="rp-cta-row">
              <button className="comp-button-primary">Kupi odmah</button>
              <button className="rp-ps-btn-outline">Dodaj u listu želja</button>
            </div>
          </div>
        </section>

        {/* Store — game grid */}
        <section className="rp-tile rp-tile--dark rp-ps-store-section">
          <div className="rp-tile-inner">
            <div className="rp-ps-store-tabs">
              {["Novo", "Najprodavanije", "Besplatno", "Akcija"].map((t, i) => (
                <button key={t} className={`rp-ps-tab${i === 0 ? ' rp-ps-tab--active' : ''}`}>{t}</button>
              ))}
            </div>
            <div className="rp-ps-store-grid">
              {[
                { img: "/diplomski/igrica1.jpg",  title: "Yakuza 0",   tag: "PS5",       price: "3.999 RSD" },
                { img: "/diplomski/igrica2.jpeg", title: "Judgment",  tag: "PS5",       price: "5.999 RSD" },
                { img: "/diplomski/igrica3.png",  title: "Firewatch", tag: "PS4 / PS5", price: "2.999 RSD" },
                { img: null, title: "Elden Ring",           tag: "PS5",       price: "3.499 RSD", slot: "igrica4.jpg" },
                { img: null, title: "GTA V: Enhanced",      tag: "PS5",       price: "1.999 RSD", slot: "igrica5.jpg" },
                { img: null, title: "Resident Evil 4",      tag: "PS4 / PS5", price: "2.499 RSD", slot: "igrica6.jpg" },
              ].map(game => (
                <div key={game.title} className="rp-ps-store-tile">
                  {game.img
                    ? <img src={game.img} alt={game.title} className="rp-ps-store-img" />
                    : <div className="rp-ps-img-slot"><span>{game.slot}</span></div>
                  }
                  <div className="rp-ps-store-info">
                    <span className="rp-ps-badge">{game.tag}</span>
                    <p className="rp-ps-store-title">{game.title}</p>
                    <p className="rp-ps-store-price">{game.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PS Plus tiers */}
        <section className="rp-tile rp-tile--dark rp-ps-plus-section">
          <div className="rp-ps-plus-gold-bar" />
          <div className="rp-tile-inner">
            <p className="rp-section-label rp-section-label--on-dark">PlayStation Plus</p>
            <h2 className="rp-display-lg">Igrajte više,<br />plaćajte manje.</h2>
            <div className="rp-ps-plus-tiers">
              {[
                { name: "Essential", price: "399", features: ["Online multiplayer", "2 mesečne igre", "Ekskluzivni popusti"] },
                { name: "Extra",     price: "699", features: ["Sve iz Essential", "400+ igara iz Kataloga", "Unapred preuzmite igre"], featured: true },
                { name: "Premium",   price: "899", features: ["Sve iz Extra", "Cloud streaming", "PS3 klasici", "Probne verzije igara"] },
              ].map(tier => (
                <div key={tier.name} className={`rp-ps-plus-card${tier.featured ? ' rp-ps-plus-card--featured' : ''}`}>
                  <p className="rp-ps-plus-tier-name">{tier.name}</p>
                  <p className="rp-ps-plus-tier-price"><span>{tier.price}</span> RSD/mes</p>
                  <ul className="rp-ps-plus-features">
                    {tier.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <button className={tier.featured ? 'comp-button-primary' : 'rp-ps-btn-outline rp-ps-btn-outline--on-dark'}>
                    Odaberi
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deals */}
        <section className="rp-tile rp-tile--dark">
          <div className="rp-tile-inner">
            <p className="rp-section-label rp-section-label--on-dark">Akcija nedelje</p>
            <h2 className="rp-display-lg">Do −70% na odabrane naslove.</h2>
            <div className="rp-ps-deals-grid">
              {[
                { img: "/diplomski/igrica2.jpeg", title: "Marvel's Spider-Man 2",  original: "5.999", sale: "2.999", pct: "−50%" },
                { img: "/diplomski/igrica3.png",  title: "Horizon Forbidden West", original: "4.499", sale: "1.799", pct: "−60%" },
                { img: null,                       title: "Elden Ring",             original: "3.499", sale: "1.049", pct: "−70%", slot: "igrica4.jpg" },
              ].map(deal => (
                <div key={deal.title} className="rp-ps-deal-tile">
                  <div className="rp-ps-deal-img-wrap">
                    {deal.img
                      ? <img src={deal.img} alt={deal.title} className="rp-ps-deal-img" />
                      : <div className="rp-ps-img-slot"><span>{deal.slot}</span></div>
                    }
                    <span className="rp-ps-discount-badge">{deal.pct}</span>
                  </div>
                  <p className="rp-ps-deal-title">{deal.title}</p>
                  <p className="rp-ps-deal-prices">
                    <span className="rp-ps-original-price">{deal.original} RSD</span>
                    <span className="rp-ps-sale-price">{deal.sale} RSD</span>
                  </p>
                  <button className="comp-button-primary">Kupi</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="rp-ps-blue-footer">
          <div className="rp-tile-inner">
            <p className="rp-ps-footer-logo">PlayStation</p>
            <div className="rp-ps-footer-grid">
              {[
                { col: "Igre",      links: ["Sve igre", "Novo", "Preporučeno", "Prednarudžbine"] },
                { col: "PS5",       links: ["Konzole", "Kontroleri", "Dodaci", "Headset"] },
                { col: "Pretplate", links: ["PS Plus Essential", "PS Plus Extra", "PS Plus Premium", "Pokloni"] },
                { col: "Podrška",   links: ["Pomoć", "Servis uređaja", "Zajednica", "Kontakt"] },
              ].map(({ col, links }) => (
                <div key={col} className="rp-ps-footer-col">
                  <p className="rp-ps-footer-col-heading">{col.toUpperCase()}</p>
                  <ul>
                    {links.map(l => <li key={l}><a href="#">{l}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </>}

      <footer className="rp-footer">
        <p className="rp-footer-text">Mirko Popović · 2026</p>
        <button className="rp-footer-back" onClick={() => navigate(-1)}>← Nazad na portfolio</button>
      </footer>

    </div>
  );
}
