export function Footer() {
 return (
 <footer className="border-t border-border bg-background backdrop-blur-sm py-8 text-center text-xs tracking-wide text-muted">
 <div className="mx-auto max-w-6xl px-4">
 <p className="font-semibold text-textPrimary/85">Bingo · Gentle Support for Calming Steps</p>
 <p className="mt-2 leading-5 max-w-xl mx-auto text-muted/85">
 Bingo is a safe, AI-assisted self-reflection tool for emotional support.
 It is not a therapy, medical, or clinical service. In case of emergency or immediate risk, please seek professional crisis support.
 </p>
 <p className="mt-4 text-[10px] text-slate-400">
 © {new Date().getFullYear()} Bingo. All rights reserved. Made with care for wellness.
 </p>
 </div>
 </footer>
 );
}
