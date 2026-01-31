import React from 'react'
import { motion } from 'framer-motion'
import { FaInstagram, FaYoutube, FaLinkedin, FaTwitter, FaArrowRight } from 'react-icons/fa'
import './Footer.css'

const Footer = () => {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Services', href: '/#services' },
    { label: 'Shop', href: '/shop' },
    { label: 'Contact', href: '/contact' }
  ]

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
                  <a href={link.href}>{link.label}</a>
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
                <a href="mailto:sumukh@example.com">sumukh@example.com</a>
              </p>
              <p>
                <span className="label">WhatsApp</span>
                <a href="https://wa.me/917xxxx-xxxx" target="_blank" rel="noopener noreferrer">+91 XXXX XXXX</a>
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
          <p>&copy; 2025 Sumukh Visuals. All rights reserved.</p>
          <div className="footer-links-bottom">
            <a href="/privacy">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
