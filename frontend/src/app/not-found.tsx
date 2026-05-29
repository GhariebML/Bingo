import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center space-y-8 animate-fade-in">
      <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-surface shadow-soft">
        <Image 
          src="/Bingoo/Bingoo-calm.png" 
          alt="Bingoo looking lost but calm" 
          fill 
          className="object-cover"
        />
      </div>
      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-4xl font-extrabold text-textPrimary">404</h1>
        <h2 className="text-xl font-bold text-textSecondary">You've ventured into unknown waters</h2>
        <p className="text-sm text-muted leading-relaxed">
          The page you are looking for doesn't exist, but it's okay to take a pause here before heading back.
        </p>
      </div>
      <Link href="/">
        <Button className="px-8">
          Return home
        </Button>
      </Link>
    </div>
  );
}
