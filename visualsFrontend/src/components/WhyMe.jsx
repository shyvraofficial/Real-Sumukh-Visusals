import React from 'react'
import { motion } from 'framer-motion'
import './WhyMe.css'
import {
  SiAdobepremierepro,
  SiAdobeaftereffects,
  SiDavinciresolve,
  SiCanva
} from "react-icons/si";
import { MdOutlineGraphicEq, MdMotionPhotosOn, MdVolumeUp,MdColorLens } from "react-icons/md";

const WhyMe = () => {
  const experiences = [
    {
      id: 1,
      icon: '🎬',
      position: 'Video Editor',
      company: 'Freelance',
      duration: '3 Years',
      description: 'Professional cinematography for brands, creators, and visual stories'
    },
    {
      id: 2,
      icon: '🎥',
      position: 'Cinematography',
      company: 'Content Creation',
      duration: '4 Years',
      description: 'Specialized in color grading, camera techniques, and visual composition for cinematic productions'
    }
  ]

  const skills = [
    { icon: SiAdobepremierepro, name: "Adobe Premiere Pro" },
    { icon: SiAdobeaftereffects, name: "After Effects" },
    { icon: SiDavinciresolve, name: "DaVinci Resolve" },
    { icon: MdOutlineGraphicEq, name: "Motion Graphics" },
    { icon: MdMotionPhotosOn, name: "Video Transitions" },
    { icon: MdColorLens, name: "Color Grading" },
    { icon: MdVolumeUp, name: "Sound Design" },
    { icon: SiCanva, name: "Canva" }
  ];

  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '35+', label: 'Satisfied Clients' },
    { number: '100%', label: 'Client Satisfaction' },
    { number: '24h', label: 'Quick Turnaround' }
  ]

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

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
    }
  }

  return (
    <section className="whyme">
      <div className="whyme-container">
        <motion.div
          className="whyme-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2 className="whyme-title" variants={titleVariants}>
            Why Me?
          </motion.h2>
          <motion.p className="whyme-subtitle" variants={subtitleVariants}>
            3 Years of Professional Video Editing Experience
          </motion.p>
        </motion.div>

        <div className="whyme-content">
          {/* Experience Section */}
          <motion.div
            className="experience-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h3 className="section-subtitle">Freelance Experience</h3>
            <div className="experience-list">
              {experiences.map((exp) => (
                <motion.div
                  key={exp.id}
                  className="experience-item"
                  variants={itemVariants}
                >
                  <div className="exp-icon">{exp.icon}</div>
                  <div className="exp-info">
                    <h4 className="exp-position">{exp.position}</h4>
                    <p className="exp-company">{exp.company}</p>
                    <p className="exp-duration">{exp.duration}</p>
                    <p className="exp-description">{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div
            className="skills-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h3 className="section-subtitle">Technical Skills</h3>
            <motion.div
              className="skills-grid"
              variants={containerVariants}
            >
              {skills.map((skill, idx) => {
                const IconComponent = skill.icon
                return (
                  <motion.div
                    key={idx}
                    className="skill-card"
                    variants={skillVariants}
                    whileHover={{
                      scale: 1.05,
                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <IconComponent className="skill-icon" />
                    <span className="skill-name">{skill.name}</span>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="stats-section"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="whyme-stats">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  className="stat-item"
                  variants={itemVariants}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhyMe
