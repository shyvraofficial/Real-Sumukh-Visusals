import React from 'react'
import { motion } from 'framer-motion'
import './Testimonials.css'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      text: "Clean edits, good pacing, and the final videos matched my style really well. Easy to work with.",
      role: "Fitness Content Creator"
    },
    {
      id: 2,
      text: "He understands timing and flow properly. The reels look sharper and more engaging now.",
      role: "Personal Brand Creator"
    },
    {
      id: 3,
      text: "Consistent edits and attention to detail. The content feels much more professional overall.",
      role: "Social Media Creator"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4,
        duration: 0.8
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
    }
  }

  return (
    <section className="testimonials">
      <div className="testimonials-container">
        <motion.h2
          className="testimonials-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.320, 1] }}
        >
          What Clients Say
        </motion.h2>

        <motion.div
          className="testimonials-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="testimonial-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="testimonial-quote-mark">"</div>
              <p className="testimonial-text">{testimonial.text}</p>
              <p className="testimonial-role">— {testimonial.role}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
