import fs from 'fs'
import path from 'path'

// Hardcoded testimonials from the component
const testimonialsData = [
  {
    author: "Sarah Müller",
    position: "Marketing Director, Nestlé Switzerland",
    quote: "Working with PromoPers was a game-changer for our brand. Their team understood our vision perfectly and delivered creative, high-quality retail activations that exceeded our expectations. Our brand recognition and customer engagement have significantly improved thanks to their expertise and attention to detail.",
    image: "/professional-woman-executive.png",
    authorImage: "/professional-woman-portrait.png",
    order: 0,
    translations: {
      fr: {
        quote: "Travailler avec PromoPers a été un changement de jeu pour notre marque. Leur équipe a parfaitement compris notre vision et a livré des activations retail créatives et de haute qualité qui ont dépassé nos attentes. Notre reconnaissance de marque et l'engagement client se sont considérablement améliorés grâce à leur expertise et leur attention aux détails.",
        position: "Directrice Marketing, Nestlé Suisse"
      },
      de: {
        quote: "Die Zusammenarbeit mit PromoPers war ein Wendepunkt für unsere Marke. Ihr Team verstand unsere Vision perfekt und lieferte kreative, hochwertige Retail-Aktivierungen, die unsere Erwartungen übertrafen. Unsere Markenbekanntheit und das Kundenengagement haben sich dank ihrer Expertise und Aufmerksamkeit für Details erheblich verbessert.",
        position: "Marketingdirektorin, Nestlé Schweiz"
      },
      it: {
        quote: "Lavorare con PromoPers è stato un punto di svolta per il nostro brand. Il loro team ha compreso perfettamente la nostra visione e ha fornito attivazioni retail creative e di alta qualità che hanno superato le nostre aspettative. Il riconoscimento del nostro brand e l'engagement dei clienti sono migliorati significativamente grazie alla loro competenza e attenzione ai dettagli.",
        position: "Direttore Marketing, Nestlé Svizzera"
      }
    }
  },
  {
    author: "Michael Weber",
    position: "Brand Manager, Lindt & Sprüngli",
    quote: "PromoPers transformed our retail presence completely. Their strategic approach to POS activations and their ability to connect with consumers at the point of sale is unmatched. The results speak for themselves - we've seen a 40% increase in sales during their campaigns.",
    image: "/professional-man-creative-director-portrait.jpg",
    authorImage: "/professional-man-portrait.png",
    order: 1,
    translations: {
      fr: {
        quote: "PromoPers a complètement transformé notre présence retail. Leur approche stratégique des activations POS et leur capacité à se connecter avec les consommateurs au point de vente sont inégalées. Les résultats parlent d'eux-mêmes - nous avons vu une augmentation de 40% des ventes pendant leurs campagnes.",
        position: "Responsable de Marque, Lindt & Sprüngli"
      },
      de: {
        quote: "PromoPers hat unsere Retail-Präsenz vollständig transformiert. Ihr strategischer Ansatz für POS-Aktivierungen und ihre Fähigkeit, sich mit Verbrauchern am Verkaufspunkt zu verbinden, ist unübertroffen. Die Ergebnisse sprechen für sich - wir haben während ihrer Kampagnen einen Umsatzanstieg von 40% verzeichnet.",
        position: "Markenmanager, Lindt & Sprüngli"
      },
      it: {
        quote: "PromoPers ha trasformato completamente la nostra presenza retail. Il loro approccio strategico alle attivazioni POS e la loro capacità di connettersi con i consumatori nel punto vendita sono senza pari. I risultati parlano da soli - abbiamo visto un aumento del 40% delle vendite durante le loro campagne.",
        position: "Brand Manager, Lindt & Sprüngli"
      }
    }
  },
  {
    author: "Anna Schmidt",
    position: "Head of Marketing, Samsung Switzerland",
    quote: "The level of professionalism and creativity that PromoPers brings to experiential marketing is exceptional. They don't just execute campaigns - they create memorable brand experiences that drive real business results. Highly recommended for any brand looking to make an impact.",
    image: "/professional-woman-designer.png",
    authorImage: "/professional-woman-portrait.png",
    order: 2,
    translations: {
      fr: {
        quote: "Le niveau de professionnalisme et de créativité que PromoPers apporte au marketing expérientiel est exceptionnel. Ils ne se contentent pas d'exécuter des campagnes - ils créent des expériences de marque mémorables qui génèrent de vrais résultats commerciaux. Fortement recommandé pour toute marque cherchant à avoir un impact.",
        position: "Chef de Marketing, Samsung Suisse"
      },
      de: {
        quote: "Das Maß an Professionalität und Kreativität, das PromoPers in das Erlebnismarketing einbringt, ist außergewöhnlich. Sie führen nicht nur Kampagnen durch - sie schaffen unvergessliche Markenerlebnisse, die echte Geschäftsergebnisse erzielen. Sehr empfehlenswert für jede Marke, die einen Eindruck hinterlassen möchte.",
        position: "Leiterin Marketing, Samsung Schweiz"
      },
      it: {
        quote: "Il livello di professionalità e creatività che PromoPers porta al marketing esperienziale è eccezionale. Non si limitano ad eseguire campagne - creano esperienze di brand memorabili che generano risultati commerciali reali. Altamente raccomandato per qualsiasi brand che cerca di avere un impatto.",
        position: "Responsabile Marketing, Samsung Svizzera"
      }
    }
  }
]

// Migrate testimonials
function migrateTestimonials() {
  const testimonials: any[] = []
  const now = new Date().toISOString()

  testimonialsData.forEach((testimonial, index) => {
    const id = `testimonial-${index + 1}`
    
    const migrated: any = {
      id,
      author: testimonial.author,
      position: testimonial.position,
      quote: testimonial.quote,
      image: testimonial.image,
      authorImage: testimonial.authorImage,
      order: testimonial.order,
      published: true,
      createdAt: now,
      updatedAt: now,
      translations: testimonial.translations
    }

    testimonials.push(migrated)
  })

  // Write to file
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const filePath = path.join(dataDir, 'testimonials.json')
  fs.writeFileSync(filePath, JSON.stringify(testimonials, null, 2), 'utf8')
  
  console.log(`✅ Migrated ${testimonials.length} testimonials to ${filePath}`)
  console.log('Testimonials migrated:')
  testimonials.forEach(testimonial => {
    console.log(`  - ${testimonial.author} (${testimonial.position})`)
  })
}

migrateTestimonials()

