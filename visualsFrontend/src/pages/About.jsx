import React from 'react'
import './About.css'
import dumbbellIcon from '../assets/gym-near (1).png'

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <h1>About Sumukh</h1>
        <p className="about-subtitle">Professional video editor & content creator</p>
      </div>

      {/* Main Content */}
      <div className="about-container">
        {/* Introduction */}
        <section className="about-section">
          <div className="about-content">
            <h2>Hi, I'm Sumukh</h2>
            <p>
              a video editor focused on creating clean, high-impact visual content for social media.
            </p>
          </div>
        </section>

        {/* Journey */}
        <section className="about-section">
          <h2>My Journey</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3>Early Interest</h3>
              <p>
                My interest in editing and cinematography developed early and grew through years of consistent practice and hands-on work.
              </p>
            </div>
            <div className="about-card">
              <h3>Focused Craft</h3>
              <p>
                Over time, that curiosity turned into a focused craft built around strong pacing, clean visuals, and purposeful storytelling.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="about-section">
          <h2>What I Do</h2>
          <p className="about-intro">
            I work with creators and personal brands on:
          </p>
          <div className="about-services">
            <div className="service-item">
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <polyline points="8 11 12 14 16 11" />
              </svg>
              <h4>Talking-Head Reels</h4>
              <p>Clean, engaging content for personal branding</p>
            </div>
            <div className="service-item">
              <img className="service-icon" src={dumbbellIcon} alt="Dumbbell Gym Icon" />
              <h4>Gym & Fitness Content</h4>
              <p>High-energy edits that motivate and inspire</p>
            </div>
            <div className="service-item">
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" />
              </svg>
              <h4>Cinematic Visuals</h4>
              <p>Professional storytelling through visual language</p>
            </div>
          </div>
          <p className="about-highlight">
            Every edit is sharp, simple, and aligned with the creator's style. No unnecessary effects — just edits that look professional and perform well.
          </p>
        </section>

        {/* Products & Packages */}
        <section className="about-section">
          <h2>Services & Packages</h2>
          <p className="about-intro">
            Choose the editing service that fits your needs:
          </p>
          <div className="about-services">
            <div className="service-item">
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="17" x2="12" y2="20" />
              </svg>
              <h4>Social Media Edits</h4>
              <p>Short-form content optimized for Instagram, TikTok, and YouTube Shorts. 15-60 second videos with trending cuts and effects.</p>
            </div>
            <div className="service-item">
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="23 6 16 11 23 16 23 6" />
                <path d="M1 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V5" />
              </svg>
              <h4>Long-Form Content</h4>
              <p>Full YouTube videos, vlogs, and documentaries. Professional pacing with color grading, sound design, and motion graphics.</p>
            </div>
            <div className="service-item">
              <svg className="service-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="7" cy="7" r="3" />
                <path d="M20 7c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" />
                <path d="M10 17h10M4 20h12" />
              </svg>
              <h4>Custom Editing</h4>
              <p>Tailored editing solutions for your unique project. From corporate videos to personal projects, we handle it all.</p>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="about-section philosophy">
          <h2>My Philosophy</h2>
          <div className="philosophy-card">
            <p>
              I believe good editing should feel effortless to watch: <strong>clear, smooth, and intentional.</strong>
            </p>
            <p>
              Every frame should serve a purpose. Every transition should feel natural. Every edit should enhance the story, not distract from it.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="about-section cta-section">
          <h2>Let's Create Something Great</h2>
          <p>Ready to elevate your content? Let's work together.</p>
          <a href="/contact" className="cta-button">Get in Touch</a>
        </section>
      </div>
    </div>
  )
}

export default About
