import React, { useEffect, useState, useContext } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { NotificationContext } from '../context/NotificationContext'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    budget: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const { success, error: showError } = useContext(NotificationContext)

  useEffect(() => {
    const userId = import.meta.env.VITE_EMAILJS_USER
    if (userId) {
      emailjs.init(userId)
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE
    const userId = import.meta.env.VITE_EMAILJS_USER
    const receiver = import.meta.env.VITE_CONTACT_RECEIVER || 'sumukhvisuals@gmail.com'

    const templateParams = {
      name: formData.name || 'Not provided',
      email: formData.email || 'Not provided',
      phone: formData.phone || 'Not provided',
      project_type: formData.projectType || 'Not provided',
      budget: formData.budget || 'Not provided',
      message: formData.message || 'Not provided',
      time: new Date().toLocaleString(),
      to_email: receiver
    }

    try {
      if (!serviceId || !templateId || !userId) {
        throw new Error('EmailJS not configured. Set VITE_EMAILJS_SERVICE, VITE_EMAILJS_TEMPLATE, VITE_EMAILJS_USER in .env')
      }

      await emailjs.send(serviceId, templateId, templateParams, userId)
      setSubmitted(true)
      success('Thank you! Your message has been sent via email')
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          budget: '',
          message: ''
        })
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      console.error('Email send error:', err)
      showError('Unable to send message. Please try again')
    }
  }

  const handleWhatsApp = () => {
    const { name, email, phone, projectType, budget, message } = formData

    if (!message.trim()) {
      showError('Please write a message before sending')
      return
    }

    const whatsappMessage = `Hi Sumukh!\n\nName: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\nProject Type: ${projectType || 'Not provided'}\nBudget: ${budget || 'Not provided'}\n\nMessage:\n${message}`
    window.open(`https://wa.me/919084716627?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
    
    // Clear form after sending via WhatsApp
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectType: '',
      budget: '',
      message: ''
    })
    success('Message sent via WhatsApp')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.23, 1, 0.320, 1] }
    }
  }

  return (
    <section className="contact">
      <div className="contact-container">
        <motion.div
          className="contact-header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2 className="contact-title" variants={itemVariants}>
            Let's Create Something Amazing
          </motion.h2>
          <motion.p className="contact-subtitle" variants={itemVariants}>
            Whether you have a quick question or a full project in mind, I'd love to hear from you. Reach out and let's discuss your vision.
          </motion.p>
        </motion.div>

        <div className="contact-content">
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email..."
                required
              />
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 (optional)"
              />
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="projectType">Project Type *</label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Select a project type</option>
                <option value="short-form">Short Form Video (Reels/TikTok)</option>
                <option value="long-form">Long Form Content</option>
                <option value="promotional">Promotional/Ad Video</option>
                <option value="motion-graphics">Motion Graphics</option>
                <option value="color-grading">Color Grading & Correction</option>
                <option value="other">Other</option>
              </select>
            </motion.div>

            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="budget">Budget Range</label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select budget range</option>
                <option value="5k-10k">₹5,000 - ₹10,000</option>
                <option value="10k-25k">₹10,000 - ₹25,000</option>
                <option value="25k-50k">₹25,000 - ₹50,000</option>
                <option value="50k+">₹50,000+</option>
              </select>
            </motion.div>

            <motion.div className="form-group full-width" variants={itemVariants}>
              <label htmlFor="message">Project Details *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows="5"
                required
              ></textarea>
            </motion.div>

            <motion.div className="form-buttons" variants={itemVariants}>
              <button type="submit" className="form-btn primary">
                {submitted ? 'Message Sent! ✓' : 'Send via Email'}
              </button>
              <button type="button" className="form-btn secondary" onClick={handleWhatsApp}>
                Send via WhatsApp
              </button>
            </motion.div>
          </motion.form>

          <motion.div
            className="contact-info"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={containerVariants}
          >
            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon-wrapper">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-10 5L2 7"></path>
                </svg>
              </div>
              <h3>Email</h3>
              <p>sumukhvisuals@gmail.com</p>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sumukhvisuals@gmail.com" target="_blank" rel="noopener noreferrer">Send Email</a>
            </motion.div>

            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon-wrapper">
                <svg className="info-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-1.297-1.297-1.297-3.4 0-4.697l-2.121-2.121c-1.297 1.297-3.4 1.297-4.697 0-1.297-1.297-1.297-3.4 0-4.697l2.121-2.121c-1.297-1.297-3.4-1.297-4.697 0-2.594 2.594-2.594 6.799 0 9.393l8.485-8.485c1.297-1.297 3.4-1.297 4.697 0s1.297 3.4 0 4.697l-8.485 8.485c-2.594 2.594-6.799 2.594-9.393 0-2.594-2.594-2.594-6.799 0-9.393"></path>
                </svg>
              </div>
              <h3>WhatsApp</h3>
              <p>Quick Response</p>
              <a href="https://wa.me/919084716627" target="_blank" rel="noopener noreferrer">
                Message on WhatsApp
              </a>
            </motion.div>

            <motion.div className="info-card" variants={itemVariants}>
              <div className="info-icon-wrapper">
                <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <h3>Response Time</h3>
              <p>Within 24 hours</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
