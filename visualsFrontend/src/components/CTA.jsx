import React from 'react'
import { motion } from 'framer-motion'
import './CTA.css'

const CTA = () => {
  const handleWhatsApp = () => {
    window.open('https://wa.me/917xxxx-xxxx?text=Hi%20Sumukh%2C%20I%20want%20to%20discuss%20a%20video%20project', '_blank')
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.320, 1] }
    }
  }

  const subtitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.320, 1] }
    }
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.320, 1] }
    }
  }

  return (
    <section className="cta">
      <div className="cta-container">
        <motion.div
          className="cta-content"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
        >
          <motion.h2 className="cta-title" variants={titleVariants}>
            Ready to Elevate Your Videos?
          </motion.h2>
          <motion.p className="cta-subtitle" variants={subtitleVariants}>
            Let's create something amazing together. Reach out and let's discuss your project.
          </motion.p>
          <motion.div className="cta-buttons" variants={buttonVariants}>
            <a href="/contact" className="cta-btn primary">
              Get in Touch
            </a>
            <button onClick={handleWhatsApp} className="cta-btn secondary">
              Message on WhatsApp
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTA
