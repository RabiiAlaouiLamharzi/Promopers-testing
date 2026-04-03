import { NextRequest, NextResponse } from 'next/server'
import { getAllJobs, createJob } from '@/lib/jobs'
import type { Job } from '@/lib/jobs'

const SAMPLE_JOBS: Job[] = [
  {
    id: 'sample-1',
    title: 'Project Manager',
    type: 'Full-time',
    department: 'Operations',
    description: 'You will plan, coordinate and execute retail campaigns and activations for our key accounts. You are the main point of contact for clients and internal teams, ensuring flawless delivery from briefing to wrap-up.',
    requirements: [
      '2+ years of experience in project management or event/retail marketing',
      'Strong organisational and communication skills',
      'Fluent in German; English or French is a plus',
      'Confident with Excel, project tools and reporting',
    ],
    order: 0,
    published: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      fr: {
        title: 'Chef de projet',
        type: 'Temps plein',
        department: 'Opérations',
        description: "Vous planifierez, coordonnerez et exécuterez des campagnes et activations retail pour nos clients clés. Vous serez le principal interlocuteur des clients et des équipes internes, assurant une livraison irréprochable du briefing au bilan.",
        requirements: [
          "2+ ans d'expérience en gestion de projet ou marketing événementiel/retail",
          "Excellentes compétences organisationnelles et de communication",
          "Maîtrise de l'allemand ; l'anglais ou le français est un atout",
          "À l'aise avec Excel, les outils de gestion de projet et le reporting",
        ],
      },
      de: {
        title: 'Projektmanager/in',
        type: 'Vollzeit',
        department: 'Operations',
        description: "Sie planen, koordinieren und führen Retail-Kampagnen und -Aktivierungen für unsere Schlüsselkunden durch. Sie sind der Hauptansprechpartner für Kunden und interne Teams und gewährleisten eine reibungslose Abwicklung von der Briefing- bis zur Nachbereitungsphase.",
        requirements: [
          '2+ Jahre Erfahrung im Projektmanagement oder Event-/Retail-Marketing',
          'Starke organisatorische und kommunikative Fähigkeiten',
          'Deutschkenntnisse; Englisch oder Französisch von Vorteil',
          'Sicherer Umgang mit Excel, Projekttools und Reporting',
        ],
      },
      it: {
        title: 'Project Manager',
        type: 'Tempo pieno',
        department: 'Operazioni',
        description: "Pianificherete, coordinerete ed eseguirete campagne di attivazione retail per i nostri clienti chiave. Sarete il principale punto di contatto per clienti e team interni, garantendo una consegna impeccabile dal briefing al consuntivo.",
        requirements: [
          '2+ anni di esperienza in project management o marketing eventi/retail',
          'Forti competenze organizzative e comunicative',
          'Tedesco fluente; inglese o francese è un plus',
          'Sicurezza con Excel, strumenti di progetto e reporting',
        ],
      },
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const admin = request.nextUrl.searchParams.get('admin') === 'true'
    const jobs = await getAllJobs()

    // Fall back to sample jobs when storage is empty or not yet configured
    const source = jobs.length > 0 ? jobs : SAMPLE_JOBS

    const result = admin ? source : source.filter(j => j.published)
    return NextResponse.json(result.sort((a, b) => a.order - b.order))
  } catch (error) {
    console.error('Error fetching jobs:', error)
    // Even on error, return the sample so the page is never blank
    return NextResponse.json(SAMPLE_JOBS)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    const job = await createJob({
      title: body.title,
      type: body.type || 'Full-time',
      department: body.department || '',
      description: body.description || '',
      requirements: body.requirements || [],
      order: body.order ?? 0,
      published: body.published ?? false,
      translations: body.translations || { fr: {}, de: {}, it: {} },
    })
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
