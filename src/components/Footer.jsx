import { X as Twitter, MessageCircle, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-16 px-10 border-t border-border bg-background text-center">
      <h3 className="text-2xl font-black italic text-primary uppercase mb-6 tracking-tighter">
        Giganticboost
      </h3>
      
      <div className="flex justify-center gap-6 text-muted-foreground mb-8">
        {/* 'Twitter' now refers to the 'X' icon we imported above */}
        <Twitter className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
        <MessageCircle className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
        <Mail className="w-6 h-6 hover:text-primary cursor-pointer transition-colors" />
      </div>

      <div className="pt-8 border-t border-border/50 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">
        &copy; {new Date().getFullYear()} Giganticboost. All rights reserved.
      </div>
    </footer>
  );
}