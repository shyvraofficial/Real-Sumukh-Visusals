import React from 'react'
import { motion } from 'framer-motion'
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaArrowRight } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'Portfolio', href: '/' },
    { label: 'Shop', href: '/collection' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: null, action: 'services' },
    { label: 'Contact', href: '/contact' }
  ]

  const scrollToServices = () => {
    const servicesElement = document.getElementById('services')
    if (servicesElement) {
      servicesElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNavigation = (link) => {
    if (link.action === 'services') {
      if (location.pathname === '/') {
        scrollToServices()
      } else {
        navigate('/#services')
      }
      return
    }

    if (link.href) {
      navigate(link.href)
    }
  }

  const socialLinks = [
    { icon: FaInstagram, href: 'https://instagram.com/sumukhvisuals', label: 'Instagram' },
    { icon: FaYoutube, href: 'https://youtube.com/@sumukhvisuals', label: 'YouTube' },
    { icon: FaLinkedin, href: 'https://linkedin.com/in/sumukhvisuals', label: 'LinkedIn' },
    { icon: FaTwitter, href: 'https://twitter.com/sumukhvisuals', label: 'Twitter' }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-content">
          {/* Brand Column */}
          <motion.div
            className="footer-section footer-brand"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3>Sumukh Visuals</h3>
            <p>Premium video editing & content creation for brands, creators, and businesses.</p>
            <div className="social-icons-footer ">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link !h-[3rem] !w-[3rem]"
                    title={social.label}
                  >
                    <IconComponent />
                  </a>
                )
              })}
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4>Explore</h4>
            <ul className="footer-links">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" onClick={(e) => {
                    e.preventDefault()
                    handleNavigation(link)
                  }}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Info Column */}
          <motion.div
            className="footer-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4>Contact</h4>
            <div className="footer-contact">
              <p>
                <span className="label">Email</span>
                <a href="mailto:sumukhvisuals@gmail.com">sumukhvisuals@gmail.com</a>
              </p>
              <p>
                <span className="label">WhatsApp</span>
                <a href="https://wa.me/919084716627" target="_blank" rel="noopener noreferrer">+91 9084716627</a>
              </p>
              <p>
                <span className="label">Location</span>
                <span>India</span>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">&copy; 2025 Sumukh Visuals. All rights reserved.</p>
          <div className="footer-links-bottom">
            <a href="/privacy">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="/terms">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
