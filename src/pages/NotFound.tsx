import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import { profile } from '../data/profile';

/** Any address that isn't a page: say so plainly and point home, instead of an empty screen */
export default function NotFound() {
  useEffect(() => {
    const previous = document.title;
    document.title = `Page not found — ${profile.name}`;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] md:px-8">
        <div className="mx-auto max-w-6xl">
          <Logo variant="plain" href="/" />
        </div>
      </header>

      <main className="flex min-h-[100svh] flex-col items-center justify-center px-4 text-center">
        <p className="label text-muted">Error 404</p>
        <h1 className="display text-outline mt-6 text-[clamp(7rem,34vw,15rem)]">404</h1>
        <p className="mt-6 max-w-sm text-lg text-muted">
          This page doesn&rsquo;t exist. It may have moved, or the link has a typo.
        </p>
        <Link to="/" className="btn btn-primary mt-10">
          Back to home
        </Link>
      </main>
    </>
  );
}
