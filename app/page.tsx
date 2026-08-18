import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing-page">
      <div className="landing-card">
        <span className="eyebrow">Agent Workspace Platform</span>
        <h1>Operational workspaces for human and agent collaboration.</h1>
        <p>Open the dynamic land workspace to explore the first Next.js-backed vertical slice.</p>
        <Link className="button button-primary" href="/land/land-portfolio?matterId=portfolio-001">
          Open Land Workspace
        </Link>
      </div>
    </main>
  );
}
