"use client";

import { useState } from "react";

type MenuItem = {
  id: string;
  label: string;
  icon: "chart" | "cart" | "map" | "palette" | "doc" | "calendar" | "code" | "components";
  badge?: string;
  children?: { id: string; label: string }[];
};

const MENU: MenuItem[] = [
  {
    id: "components",
    label: "Components",
    icon: "components",
    badge: "🔥",
    children: [
      { id: "grid", label: "Grid" },
      { id: "layout", label: "Layout" },
      { id: "forms", label: "Forms" },
    ],
  },
  { id: "charts", label: "Charts", icon: "chart" },
  { id: "ecommerce", label: "E-commerce", icon: "cart" },
  { id: "maps", label: "Maps", icon: "map" },
  { id: "theme", label: "Theme", icon: "palette" },
  { id: "documentation", label: "Documentation", icon: "doc" },
  { id: "calendar", label: "Calendar", icon: "calendar" },
  { id: "examples", label: "Examples", icon: "code" },
];

function MenuIcon({ type }: { type: MenuItem["icon"] }) {
  const cls = "pro-demo-icon";
  switch (type) {
    case "components":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M4 20V10M10 20V4M16 20v-6M22 20H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M6 6h15l-1.5 9h-12L6 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="9" cy="20" r="1" fill="currentColor" />
          <circle cx="18" cy="20" r="1" fill="currentColor" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      );
    case "palette":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M12 3a9 9 0 1 0 9 9c0-1.5-1.5-2-3-1.5-.8.3-1.2 1.2-1 2 .2 1 1.5 1.5 3 1a9 9 0 0 0-8-10.5Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "doc":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M8 4h8l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
          <path d="M16 4v4h4M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <rect x="4" y="5" width="16" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={cls} aria-hidden>
          <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function ProSidebarExample() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ components: true });
  const [activeId, setActiveId] = useState("grid");

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="pro-demo">
      {sidebarOpen ? (
        <button
          type="button"
          className="pro-demo-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside className={`pro-demo-sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="pro-demo-sidebar-bg" aria-hidden>
          <img src="/pro-sidebar-bg.png" alt="" className="pro-demo-sidebar-bg-img" />
          <div className="pro-demo-sidebar-bg-tint" />
        </div>

        <div className="pro-demo-sidebar-content">
          <h1 className="pro-demo-logo">PRO SIDEBAR</h1>

          <nav className="pro-demo-nav">
            <ul className="pro-demo-menu">
              {MENU.map((item) => {
                const isExpanded = expanded[item.id] ?? false;
                const hasChildren = Boolean(item.children?.length);

                return (
                  <li key={item.id} className="pro-demo-menu-group">
                    <button
                      type="button"
                      className={`pro-demo-menu-item${hasChildren && isExpanded ? " is-expanded" : ""}`}
                      onClick={() => {
                        if (hasChildren) {
                          toggle(item.id);
                        } else {
                          setActiveId(item.id);
                          setSidebarOpen(false);
                        }
                      }}
                    >
                      <MenuIcon type={item.icon} />
                      <span className="pro-demo-menu-label">{item.label}</span>
                      {item.badge ? <span className="pro-demo-menu-badge">{item.badge}</span> : null}
                      {hasChildren ? (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          className={`pro-demo-chevron${isExpanded ? " is-up" : ""}`}
                          aria-hidden
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      ) : null}
                    </button>

                    {hasChildren && isExpanded ? (
                      <ul className="pro-demo-submenu">
                        {item.children!.map((child) => (
                          <li key={child.id}>
                            <button
                              type="button"
                              className={`pro-demo-submenu-item${activeId === child.id ? " is-active" : ""}`}
                              onClick={() => {
                                setActiveId(child.id);
                                setSidebarOpen(false);
                              }}
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <footer className="pro-demo-sidebar-footer">Sidebar footer</footer>
        </div>
      </aside>

      <main className="pro-demo-main">
        <div className="pro-demo-main-card">
          <button
            type="button"
            className="pro-demo-hamburger"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <article className="pro-demo-article">
            <h2 className="pro-demo-title">Pro Sidebar</h2>
            <p className="pro-demo-lead">
              Responsive layout with advanced sidebar menu built with{" "}
              <strong>SCSS</strong> and <strong>vanilla Javascript</strong>.
            </p>

            <p className="pro-demo-github">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                Full code on GitHub
              </a>
            </p>

            <div className="pro-demo-badges">
              <span className="pro-demo-badge">★ 1.2k</span>
              <span className="pro-demo-badge">⑂ 312</span>
            </div>

            <section className="pro-demo-section">
              <h3 className="pro-demo-section-title">Features</h3>
              <ul className="pro-demo-list">
                <li>Responsive layout with collapsible sidebar</li>
                <li>Multi-level navigation menu with expand / collapse</li>
                <li>Custom scrollbar styling</li>
                <li>Built with SCSS and vanilla JavaScript</li>
                <li>Easy to customize and integrate</li>
              </ul>
            </section>

            <section className="pro-demo-section">
              <h3 className="pro-demo-section-title">Resources</h3>
              <ul className="pro-demo-list">
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GitHub repository
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    Live demo
                  </a>
                </li>
              </ul>
            </section>
          </article>

          <footer className="pro-demo-page-footer">
            <p className="pro-demo-copyright">© 2022 made with ❤️ by — Pro Sidebar</p>
            <div className="pro-demo-social">
              <a href="https://github.com" className="pro-demo-social-btn" target="_blank" rel="noopener noreferrer">
                GitHub <span>1.2k</span>
              </a>
              <a href="https://twitter.com" className="pro-demo-social-btn" target="_blank" rel="noopener noreferrer">
                Twitter <span>890</span>
              </a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
