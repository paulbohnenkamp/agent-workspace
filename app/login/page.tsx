import Link from 'next/link';

import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <main className="landing-page">
      <div className="landing-card auth-card">
        <span className="eyebrow">Agent Workspace Platform</span>
        <h1>Sign in to your workspace.</h1>
        <p>Use an account with project membership to open an authorized workspace.</p>
        <LoginForm />
        <Link className="text-link" href="/">Return to overview</Link>
      </div>
    </main>
  );
}
