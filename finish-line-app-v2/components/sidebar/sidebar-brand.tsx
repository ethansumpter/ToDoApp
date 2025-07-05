import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarBrandProps {
  href?: string;
  className?: string;
}

export function SidebarBrand({ href = "/dashboard", className }: SidebarBrandProps) {
  return (
    <div className={cn("flex h-16 items-center border-b px-6", className)}>
      <Link href={href} className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-sm font-bold">FL</span>
        </div>
        <span className="text-lg font-semibold">Finish Line</span>
      </Link>
    </div>
  );
}
