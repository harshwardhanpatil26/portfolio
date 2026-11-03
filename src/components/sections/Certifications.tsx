import { CERTIFICATIONS } from "@/lib/data";
import SectionHead from "../ui/SectionHead";

const issuers = [...new Set(CERTIFICATIONS.map((c) => c.issuer))];

export default function Certifications() {
  return (
    <section id="certifications" className="section certs" aria-labelledby="certs-title">
      <style>{css}</style>
      <div className="wrap certs-grid">
        <div className="certs-head">
          <SectionHead index="04" label="Certifications" title="Always" accent="learning." id="certs-title" />
          <p className="certs-count mono rv">
            {CERTIFICATIONS.length} certificates · {issuers.length} issuers
          </p>
        </div>
        <ol className="certs-list">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.title + c.issuer} className="rv" style={{ "--i": i % 4 } as React.CSSProperties}>
              <div className="cert" tabIndex={0}>
                <span className="mono">{String(i + 1).padStart(2, "0")}</span>
                <span className="cert-title">{c.title}</span>
                <span className="cert-issuer">{c.issuer}</span>
                <span className="cert-arrow" aria-hidden="true">
                  ↗
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const css = `
.certs{background:var(--card);border-block:1px solid var(--line)}
.certs-grid{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:clamp(32px,5vw,80px);align-items:start}
.certs-head{position:sticky;top:120px}
.certs-count{color:var(--mute);margin-top:22px}
.certs-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.certs-list li{border-bottom:1px solid var(--line)}
.cert{position:relative;display:grid;grid-template-columns:44px minmax(0,1fr) auto 24px;align-items:center;gap:16px;padding:22px 16px;overflow:hidden;isolation:isolate;border-radius:0;transition:color .5s var(--ease)}
.cert::before{content:"";position:absolute;inset:0;z-index:-1;background:var(--ink);transform:scaleX(0);transform-origin:0 50%;transition:transform .7s var(--ease)}
.cert:hover::before,.cert:focus-visible::before{transform:scaleX(1)}
.cert:hover,.cert:focus-visible{color:#fff}
.cert:focus-visible{outline-offset:-2px}
.cert .mono{color:var(--mute);transition:color .5s var(--ease)}
.cert:hover .mono,.cert:focus-visible .mono,.cert:hover .cert-issuer,.cert:focus-visible .cert-issuer{color:rgba(255,255,255,.65)}
.cert-title{font-weight:600;font-size:clamp(18px,1.7vw,24px);letter-spacing:-.03em}
.cert-issuer{color:var(--mute);font-size:14px;text-align:right;transition:color .5s var(--ease)}
.cert-arrow{opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .6s var(--ease)}
.cert:hover .cert-arrow,.cert:focus-visible .cert-arrow{opacity:1;transform:none}
@media (max-width:860px){
  .certs-grid{grid-template-columns:minmax(0,1fr)}
  .certs-head{position:static}
  .cert{grid-template-columns:36px minmax(0,1fr) 20px;gap:4px 12px;padding:18px 8px}
  .cert-issuer{grid-column:2;grid-row:2;text-align:left;font-size:13px}
  .cert-arrow{grid-column:3;grid-row:1}
}
`;
