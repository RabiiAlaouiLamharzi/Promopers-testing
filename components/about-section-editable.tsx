"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useEdit } from "@/contexts/edit-context"
import { EditableText } from "@/components/editable-text"
import { EditableImage } from "@/components/editable-image"

export function AboutSectionEditable() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language, revision } = useLanguage()
  const { editMode } = useEdit()
  
  const [title, setTitle] = useState(t("about.title"))
  const [titleHighlight, setTitleHighlight] = useState(t("about.titleHighlight"))
  const [description, setDescription] = useState(t("about.description"))
  const [buttonText, setButtonText] = useState(t("about.scheduleCall"))
  const [mediaOverridesLoaded, setMediaOverridesLoaded] = useState<Record<string, string>>({})

  // Translation keys for features (to enable saving to JSONBin)
  const featureTranslationKeys = [
    { title: "about.inHouseDevelopment", description: "about.inHouseDevelopmentDesc", benefits: ["about.customSoftwareSolutions", "about.customerDrivenDevelopment"] },
    { title: "about.productsSalesTraining", description: "about.productsSalesTrainingDesc", benefits: ["about.optimalSalesConsultations", "about.strategicIncentiveSystems"] },
    { title: "about.bigData", description: "about.bigDataDesc", benefits: ["about.dailyDataUpdates", "about.realTimeInsights"] },
    { title: "about.routePlanning", description: "about.routePlanningDesc", benefits: ["about.strategicStoreVisits", "about.multiLanguageExpertise"] },
    { title: "about.lastMinuteLogistics", description: "about.lastMinuteLogisticsDesc", benefits: ["about.warehouse500m2", "about.onlineOrderingSolution"] },
    { title: "about.stationaryTrade", description: "about.stationaryTradeDesc", benefits: ["about.multichannelSolutions", "about.retailExpertise"] }
  ]

  // Load media overrides once on mount
  useEffect(() => {
    const loadMediaOverrides = async () => {
      try {
        const response = await fetch('/api/media')
        if (response.ok) {
          const data = await response.json()
          const aboutMedia = data.about || {}
          console.log('[AboutEditable] Loaded media overrides:', aboutMedia)
          setMediaOverridesLoaded(aboutMedia)
        }
      } catch (error) {
        console.error('[AboutEditable] Error loading media overrides:', error)
      }
    }
    
    loadMediaOverrides()
  }, [])

  // Update translations and apply media overrides when language changes
  useEffect(() => {
    setTitle(t("about.title"))
    setTitleHighlight(t("about.titleHighlight"))
    setDescription(t("about.description"))
    setButtonText(t("about.scheduleCall"))
    
    // Define base features with translations
    const baseFeatures = [
      {
        image: "/new-images/In-House Development.png",
        number: "01",
        title: t("about.inHouseDevelopment"),
        description: t("about.inHouseDevelopmentDesc"),
        benefits: [t("about.customSoftwareSolutions"), t("about.customerDrivenDevelopment")]
      },
      {
        image: "/new-images/Products & Sales Training.jpg",
        number: "02",
        title: t("about.productsSalesTraining"),
        description: t("about.productsSalesTrainingDesc"),
        benefits: [t("about.optimalSalesConsultations"), t("about.strategicIncentiveSystems")]
      },
      {
        image: "/new-images/Big Data vs. Smart Data.png",
        number: "03",
        title: t("about.bigData"),
        description: t("about.bigDataDesc"),
        benefits: [t("about.dailyDataUpdates"), t("about.realTimeInsights")]
      },
      {
        image: "/new-images/Optimal route planning.jpg",
        number: "04",
        title: t("about.routePlanning"),
        description: t("about.routePlanningDesc"),
        benefits: [t("about.strategicStoreVisits"), t("about.multiLanguageExpertise")]
      },
      {
        image: "/new-images/Last Minute Logistics.jpg",
        number: "05",
        title: t("about.lastMinuteLogistics"),
        description: t("about.lastMinuteLogisticsDesc"),
        benefits: [t("about.warehouse500m2"), t("about.onlineOrderingSolution")]
      },
      {
        image: "/new-images/Stationary Trade vs. E-commerce.webp",
        number: "06",
        title: t("about.stationaryTrade"),
        description: t("about.stationaryTradeDesc"),
        benefits: [t("about.multichannelSolutions"), t("about.retailExpertise")]
      }
    ]
    
    // Apply media overrides to base features
    const featuresWithOverrides = baseFeatures.map((feature, index) => ({
      ...feature,
      image: mediaOverridesLoaded[`factor${index}`] || feature.image
    }))
    
    setFeatures(featuresWithOverrides)
  }, [t, language, revision, mediaOverridesLoaded]) // Also depend on mediaOverridesLoaded

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const [features, setFeatures] = useState([
    {
      image: "/new-images/In-House Development.png",
      number: "01",
      title: t("about.inHouseDevelopment"),
      description: t("about.inHouseDevelopmentDesc"),
      benefits: [t("about.customSoftwareSolutions"), t("about.customerDrivenDevelopment")]
    },
    {
      image: "/new-images/Products & Sales Training.jpg",
      number: "02",
      title: t("about.productsSalesTraining"),
      description: t("about.productsSalesTrainingDesc"),
      benefits: [t("about.optimalSalesConsultations"), t("about.strategicIncentiveSystems")]
    },
    {
      image: "/new-images/Big Data vs. Smart Data.png",
      number: "03",
      title: t("about.bigData"),
      description: t("about.bigDataDesc"),
      benefits: [t("about.dailyDataUpdates"), t("about.realTimeInsights")]
    },
    {
      image: "/new-images/Optimal route planning.jpg",
      number: "04",
      title: t("about.routePlanning"),
      description: t("about.routePlanningDesc"),
      benefits: [t("about.strategicStoreVisits"), t("about.multiLanguageExpertise")]
    },
    {
      image: "/new-images/Last Minute Logistics.jpg",
      number: "05",
      title: t("about.lastMinuteLogistics"),
      description: t("about.lastMinuteLogisticsDesc"),
      benefits: [t("about.warehouse500m2"), t("about.onlineOrderingSolution")]
    },
    {
      image: "/new-images/Stationary Trade vs. E-commerce.webp",
      number: "06",
      title: t("about.stationaryTrade"),
      description: t("about.stationaryTradeDesc"),
      benefits: [t("about.multichannelSolutions"), t("about.retailExpertise")]
    }
  ])

  const updateFeatureImage = (index: number, newSrc: string) => {
    const newFeatures = [...features]
    newFeatures[index].image = newSrc
    setFeatures(newFeatures)
    
    // Also update media overrides state to persist across useEffect updates
    setMediaOverridesLoaded(prev => ({
      ...prev,
      [`factor${index}`]: newSrc
    }))
    
    console.log(`[AboutEditable] Updated feature ${index} image to ${newSrc}`)
  }

  const updateFeatureTitle = (index: number, newTitle: string) => {
    const newFeatures = [...features]
    newFeatures[index].title = newTitle
    setFeatures(newFeatures)
  }

  const updateFeatureDescription = (index: number, newDescription: string) => {
    const newFeatures = [...features]
    newFeatures[index].description = newDescription
    setFeatures(newFeatures)
  }

  const updateFeatureBenefit = (featureIndex: number, benefitIndex: number, newBenefit: string) => {
    const newFeatures = [...features]
    newFeatures[featureIndex].benefits[benefitIndex] = newBenefit
    setFeatures(newFeatures)
  }

  return (
    <section id="about" ref={sectionRef} className="luxury-section bg-white pb-0">
      <div className="luxury-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start mb-16">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <h2 className="text-headline text-[#002855] mb-6 uppercase">
              <EditableText
                value={title}
                onChange={setTitle}
                translationKey="about.title"
                editMode={editMode}
              />
              <br />
              <span className="text-[#003D7A]">
                <EditableText
                  value={titleHighlight}
                  onChange={setTitleHighlight}
                  translationKey="about.titleHighlight"
                  editMode={editMode}
                />
              </span>
            </h2>
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <EditableText
              value={description}
              onChange={setDescription}
              translationKey="about.description"
              as="p"
              multiline
              className="text-luxury-body text-[#003D7A] mb-8 leading-relaxed"
              editMode={editMode}
            />
            <Link 
              href="/contact" 
              onClick={(e) => {
                if (editMode) {
                  e.preventDefault()
                  e.stopPropagation()
                }
              }}
              className="luxury-button luxury-button-primary font-bold text-lg flex items-center gap-3"
            >
              <EditableText
                value={buttonText}
                onChange={setButtonText}
                translationKey="about.scheduleCall"
                editMode={editMode}
              />
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${(index + 2) * 150}ms` }}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 md:h-[550px] flex flex-col">
                <div className="relative h-48 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0">
                    <EditableImage
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                      editMode={editMode}
                      onImageChange={(newSrc) => updateFeatureImage(index, newSrc)}
                      section="about"
                      mediaKey={`factor${index}`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-[#002855] font-bold text-xs">{feature.number}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <h3 className="text-xl font-black text-[#002855] leading-tight uppercase" style={{ fontFamily: 'var(--font-archivo)' }}>
                    <EditableText
                      value={feature.title}
                      onChange={(newTitle) => updateFeatureTitle(index, newTitle)}
                      translationKey={featureTranslationKeys[index]?.title}
                      editMode={editMode}
                      className="text-xl font-black text-[#002855] leading-tight uppercase"
                    />
                  </h3>

                  <p className="text-base text-[#003D7A] leading-relaxed">
                    <EditableText
                      value={feature.description}
                      onChange={(newDescription) => updateFeatureDescription(index, newDescription)}
                      translationKey={featureTranslationKeys[index]?.description}
                      editMode={editMode}
                      multiline
                      as="span"
                      className="text-base text-[#003D7A] leading-relaxed"
                    />
                  </p>

                  <div className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#FFC72C] rounded-full flex-shrink-0"></div>
                        <span className="text-[#002855] font-medium text-sm">
                          <EditableText
                            value={benefit}
                            onChange={(newBenefit) => updateFeatureBenefit(index, benefitIndex, newBenefit)}
                            translationKey={featureTranslationKeys[index]?.benefits[benefitIndex]}
                            editMode={editMode}
                            className="text-[#002855] font-medium text-sm"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

