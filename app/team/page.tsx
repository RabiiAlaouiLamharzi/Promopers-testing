"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/contexts/language-context"
import { getRoleDisplayLabel } from "@/lib/team-role-display"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <TeamStatsSection />
      </main>
      <Footer />
    </div>
  )
}


function TeamStatsSection() {
  const [activeTab] = useState("office")
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()
  const [officeTeam, setOfficeTeam] = useState<any[]>([])
  const [experienceConsultants, setExperienceConsultants] = useState<any[]>([])
  const [fieldForce, setFieldForce] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      const response = await fetch('/api/team')
      if (response.ok) {
        const data = await response.json()
        setOfficeTeam(data.officeTeam?.sort((a: any, b: any) => a.order - b.order) || [])
        setExperienceConsultants(data.experienceConsultants?.sort((a: any, b: any) => a.order - b.order) || [])
        setFieldForce(data.fieldForce?.sort((a: any, b: any) => a.order - b.order) || [])
      } else {
        setOfficeTeam([
          { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#" },
          { name: "Purpura Nicolas", roleKey: "coCeoIt", image: "/new-images/purpura-nicolas.jpg", funImage: "/new-images/purpura-nicolas-funny.jpg", linkedin: "#" },
          { name: "Albisser Carmela", roleKey: "finance", image: "/new-images/albisser-carmela.jpg", funImage: "/new-images/albisser-carmela-funny.jpg", linkedin: "#" },
          { name: "Kurz Martin", roleKey: "teamLeaderMerchandising", image: "/new-images/kurz-martin.jpg", funImage: "/new-images/kurz-martin-funny.jpg", linkedin: "#" },
          { name: "Teotino Angelo", roleKey: "headOfPromotion", image: "/new-images/teotino-angelo.jpg", funImage: "/new-images/teotino-angelo-funny.jpg", linkedin: "#" },
          { name: "Kevin Zanotta", roleKey: "seniorProjectManager", image: "/new-images/kevin-zanotta.jpg", funImage: "/new-images/kevin-zanotta-funny.jpg", linkedin: "#" },
          { name: "Jessica Makwala", roleKey: "projectManager", image: "/new-images/jessica-makwala.jpg", funImage: "/new-images/jessica-makwala-funny.jpg", linkedin: "#" },
          { name: "Benammar Samir", roleKey: "projectManager", image: "/new-images/benammar-samir.jpg", funImage: "/new-images/benammar-samir-funny.jpg", linkedin: "#" },
          { name: "Santos Cristina", roleKey: "juniorProjectManager", image: "/new-images/santos-cristina.jpg", funImage: "/new-images/santos-cristina-funny.jpg", linkedin: "#" },
          { name: "Müller Paula", roleKey: "backOffice", image: "/new-images/müller-paula.jpg", funImage: "/new-images/müller-paula-funny.jpg", linkedin: "#" },
          { name: "Berger Lukas", roleKey: "juniorProjectManager", image: "/new-images/lukas-berger.jpg", funImage: "/new-images/lukas-berger-funny.jpg", linkedin: "#" },
          { name: "Demelas Giuseppe", roleKey: "logisticsManager", image: "/new-images/demelas-giuseppe.jpg", funImage: "/new-images/demelas-giuseppe-funny.jpg", linkedin: "#" },
        ])
        setExperienceConsultants([
          "Anderson Al", "Baig Ayman", "Dario Iannelli", "Chafiha Messaouden",
          "Muneeb Sheikh", "Amir Uruqi", "Dannacher Lukas", "Indelicato Cristian",
          "King Stefan", "Losilla Alexis", "Maccia Giuseppe", "Manser Gibson",
          "Ylli Karakushi", "Kaan Özoguz", "Ghada Jouahri", "Hadj-Arab Samy",
          "Muanza Milton", "Singer Barbara", "Wuhrmann Kevin",
        ])
        setFieldForce([])
      }
    } catch (error) {
      console.error('Error fetching team data:', error)
      setOfficeTeam([
        { name: "Feissli Fritz", roleKey: "coCeoFinance", image: "/new-images/logo.png", funImage: "/new-images/logo.png", linkedin: "#" },
      ])
      setExperienceConsultants([])
      setFieldForce([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { number: "65",  label: t("aboutPage.fieldForce"),      description: t("aboutPage.fieldForceDesc") },
    { number: "6M",  label: t("aboutPage.circumnavigation"), description: t("aboutPage.circumnavigationDesc") },
    { number: "25",  label: t("aboutPage.vehicleFleet"),     description: t("aboutPage.vehicleFleetDesc") },
  ]


  return (
    <section id="team-stats" ref={sectionRef} className="pt-16 bg-white relative">
      <div className="luxury-container relative z-10">

        {/* Stats Section — title stacked, stats below */}
        <div className="py-16 border-b border-[#121830]/10">
          {/* Title */}
          <div className="min-w-0 mb-16">
            <h2 className="text-headline text-[#121830] mb-4 uppercase break-words">{t("aboutPage.weHaveTeam")}</h2>
            <h3 className="text-subheadline text-[#2B2F36] uppercase break-words">{t("aboutPage.teamsBack")}</h3>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col py-8 lg:py-0
                  ${index === 0 ? "lg:pr-16" : ""}
                  ${index === 1 ? "border-t lg:border-t-0 lg:border-l border-[#121830]/10 lg:px-16" : ""}
                  ${index === 2 ? "border-t lg:border-t-0 lg:border-l border-[#121830]/10 lg:pl-16" : ""}
                `}
              >
                <div className="flex items-start gap-5">
                  {/* Left: number + label stacked */}
                  <div className="flex flex-col flex-shrink-0">
                    <div className="text-5xl lg:text-6xl font-black text-[#121830] leading-none whitespace-nowrap">
                      {stat.number}<span className="text-[#FFCE5C]">+</span>
                    </div>
                    <h3 className="text-xs font-black text-[#121830] uppercase tracking-wider mt-3">{stat.label}</h3>
                  </div>
                  {/* Right: description */}
                  <p className="text-sm text-[#2B2F36]/70 leading-relaxed pt-1">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-24">

          {/* Header — 2-col: title left, description right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
            <div className="min-w-0">
              <h2 className="text-headline text-[#121830] mb-4 uppercase">{t("aboutPage.officeTeamLine1")}</h2>
              <h3 className="text-subheadline text-[#2B2F36] uppercase">{t("aboutPage.officeTeamLine2")}</h3>
            </div>
            <div className="min-w-0">
              <p className="text-luxury-body text-[#2B2F36] leading-relaxed">{t("aboutPage.meetTeamDesc")}</p>
            </div>
          </div>

          {/* Photo cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-3xl bg-gray-100 animate-pulse h-[480px]" />
              ))
            ) : (
              officeTeam.map((member, index) => (
                <div key={index} className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[480px] w-full cursor-pointer">
                  {/* Default: normal photo */}
                  <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830] via-[#121830]/50 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase leading-tight">{member.name}</h3>
                      <p className="text-sm md:text-base text-white/90 font-semibold">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                    </div>
                  </div>
                  {/* Hover: fun photo */}
                  <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                    <img src={member.funImage} alt={`${member.name} - casual`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121830]/90 via-[#121830]/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center">
                        <span className="text-lg md:text-xl font-bold text-[#121830]">{t("aboutPage.letsConnect")}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

