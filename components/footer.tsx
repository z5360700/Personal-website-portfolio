import Link from "next/link"
import { Frame } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-6">
            <Frame className="w-6 h-6" />
            <span>Portfolio</span>
          </Link>

          <div className="text-foreground/60 text-sm">
            <p>© 2025 Michael Lo Russo. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
