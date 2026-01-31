import React from 'react'
import { motion } from 'framer-motion'
import './Work.css'

const Work = () => {
  
  const projects = [
  {
    id: 1,
    title: 'Street Style Motion',
    instagramUrl: 'https://www.instagram.com/reel/DO3MxoPj03v/',
  },
  {
    id: 2,
    title: 'Powerlifting Motivation',
    instagramUrl: 'https://www.instagram.com/reel/DM-3cXbPO6U/',
  },
  {
    id: 3,
    title: 'Visual Effects Flow', 
    instagramUrl: 'https://www.instagram.com/reel/DPAAukYk38l/',
  },
  {
    id: 4,
    title: 'Urban Apparel Edit',
    instagramUrl: 'https://www.instagram.com/reel/DO0wwVbj_O7/',
  },
  {
    id: 5,
    title: 'Clothing Brand Promo',
    instagramUrl: 'https://www.instagram.com/reel/DOrIGFSEj8i/',
  },
  {
    id: 6,
    title: 'Bodybuilding Showcase',
    instagramUrl: 'https://www.instagram.com/reel/DNLiF1Fv69j/',
  }
 ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.4 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
    }
  }

  const handleClick = (url) => window.open(url, '_blank')

  return (
    <section className="work">
      <div className="work-container">
        <motion.h2 
          className="work-title" 
          initial={{ opacity: 0, y: -20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          viewport={{ once: true }}
        >
          My Showcase
        </motion.h2>
        
        <motion.div 
          className="projects-grid" 
          variants={containerVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card"
              variants={itemVariants}
              onClick={() => handleClick(project.instagramUrl)}
              whileHover={{ y: -8 }}
            >
              <div className="insta-embed-wrap">
                <iframe
                  src={`${project.instagramUrl.split('?')[0]}embed/`}
                  width="100%"
                  height="480"
                  frameBorder="0"
                  scrolling="no"
                  title={project.title}
                  style={{ borderRadius: '12px', background: '#000' }}
                ></iframe>
              </div>

              <div className="project-info">
                <h3 className="project-name">{project.title}</h3>
                <p className="project-cta">View full reel →</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Work