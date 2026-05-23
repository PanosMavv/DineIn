import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export default function Logo({ size = "md" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <Link href="/" className={`font-bold tracking-tight ${sizes[size]}`}>
      <span className="text-black-400">Dine</span>
      <span className="text-gray-400">.</span>
      <span className="text-orange-400">In</span>
    </Link>
  );
}