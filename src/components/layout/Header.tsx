import { Compass } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
            <a className="flex items-center gap-2" href="/">
                <Compass className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold font-headline text-primary">
                    Skills Compass
                </h1>
            </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
