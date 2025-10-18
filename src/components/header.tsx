import { BrandMaestroLogo } from '@/components/icons';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center">
          <BrandMaestroLogo className="h-8 w-8 text-primary" />
          <h1 className="ml-3 text-2xl font-bold font-headline tracking-tight">
            Brand Maestro
          </h1>
        </Link>
      </div>
    </header>
  );
}
