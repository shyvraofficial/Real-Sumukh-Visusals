import React from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Showreel from '../components/Showreel'
import Services from '../components/Services'
import Tools from '../components/Tools'
import Work from '../components/Work'
import WhyMe from '../components/WhyMe'
import Testimonials from '../components/Testimonials'
import CTA from '../components/CTA'
import Contact from '../components/Contact'
import LatestCollection from '../components/LatestCollection'


const Portfolio = () => {
  const location = useLocation()
  
  return (
    <div key={location.pathname}>
        <Hero />
        <Showreel/>
        <Services />
        <Tools />
        <Work />
        <WhyMe />
        <Testimonials />
        <CTA />
        <Contact />
    </div>
  )
}

export default Portfolio