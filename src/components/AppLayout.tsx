import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
