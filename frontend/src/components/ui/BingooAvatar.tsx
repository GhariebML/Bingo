import Image from 'next/image';

export function BingooAvatar({ size = 48 }: { size?: number }) {
 return (
 <Image
 alt="Bingoo character"
 className="rounded-full border-2 border-border object-cover shadow-soft"
 height={size}
 src="/Bingoo/Bingoo-avatar.png"
 width={size}
 />
 );
}
