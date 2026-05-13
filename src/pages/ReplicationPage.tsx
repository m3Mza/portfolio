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
    navigator.clipboard.writeText('npm install -g @anthropic-ai/claude-code');
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

        {/* ── Tile 1: iPhone hero — dark ── */}
        <section className="rp-tile rp-tile--dark rp-apple-hero-tile">
          <div className="rp-tile-inner rp-apple-centered">
            <p className="rp-overline">Novo</p>
            <h1 className="rp-hero-display">iPhone 17 Pro.</h1>
            <p className="rp-lead">Titanijum. Jak kao i ikad.</p>
            <div className="rp-cta-row rp-cta-row--center">
              <button className="comp-button-primary">Saznaj više</button>
              <button className="comp-button-secondary-pill">Kupi</button>
            </div>
            <img src="/diplomski/apple1.jpg" alt="iPhone 17 Pro" className="rp-apple-render" />
          </div>
        </section>

        {/* ── Tile 2: MacBook Air — white ── */}
        <section className="rp-tile rp-tile--light">
          <div className="rp-tile-inner rp-apple-centered">
            <h2 className="rp-display-lg">MacBook Air.</h2>
            <p className="rp-lead">Lagan. Moćan. Nezaustavljiv.</p>
            <div className="rp-cta-row rp-cta-row--center">
              <button className="comp-button-primary">Saznaj više</button>
              <button className="comp-button-secondary-pill">Kupi</button>
            </div>
            <img src="/diplomski/apple2.jpeg" alt="MacBook Air" className="rp-apple-render" />
          </div>
        </section>

        {/* ── Tile 3: Apple Store — parchment ── */}
        <section className="rp-tile rp-tile--parchment">
          <div className="rp-tile-inner rp-apple-centered">
            <p className="rp-section-label">Apple prodavnica</p>
            <h2 className="rp-display-lg">Pronađi pravi uređaj za tebe.</h2>
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
                { name: "MacBook Air M3", price: "Od 129.990 din." },
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

        {/* ── Tile 4: Search — dark ── */}
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

        {/* Hero */}
        <section className="rp-tile rp-tile--light rp-claude-hero">
          <div className="rp-tile-inner rp-claude-hero-inner">
            <div className="rp-claude-hero-copy">
              <span className="rp-badge-pill">Claude 4 · Anthropic</span>
              <h1 className="rp-hero-display">Razgovarajte.<br />Istražujte.<br />Gradite.</h1>
              <p className="rp-claude-body">
                Claude je AI asistent koji razume kontekst, vodi smislene razgovore i pomaže vam da razmišljate jasnije — od jednostavnih pitanja do složenih projekata.
              </p>
              <div className="rp-cta-row">
                <button className="comp-button-primary">Razgovarajte sa Claudom</button>
                <button className="comp-button-secondary-pill">API pristup</button>
              </div>
            </div>
            <div className="rp-claude-hero-img-wrap">
              <img src="/diplomski/claude1.jpeg" alt="Claude interfejs" className="rp-claude-img--hero" />
            </div>
          </div>
        </section>

        {/* Claude Code — terminal install */}
        <section className="rp-tile rp-tile--dark rp-claude-product-section">
          <div className="rp-tile-inner rp-claude-product-inner">
            <div className="rp-claude-product-copy">
              <p className="rp-overline">Claude Code</p>
              <h2 className="rp-display-lg">Vaš AI partner za razvoj softvera.</h2>
              <p className="rp-lead-airy">
                Claude Code razume čitave baze koda, predlaže refaktorisanja i piše testove — direktno iz terminala.
              </p>
              <div className="rp-claude-terminal">
                <span className="rp-claude-terminal-cmd">
                  <span className="rp-claude-terminal-prompt">$</span>
                  {' npm install -g @anthropic-ai/claude-code'}
                </span>
                <button className="rp-claude-copy-btn" onClick={copyInstallCmd}>
                  {copied ? '✓ Kopirano' : 'Kopiraj'}
                </button>
              </div>
              <div className="rp-cta-row">
                <button className="comp-button-primary">Isprobaj Claude Code</button>
                <button className="comp-button-secondary-pill rp-claude-btn-ghost">Dokumentacija</button>
              </div>
            </div>
            <div className="rp-claude-code-img-wrap">
              <img src="/diplomski/claude2.png" alt="Claude Code" className="rp-claude-img--code" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rp-tile rp-tile--parchment">
          <div className="rp-tile-inner">
            <p className="rp-claude-overline">Mogućnosti</p>
            <h2 className="rp-display-lg">Šta Claude može da uradi za vas.</h2>
            <div className="rp-feature-card-grid">
              {[
                { icon: "✦", title: "Pisanje i kreativnost",  desc: "Pomaže vam da pišete bolje — od e-pošte do eseja, od koda do pesme." },
                { icon: "⟳", title: "Analiza i istraživanje", desc: "Razume složene dokumente, sumira informacije i daje jasne uvide." },
                { icon: "◈", title: "Kod i tehnika",          desc: "Piše, objašnjava i debuguje kod na svim popularnim programskim jezicima." },
              ].map(card => (
                <div key={card.title} className="rp-feature-card">
                  <span className="rp-feature-icon">{card.icon}</span>
                  <h3 className="rp-feature-title">{card.title}</h3>
                  <p className="rp-feature-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="rp-tile rp-tile--light">
          <div className="rp-tile-inner">
            <p className="rp-claude-overline">Planovi</p>
            <h2 className="rp-display-lg">Odaberite plan koji vam odgovara.</h2>
            <div className="rp-claude-pricing-grid">
              {[
                {
                  tier: "Besplatno", price: "$0", period: "zauvek",
                  features: ["Pristup Claude 3.5 Haiku", "Ograničen broj poruka dnevno", "Web i mobilna aplikacija", "Osnovna analiza fajlova"],
                  cta: "Počni besplatno", featured: false,
                },
                {
                  tier: "Pro", price: "$20", period: "mesečno",
                  features: ["Pristup Claude 4 Opus", "5× više poruka od besplatnog", "Projects & Memory", "Prioritetni pristup u gužvi", "Claude Code uključen"],
                  cta: "Počni Pro", featured: true,
                },
                {
                  tier: "Tim", price: "$30", period: "po korisniku",
                  features: ["Sve iz Pro plana", "Timska radna soba", "Admin konzola", "SSO integracija", "Prioritetna podrška"],
                  cta: "Kontaktirajte nas", featured: false,
                },
              ].map(plan => (
                <div key={plan.tier} className={`rp-claude-pricing-card${plan.featured ? ' rp-claude-pricing-card--featured' : ''}`}>
                  <p className="rp-claude-pricing-tier">{plan.tier}</p>
                  <p className="rp-claude-pricing-price">
                    <span className="rp-claude-pricing-amount">{plan.price}</span>
                    <span className="rp-claude-pricing-period"> / {plan.period}</span>
                  </p>
                  <ul className="rp-claude-pricing-features">
                    {plan.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  <button className={plan.featured ? 'comp-button-primary' : 'comp-button-secondary-pill'}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="rp-claude-cta-band">
          <div className="rp-tile-inner rp-claude-cta-inner">
            <h2 className="rp-cta-band-headline">Počnite da razmišljate<br />zajedno sa Claudom danas.</h2>
            <button className="comp-button-secondary-pill rp-claude-cta-btn">Kreirajte nalog besplatno</button>
          </div>
        </section>

      </>}

      {/* ════════════════════════════════════════════
          MASTERCARD
          ════════════════════════════════════════════ */}
      {aktivnaTema === 'mastercard' && <>

        {/* Hero */}
        <section className="rp-tile rp-tile--light rp-mc-hero">
          <div className="rp-tile-inner">
            <p className="rp-mc-eyebrow">• MASTERCARD</p>
            <h1 className="rp-hero-display">Bezbedno.<br />Brzo. Svuda.</h1>
            <p className="rp-body rp-mc-lead">
              Mastercard povezuje ljude, firme i vlade — omogućavajući sigurne transakcije u više od 210 zemalja i teritorija.
            </p>
            <button className="comp-button-primary">Istraži</button>
          </div>
          <div className="rp-mc-stadium-wrap">
            <img src="/diplomski/mastercard2.jpeg" alt="Mastercard" className="rp-mc-stadium-img" />
          </div>
        </section>

        {/* Stats bar */}
        <section className="rp-tile rp-tile--light">
          <div className="rp-tile-inner">
            <div className="rp-mc-stats-bar">
              {[
                { number: "210+",  label: "zemalja i teritorija" },
                { number: "7B+",   label: "korisnika širom sveta" },
                { number: "100M+", label: "prodajnih mesta" },
                { number: "99.99%",label: "dostupnost mreže" },
              ].map(s => (
                <div key={s.label} className="rp-mc-stat">
                  <p className="rp-mc-stat-number">{s.number}</p>
                  <p className="rp-mc-stat-label">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="rp-tile rp-tile--light rp-mc-services">
          <div className="rp-mc-ghost-text" aria-hidden="true">USLUGE</div>
          <div className="rp-tile-inner rp-mc-portrait-row">
            <div className="rp-mc-portrait-card">
              <div className="rp-mc-portrait-outer">
                <div className="rp-mc-portrait-circle">
                  <img src="/diplomski/mastercard1.svg" alt="Mastercard logo" className="rp-mc-portrait-img rp-mc-portrait-img--logo" />
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• PLAĆANJE</p>
              <h3 className="rp-mc-card-title">Sigurne transakcije za svaki trenutak.</h3>
            </div>
            <div className="rp-mc-portrait-card">
              <div className="rp-mc-portrait-outer">
                <div className="rp-mc-portrait-circle">
                  <img src="/diplomski/mastercard2.jpeg" alt="Mastercard usluge" className="rp-mc-portrait-img" />
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• INOVACIJE</p>
              <h3 className="rp-mc-card-title">Tehnologija koja pokreće budućnost finansija.</h3>
            </div>
            <div className="rp-mc-portrait-card">
              <div className="rp-mc-portrait-outer">
                <div className="rp-mc-portrait-circle rp-mc-portrait-circle--slot">
                  {/* mastercard3.jpeg — lifestyle photo: person tapping card/phone */}
                </div>
                <button className="rp-mc-satellite" aria-label="Istraži">→</button>
              </div>
              <p className="rp-mc-eyebrow">• SVAKODNEVNO</p>
              <h3 className="rp-mc-card-title">Plaćajte jednostavno, gde god da ste.</h3>
            </div>
          </div>
        </section>

        {/* Innovation — dark split */}
        <section className="rp-mc-dark-footer rp-mc-innovation">
          <div className="rp-tile-inner rp-mc-innovation-inner">
            <div className="rp-mc-innovation-copy">
              <p className="rp-mc-eyebrow rp-mc-eyebrow--light">• BEZBEDNOST</p>
              <h2 className="rp-mc-footer-headline">Bezbednost koja štiti<br />svaku transakciju.</h2>
              <p className="rp-mc-innovation-body">
                Veštačka inteligencija i napredna kriptografija štite više od 143 miliona transakcija svake sekunde — nevidljivo, neprekidno.
              </p>
              <div className="rp-mc-innovation-tags">
                {["Tokenizacija", "3D Secure", "Biometrija", "AI zaštita"].map(t => (
                  <span key={t} className="rp-mc-tag">{t}</span>
                ))}
              </div>
            </div>
            <div className="rp-mc-innovation-img-wrap">
              {/* mastercard4.jpeg — abstract tech / circuit / data visualization */}
              <div className="rp-mc-img-slot rp-mc-img-slot--innovation">
                <span>mastercard4.jpeg</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
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
