import React, { useState, useContext, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { NotificationContext } from '../context/NotificationContext'
// import.meta.env.VITE_BACKEND_URL is used directly
import './Contacts.css'
import emailjs from '@emailjs/browser'

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)
  const { success, error: showError } = useContext(NotificationContext)

  // Initialize EmailJS on component mount
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

  const formRef = useRef(null)

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
      // Optionally keep logging to backend for records
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      }).catch(() => {/* ignore backend logging failure */})

      setSubmitted(true)
      success('Thank you! Your message has been sent')
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', message: '' })
        setSubmitted(false)
      }, 2000)
    } catch (err) {
      showError('Unable to send message. Please try again')
    }
  }

  const handleWhatsApp = () => {
    const { name, email, phone, message } = formData
    
    if (!message.trim()) {
      showError('Please write a message before sending')
      return
    }

    const whatsappMessage = `Hi Sumukh!\n\nName: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`
    
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappUrl = `https://wa.me/919084716627?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
    
    // Clear form after sending via WhatsApp
    setFormData({ name: '', email: '', phone: '', message: '' })
    success('Message sent via WhatsApp')
  }

  const handleEmail = async () => {
    const { name, email, phone, message } = formData
    
    if (!message.trim()) {
      showError('Please write a message before sending')
      return
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE
    const userId = import.meta.env.VITE_EMAILJS_USER
    const receiver = import.meta.env.VITE_CONTACT_RECEIVER

    const templateParams = {
      name: name || 'Not provided',
      email: email || 'Not provided',
      phone: phone || 'Not provided',
      project_type: formData.projectType || 'Not provided',
      budget: formData.budget || 'Not provided',
      message: message || 'Not provided',
      time: new Date().toLocaleString(),
      to_email: receiver
    }

    try {
      if (!serviceId || !templateId || !userId) {
        throw new Error('EmailJS not configured')
      }

      await emailjs.send(serviceId, templateId, templateParams, userId)
      success('Thank you! Your message has been sent via email')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      showError('Unable to send message. Please try again')
    }
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
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  return (
    <motion.div 
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="contact-header"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <h1 className='pt-5'>Get In Touch</h1>
        <p>Have a project in mind? Let's work together to create something amazing</p>
      </motion.div>

      <motion.div 
        className="contact-main"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.form 
          className="contact-form" 
          onSubmit={handleSubmit}
          variants={itemVariants}
        >
          <h2>Send a Message</h2>
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 (optional)"
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project..."
              rows="5"
              required
            ></textarea>
          </div>

          <div className="button-group">
            <motion.button 
              type="button" 
              className="whatsapp-btn"
              onClick={handleWhatsApp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                <path d="M17.472 14.382c-1.297-1.297-1.297-3.4 0-4.697l-2.121-2.121c-1.297 1.297-3.4 1.297-4.697 0-1.297-1.297-1.297-3.4 0-4.697l2.121-2.121c-1.297-1.297-3.4-1.297-4.697 0-2.594 2.594-2.594 6.799 0 9.393l8.485-8.485c1.297-1.297 3.4-1.297 4.697 0s1.297 3.4 0 4.697l-8.485 8.485c-2.594 2.594-6.799 2.594-9.393 0-2.594-2.594-2.594-6.799 0-9.393"></path>
              </svg>
              Send via WhatsApp
            </motion.button>

            <motion.button 
              type="button" 
              className="email-btn"
              onClick={handleEmail}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="btn-icon">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-10 5L2 7"></path>
              </svg>
              Send via Email
            </motion.button>
          </div>
        </motion.form>

        <motion.div 
          className="contact-info"
          variants={itemVariants}
        >
          <h2>Contact Info</h2>
          
          <motion.div 
            className="info-item"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-10 5L2 7"></path>
            </svg>
            <div className="info-text">
              <h4>Email</h4>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sumukhvisuals@gmail.com" target="_blank" rel="noopener noreferrer">sumukhvisuals@gmail.com</a>
            </div>
          </motion.div>

          <motion.div 
            className="info-item"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-1.297-1.297-1.297-3.4 0-4.697l-2.121-2.121c-1.297 1.297-3.4 1.297-4.697 0-1.297-1.297-1.297-3.4 0-4.697l2.121-2.121c-1.297-1.297-3.4-1.297-4.697 0-2.594 2.594-2.594 6.799 0 9.393l8.485-8.485c1.297-1.297 3.4-1.297 4.697 0s1.297 3.4 0 4.697l-8.485 8.485c-2.594 2.594-6.799 2.594-9.393 0-2.594-2.594-2.594-6.799 0-9.393"></path>
            </svg>
            <div className="info-text">
              <h4>WhatsApp</h4>
              <a href="https://wa.me/919084716627" target="_blank" rel="noopener noreferrer">+91 9084716627</a>
            </div>
          </motion.div>

          <motion.div 
            className="info-item"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <div className="info-text">
              <h4>Phone</h4>
              <a href="tel:+919084716627">+91 9084716627</a>
            </div>
          </motion.div>

          <motion.div 
            className="info-item"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <div className="info-text">
              <h4>Response</h4>
              <p>Within 24 hours</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default Contacts