import React, { useState } from 'react'
import { motion } from 'framer-motion'
import './Services.css'
import gymEditImg from './assets2.o/gynedit.jpg'
import cinematicImg from './assets2.o/cinematography.jpg'
import talkHeadImg from './assets2.o/talkhead.jpg'

const Services = () => {
  const [activeTab, setActiveTab] = useState(0)

  const services = [
    {
      id: 0,
      title: 'Talking Head Videos',
      description: 'Professional editing for talking head content, podcasts, and testimonial videos. Includes background removal, lower thirds, B-roll integration, and smooth transitions to create polished, engaging educational and promotional content.',
      image: talkHeadImg
    },
    {
      id: 1,
      title: 'Gym & Fitness Editing',
      description: 'Professional video editing for fitness content including workout compilations, transformation montages, and motivational fitness videos. I create dynamic edits with music synchronization, transitions, and text overlays to enhance your fitness brand and engage your audience.',
      image: gymEditImg
    },
    {
      id: 1,
      title: 'Cinematic Video Editing',
      description: 'Cinematic-quality video production with color grading, advanced transitions, and emotional storytelling. Perfect for travel vlogs, documentaries, and brand videos that demand premium visual aesthetics and professional post-production excellence.',
      image: cinematicImg
    },
    {
      id: 3,
      title: 'AI-Generated Content Creation',
      description: 'Cutting-edge AI-powered video content creation combining AI avatars, text-to-speech narration, and automated editing. Perfect for fast-turnaround social media videos, explainer content, and scalable video production without extensive manual editing.',
      image: 'https://thumbs.dreamstime.com/b/ai-creating-personalized-content-video-marketing-entice-artificial-intelligence-enhances-generating-analyzes-data-to-409116119.jpg'
    },
    {
      id: 4,
      title: 'Clothing Brand Mockups',
      description: 'Professional product visualization and mockup design for clothing brands. Create stunning product demonstrations, fashion show edits, and lifestyle integration videos that showcase your apparel in the best possible light.',
      image: 'https://images.unsplash.com/photo-1696086152513-c74dc1d4b135?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsb3RoaW5nJTIwbW9ja3VwfGVufDB8fDB8fHww'
    }
  ]

  // Framer Motion variants
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.320, 1] }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
    }
  }

  const contentVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
    }
  }

  return (
    <section className="services" id="services">
      <div className="services-container">
        <motion.h2
          className="services-title"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          Professional Video Editing Services
        </motion.h2>
        
        <motion.div
          className="services-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Tabs */}
          <motion.div
            className="services-tabs"
            variants={itemVariants}
          >
            {services.map((service, idx) => (
              <button
                key={idx}
                className={`service-tab ${activeTab === idx ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                {service.title}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <motion.div
            className="services-display"
            variants={contentVariants}
          >
            <div className="service-image-wrapper">
              <img 
                src={services[activeTab].image} 
                alt={services[activeTab].title}
                className="service-image"
              />
            </div>
            <div className="service-info">
              <h3 className="service-name">{services[activeTab].title}</h3>
              <p className="service-desc">{services[activeTab].description}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
