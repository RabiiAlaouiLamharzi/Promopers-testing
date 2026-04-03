"use client"

import { useLanguage } from "@/contexts/language-context"
import { Language } from "@/lib/i18n"

const services: Record<Language, { title: string; subtitle: string }[]> = {
  en: [
    { title: "People Services", subtitle: "Staff for Sampling & Events" },
    { title: "Event Logistics", subtitle: "Setup, Troubleshooting & Breakdown" },
    { title: "Shopper Services", subtitle: "Merchandising, Sales Promotions & Tastings" },
    { title: "Warehousing", subtitle: "Storage & Fulfillment" },
  ],
  de: [
    { title: "People Services", subtitle: "Personal für Sampling & Events" },
    { title: "Event-Logistik", subtitle: "Aufbau, Troubleshooting & Abbau" },
    { title: "Shopper Services", subtitle: "Merchandising, Sales Promotions & Degustationen" },
    { title: "Lagerhaltung", subtitle: "Lagerung & Fulfillment" },
  ],
  fr: [
    { title: "Services aux Personnes", subtitle: "Personnel pour Sampling & Événements" },
    { title: "Logistique Événementielle", subtitle: "Montage, Dépannage & Démontage" },
    { title: "Services Shoppers", subtitle: "Merchandising, Promotions des ventes & Dégustations" },
    { title: "Entreposage", subtitle: "Stockage & Fulfillment" },
  ],
  it: [
    { title: "Servizi per Persone", subtitle: "Personale per Sampling & Eventi" },
    { title: "Logistica Eventi", subtitle: "Allestimento, Troubleshooting & Smontaggio" },
    { title: "Servizi Shopper", subtitle: "Merchandising, Promozioni Vendite & Degustazioni" },
    { title: "Magazzinaggio", subtitle: "Stoccaggio & Fulfillment" },
  ],
}

export function ServicesSection() {
  const { language } = useLanguage()
  const items = services[language] ?? services.en

  return (
    <section className="w-full bg-white mb-32">
      <div className="grid grid-cols-1 md:grid-cols-2" style={{ borderTop: "1px solid #E6B526" }}>
        {items.map((item, i) => (
          <div
            key={i}
            className="group flex flex-col items-center justify-center text-center gap-2 px-8 md:px-12 py-16 cursor-default select-none transition-colors duration-200 hover:bg-[#E6B526]/10"
            style={{
              borderBottom: "1px solid #E6B526",
              borderRight: i % 2 === 0 ? "1px solid #E6B526" : "none",
            }}
          >
            {/* Arrow icon */}
            <span
              className="text-[#E6B526] text-3xl transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden
            >
              ↗
            </span>

            {/* Text */}
            <span className="text-[#002855] text-3xl md:text-5xl font-black leading-tight uppercase">
              {item.title}
            </span>
            <span className="text-[#002855]/55 text-lg md:text-xl font-normal leading-snug italic">
              {item.subtitle}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
