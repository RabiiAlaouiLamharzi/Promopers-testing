"use client"

import { useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Users, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getRoleDisplayLabel } from "@/lib/team-role-display"

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main>
        <HeroSection />
        <TeamStatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative bg-[#002855] h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFC72C]/30 to-transparent" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #FFC72C 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="relative z-10 luxury-container text-center px-6">
        <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-block mb-6 px-6 py-2 rounded-full border-2 border-[#FFC72C] bg-white/5 mt-16">
            <span className="text-[#FFC72C] text-sm font-bold uppercase tracking-[0.15em]">{t("aboutPage.meetTheTeam")}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 uppercase leading-none tracking-tight">
            <span className="text-[#FFC72C]">PromoPers</span>
          </h1>
          <div className="w-16 h-0.5 bg-[#FFC72C]/50 mx-auto" />
        </div>
      </div>
    </section>
  )
}

function TeamStatsSection() {
  const [activeTab, setActiveTab] = useState("office")
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

  const tabs = [
    { id: "office", labelKey: "officeTeam", count: officeTeam.length },
    { id: "field", labelKey: "fieldForceLabel", count: fieldForce.length },
    { id: "consultants", labelKey: "experienceConsultants", count: experienceConsultants.length },
  ]

  return (
    <section id="team-stats" ref={sectionRef} className="pt-16 pb-32 bg-white relative">
      <div className="luxury-container relative z-10">
        {/* Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16 border-b border-[#002855]/10">
          {/* Left — heading */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Sparkles className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
                {t("aboutPage.byTheNumbers")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#002855] uppercase leading-tight">
              {t("aboutPage.weHaveTeam")}
              <br />
              <span className="text-[#003D7A]">{t("aboutPage.teamsBack")}</span>
            </h2>
          </div>

          {/* Right — stats */}
          <div className="grid grid-cols-3 divide-x divide-[#002855]/10">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center px-6">
                <div className="text-5xl md:text-6xl font-black text-[#002855] leading-none mb-2">
                  {stat.number}
                  <span className="text-[#FFC72C]">+</span>
                </div>
                <h3 className="text-xs font-black text-[#002855] uppercase tracking-wider mb-2">
                  {stat.label}
                </h3>
                <p className="text-xs text-[#003D7A]/70 leading-relaxed hidden md:block">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFC72C]/10 mb-6">
              <Users className="w-4 h-4 text-[#002855]" />
              <span className="text-[#002855] text-sm font-bold uppercase tracking-wider">
                {t("aboutPage.meetTheTeam")}
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-[#002855] mb-6 uppercase leading-tight">
              {t("aboutPage.talentedPeople")}
            </h2>

            <p className="text-luxury-body max-w-3xl mx-auto mb-12">
              {t("aboutPage.meetTeamDesc")}
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] ${
                    activeTab === tab.id
                      ? "bg-[#FFC72C] text-[#002855] shadow-lg shadow-[#FFC72C]/30"
                      : "bg-white text-[#002855] hover:text-[#FFC72C] border border-gray-200 hover:border-[#FFC72C] hover:shadow-md"
                  }`}
                >
                  {t(`aboutPage.${tab.labelKey}`)}
                  <span className="ml-2 text-sm opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Office Team */}
          {activeTab === "office" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
              {officeTeam.map((member, index) => (
                <div key={index} className="group" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
                  <div className="office-team-simple glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-black text-white">
                        {member.name.split(' ')[0].charAt(0)}{member.name.split(' ')[1]?.charAt(0) || ''}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#002855] mb-1">{member.name}</h3>
                    <p className="text-xs text-[#003D7A]">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                  </div>

                  <div className="office-team-image relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-[480px] w-full">
                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0">
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002855] via-[#002855]/50 to-transparent opacity-80" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase leading-tight">{member.name}</h3>
                        <p className="text-sm md:text-base text-white/90 font-semibold">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100">
                      <img src={member.funImage} alt={`${member.name} - casual`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#002855]/90 via-[#002855]/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                        <a
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white rounded-full px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center"
                        >
                          <span className="text-lg md:text-xl font-bold text-[#002855]">{t("aboutPage.letsConnect")}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Field Force */}
          {activeTab === "field" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {fieldForce.map((member, index) => (
                <div key={member.id ?? index} className="group">
                  <div className="glass-effect rounded-2xl p-6 text-center luxury-border luxury-hover">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#002855] to-[#003D7A] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <span className="text-3xl font-black text-white">
                        {member.name?.split(' ')[0]?.charAt(0) ?? ''}{member.name?.split(' ')[1]?.charAt(0) ?? ''}
                      </span>
                    </div>
                    <h3 className="text-base font-black text-[#002855] mb-1">{member.name}</h3>
                    <p className="text-xs text-[#003D7A]">{getRoleDisplayLabel(member.roleKey, t, language)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experience Consultants */}
          {activeTab === "consultants" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
              {experienceConsultants.map((member, index) => {
                const name = typeof member === 'string' ? member : member.name
                const roleKey = typeof member === 'object' ? member.roleKey : 'experienceConsultant'
                return (
                  <div key={typeof member === 'object' ? member.id : index} className="group">
                    <div className="bg-white rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-[#FFC72C] transition-all duration-500 hover:shadow-xl luxury-hover">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FFC72C] to-[#E6B526] mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <span className="text-3xl font-black text-[#002855]">
                          {name.split(' ')[0].charAt(0)}{name.split(' ')[1]?.charAt(0) || ''}
                        </span>
                      </div>
                      <h3 className="text-base font-black text-[#002855]">{name}</h3>
                      <p className="text-xs text-[#003D7A] mt-1">{getRoleDisplayLabel(roleKey, t, language)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.3 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <h2 className="text-4xl md:text-5xl font-black text-[#002855] leading-tight mb-6 uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
            {t("contact.readyToWork")}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("contact.discussBrand")}
          </p>
          <a href="/contact" className="bg-[#FFC72C] text-[#002855] px-12 py-4 rounded-full font-semibold text-lg hover:bg-[#E6B526] transition-colors inline-flex items-center gap-3">
            {t("contact.scheduleCall")}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
