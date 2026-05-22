import Image from 'next/image';

export function BingoAvatar({ size = 48 }: { size?: number }) {
 return (
 <Image
 alt="Bingo character"
 className="rounded-full border-2 border-border object-cover shadow-soft"
 height={size}
 src="/bingo/bingo-avatar.png"
 width={size}
 />
 );
}
