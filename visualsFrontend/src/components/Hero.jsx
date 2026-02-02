
import React, { useEffect, useState } from 'react';
import './Hero.css';
import { assets } from '../assets/assets'
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

const Hero = () => {
  const [imageError, setImageError] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Use the image path from assets directly
  const ronaldImage = assets.ronald_image;

  const handleImageError = () => {
    setImageError(true);
  };

  const socials = [
    { icon: FaGithub, link: 'https://github.com/', label: 'GitHub' },
    { icon: FaLinkedin, link: 'https://linkedin.com/', label: 'LinkedIn' },
    { icon: FaTwitter, link: 'https://twitter.com/', label: 'Twitter' },
    { icon: FaInstagram, link: 'https://instagram.com/', label: 'Instagram' }
  ];

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className={`hero${animate ? ' hero-animate' : ''}`} id="home">
      <div className="hero-split">
        <div className="hero-left">
          <div className="hero-left-inner">
            <div className="hero-image-mobile-wrap">
              {!imageError && ronaldImage ? (
                <img
                  src={ronaldImage}
                  alt="Sumukh Hero"
                  className="hero-image-mobile"
                  onError={handleImageError}
                />
              ) : null}
            </div>
            <h1 className="hero-title">
              Hello!&nbsp;
               I'm Sumukh
              a Video
              Editor.
            </h1>
            <p className="hero-description">
            I work with creators and personal brands to turn raw footage into engaging talking-head, fitness, and cinematic content that holds attention.
            </p>
            <div className="hero-buttons">
              <a href="/contact" className="hero-btn primary">
                Book a free call
              </a>
              <a
                href="#work"
                className="hero-btn secondary"
                onClick={(e) => {
                  e.preventDefault();
                  const workSection = document.getElementById('work');
                  if (workSection) {
                    workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                View project
              </a>
            </div>
            <div className="hero-social">
              {socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link "
                  title={social.label}
                  aria-label={social.label} 
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-right-inner">
            <div className="hero-image-animate">
              {!imageError && ronaldImage ? (
                <img
                  src={ronaldImage}
                  alt="Ronald - Web Developer"
                  className="hero-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="hero-image-placeholder">
                  <p>Add your portrait image to src/assets/ronald-image.png (or .jpg)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;