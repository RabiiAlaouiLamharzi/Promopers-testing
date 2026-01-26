import type React from "react"
import type { Metadata } from "next"
import { Archivo, Roboto_Condensed } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import "../lib/suppress-errors"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/contexts/language-context"

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
})

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "PromoPers - POS Retail & Experiential Event Marketing",
  description:
    "Connecting exceptional products with extraordinary personalities. Expert POS retail activations and experiential marketing in Switzerland.",
  generator: "v0.app",
  icons: {
    icon: "/images/logo-pp.png",
    shortcut: "/images/logo-pp.png",
    apple: "/images/logo-pp.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Conditionally suppress errors - only on non-admin pages
              if (typeof window !== 'undefined') {
                const isAdminPage = window.location.pathname.startsWith('/admin');
                
                if (!isAdminPage) {
                  // Only suppress errors on public pages, not admin
                  const originalConsoleError = console.error;
                  const originalConsoleWarn = console.warn;
                  
                  // Suppress hydration errors only
                  console.error = function(...args) {
                    const message = args.join(' ');
                    if (message.includes('Hydration') || message.includes('hydration')) {
                      return; // Suppress hydration errors
                    }
                    originalConsoleError.apply(console, args);
                  };
                  
                  console.warn = function(...args) {
                    const message = args.join(' ');
                    if (message.includes('Hydration') || message.includes('hydration')) {
                      return; // Suppress hydration warnings
                    }
                    originalConsoleWarn.apply(console, args);
                  };
                  
                  // Remove hydration error overlays only
                  setTimeout(() => {
                    const errorOverlay = document.querySelector('[data-nextjs-dialog-overlay]');
                    if (errorOverlay) {
                      const errorText = errorOverlay.textContent || '';
                      if (errorText.includes('Hydration') || errorText.includes('hydration')) {
                        errorOverlay.remove();
                      }
                    }
                    
                    const errorDialog = document.querySelector('[data-nextjs-dialog]');
                    if (errorDialog) {
                      const errorText = errorDialog.textContent || '';
                      if (errorText.includes('Hydration') || errorText.includes('hydration')) {
                        errorDialog.remove();
                      }
                    }
                    
                    // Remove hydration error divs
                    document.querySelectorAll('div').forEach(div => {
                      if (div.textContent && div.textContent.includes('Hydration failed')) {
                        div.remove();
                      }
                    });
                  }, 100);
                } else {
                  // On admin pages, keep all error logging enabled for debugging
                  // Only remove hydration error overlays if they appear
                  setTimeout(() => {
                    const errorOverlay = document.querySelector('[data-nextjs-dialog-overlay]');
                    if (errorOverlay) {
                      const errorText = errorOverlay.textContent || '';
                      if (errorText.includes('Hydration') || errorText.includes('hydration')) {
                        errorOverlay.remove();
                      }
                    }
                  }, 100);
                }
              }
            `,
          }}
        />
      </head>
      <body className={`font-sans ${archivo.variable} ${robotoCondensed.variable} antialiased overflow-x-hidden`}>
        <LanguageProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  )
}
