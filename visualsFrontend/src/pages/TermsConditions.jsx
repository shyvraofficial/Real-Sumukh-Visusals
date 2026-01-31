import React from 'react'
import { motion } from 'framer-motion'
import './TermsConditions.css'

const TermsConditions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  }

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using the Sumukh Visuals website and purchasing digital products, you agree to be bound by these Terms and Conditions.",
        "If you do not agree to these terms, you must immediately discontinue use of our service.",
        "We reserve the right to modify these terms at any time. Continued use constitutes acceptance of updated terms."
      ]
    },
    {
      title: "2. Definitions",
      subsections: [
        {
          subtitle: "2.1 'Service' includes:",
          items: [
            "The Sumukh Visuals website and all associated pages",
            "Digital products (audio tracks, templates, effects, presets)",
            "Customer support and account management features",
            "Payment processing and order fulfillment"
          ]
        },
        {
          subtitle: "2.2 'User' or 'Customer' means:",
          items: [
            "Any individual accessing our website",
            "Any person purchasing digital products from us",
            "Legal entities or businesses purchasing for commercial use"
          ]
        }
      ]
    },
    {
      title: "3. Website Usage License",
      subsections: [
        {
          subtitle: "3.1 Grant of License",
          content: "We grant you a limited, non-exclusive, non-transferable license to access and use our website for lawful purposes only."
        },
        {
          subtitle: "3.2 Restrictions",
          items: [
            "Do not modify, copy, or distribute website content without permission",
            "Do not reverse engineer, decompile, or disassemble any software",
            "Do not attempt unauthorized access to our systems",
            "Do not use automated tools, bots, or scrapers",
            "Do not engage in any form of hacking or cybercrime",
            "Do not violate applicable laws or regulations"
          ]
        }
      ]
    },
    {
      title: "4. Digital Products License",
      subsections: [
        {
          subtitle: "4.1 License Grant",
          content: "Upon payment confirmation, you receive a non-exclusive, non-transferable, revocable license to use purchased digital products. This is NOT a transfer of ownership - you remain a licensee."
        },
        {
          subtitle: "4.2 Permitted Uses",
          items: [
            "Personal projects and portfolios",
            "Commercial client projects",
            "YouTube videos and streaming content",
            "Social media content (TikTok, Instagram, etc.)",
            "Films, documentaries, and web series",
            "Educational and training materials",
            "Corporate videos and presentations",
            "Product demos and advertisements"
          ]
        },
        {
          subtitle: "4.3 Prohibited Uses",
          items: [
            "Reselling, redistributing, or sharing digital products",
            "Sharing download links or account access",
            "Sublicensing or leasing products to third parties",
            "Using for illegal, adult, or violent content",
            "Claiming products as your own original creation",
            "Packaging and reselling as templates or presets",
            "Using in NFTs without explicit written permission",
            "Using in competing music/SFX libraries",
            "Removing copyright or ownership notices"
          ]
        },
        {
          subtitle: "4.4 Attribution",
          content: "While attribution is appreciated, it is not mandatory for most products. However, you must comply with any specific attribution requirements mentioned at purchase."
        }
      ]
    },
    {
      title: "5. Intellectual Property Rights",
      subsections: [
        {
          subtitle: "5.1 Our Ownership",
          content: "All digital products, website content, logos, graphics, and trademarks are owned by Sumukh Visuals or licensed from third parties. These are protected by international copyright and intellectual property laws."
        },
        {
          subtitle: "5.2 Your Content",
          content: "You retain ownership of any content you create using our products. However, you grant us a non-exclusive right to use your work for portfolio and marketing purposes (with permission)."
        }
      ]
    },
    {
      title: "6. Product Descriptions & Availability",
      subsections: [
        {
          subtitle: "6.1 Accuracy",
          content: "We strive to provide accurate product descriptions, previews, and specifications. However, we do not guarantee complete accuracy and are not liable for minor discrepancies."
        },
        {
          subtitle: "6.2 Product Changes",
          content: "We may update or discontinue products at any time. Updates to existing products are provided free to previous buyers."
        },
        {
          subtitle: "6.3 Preview vs. Final",
          content: "Product previews may differ slightly from final files due to compression or format conversion. All files are tested before delivery."
        }
      ]
    },
    {
      title: "7. Pricing & Payment",
      subsections: [
        {
          subtitle: "7.1 Pricing",
          items: [
            "Prices are displayed in INR and are subject to change without notice",
            "Price changes do not affect confirmed orders",
            "All prices include applicable taxes and GST"
          ]
        },
        {
          subtitle: "7.2 Payment Processing",
          content: "Payments are processed securely through Razorpay Payments Private Limited. By proceeding with payment, you authorize Razorpay to charge your selected payment method."
        },
        {
          subtitle: "7.3 Payment Methods",
          content: "We accept credit cards, debit cards, UPI, net banking, digital wallets, and other payment methods supported by Razorpay."
        },
        {
          subtitle: "7.4 Failed Transactions",
          content: "If a transaction fails, you will not be charged. You can attempt payment again or contact support."
        }
      ]
    },
    {
      title: "8. Order & Download Management",
      subsections: [
        {
          subtitle: "8.1 Order Confirmation",
          content: "Upon successful payment, you will receive an order confirmation email with download links within 5 minutes."
        },
        {
          subtitle: "8.2 Download Links",
          items: [
            "Links are valid for lifetime access - they never expire",
            "You can download files anytime from your account",
            "Links remain accessible as long as your account is active",
            "You are responsible for backup and storage of files"
          ]
        },
        {
          subtitle: "8.3 Link Security",
          content: "Do not share download links with others. Links contain encrypted identifiers tied to your purchase. Sharing may result in permanent account suspension."
        }
      ]
    },
    {
      title: "9. Refunds & Returns Policy",
      subsections: [
        {
          subtitle: "9.1 Digital Products Policy",
          content: "Since digital products are immediately delivered and can be used instantly, refunds are generally NOT available after download or use."
        },
        {
          subtitle: "9.2 Refund Exceptions",
          content: "Refunds MAY be considered in cases of: (a) Payment processing errors, (b) Duplicate charges, (c) Unauthorized purchases, (d) Technical delivery failures, (e) Corrupt or damaged files"
        },
        {
          subtitle: "9.3 Refund Process",
          items: [
            "Contact support within 7 days of purchase",
            "Provide order ID and proof of purchase",
            "Include detailed explanation of issue",
            "Refunds processed within 5-7 business days",
            "Refunds returned to original payment method"
          ]
        }
      ]
    },
    {
      title: "10. User Accounts & Responsibilities",
      subsections: [
        {
          subtitle: "10.1 Account Creation",
          content: "You are responsible for maintaining the confidentiality of your login credentials. Do not share your password with anyone."
        },
        {
          subtitle: "10.2 Account Responsibility",
          content: "You are responsible for all activities under your account. You must notify us immediately of any unauthorized access."
        },
        {
          subtitle: "10.3 Account Termination",
          content: "We may suspend or terminate your account if you violate these terms, engage in fraud, or misuse our service."
        }
      ]
    },
    {
      title: "11. Disclaimer of Warranties",
      subsections: [
        {
          subtitle: "11.1 'As-Is' Service",
          content: "Our website and digital products are provided on an 'AS-IS' and 'AS-AVAILABLE' basis without warranties of any kind, express or implied."
        },
        {
          subtitle: "11.2 Warranties Disclaimed",
          content: "We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement of third-party rights."
        }
      ]
    },
    {
      title: "12. Limitation of Liability",
      subsections: [
        {
          subtitle: "12.1 Liability Cap",
          content: "In no event shall Sumukh Visuals, its directors, employees, or agents be liable for indirect, incidental, special, consequential, or punitive damages arising from your use of our service."
        },
        {
          subtitle: "12.2 Maximum Liability",
          content: "Our total liability is limited to the amount you paid for the product in question."
        }
      ]
    },
    {
      title: "13. Third-Party Services",
      subsections: [
        {
          subtitle: "13.1 Third-Party Links",
          content: "Our website may contain links to third-party websites. We are not responsible for their content, policies, or practices."
        },
        {
          subtitle: "13.2 Service Providers",
          items: [
            "Razorpay - Payment processing and gateway",
            "Firebase - Authentication and data infrastructure",
            "Cloudinary - Image hosting and optimization"
          ]
        },
        {
          subtitle: "13.3 Third-Party Policies",
          content: "These providers have their own terms and privacy policies. Your use is subject to their policies as well."
        }
      ]
    },
    {
      title: "14. Prohibited Activities",
      content: [
        "Do not post or transmit unlawful, threatening, abusive, defamatory, or obscene material",
        "Do not disrupt or interfere with normal operations of our service",
        "Do not attempt to gain unauthorized access to our systems",
        "Do not engage in harassment, abuse, or cyberstalking",
        "Do not reverse engineer or attempt to break security features",
        "Do not use our service for illegal activities or fraud",
        "Do not violate any applicable laws or regulations"
      ]
    },
    {
      title: "15. Indemnification",
      content: [
        "You agree to indemnify and hold harmless Sumukh Visuals from any claims, damages, or costs (including legal fees) arising from:",
        "Your use of our service",
        "Your violation of these terms",
        "Your infringement of third-party intellectual property rights",
        "Your illegal activities"
      ]
    },
    {
      title: "16. Governing Law & Jurisdiction",
      subsections: [
        {
          subtitle: "16.1 Governing Law",
          content: "These Terms are governed by and construed in accordance with the laws of India, without regard to conflicts of law principles."
        },
        {
          subtitle: "16.2 Jurisdiction",
          content: "You irrevocably submit to the exclusive jurisdiction of courts located in India for any disputes arising from these terms."
        }
      ]
    },
    {
      title: "17. Contact Information",
      subsections: [
        {
          subtitle: "For Questions or Support:",
          content: "Email: sumukh@example.com\nResponse Time: Within 24-48 hours"
        },
        {
          subtitle: "For Legal Notices:",
          content: "Email: sumukh@example.com\nSubject: Legal Notice\nOfficial notification must be sent via email"
        }
      ]
    }
  ]

  return (
    <motion.div
      className='terms-page'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='policy-wrapper'>
        {/* Header */}
        <motion.div className='policy-header' variants={itemVariants} initial='hidden' animate='visible'>
          <h1>Terms & Conditions</h1>
          <p className='last-updated'>Last Updated: January 2025</p>
          <div className='policy-intro'>
            <p>
              These Terms and Conditions govern your use of Sumukh Visuals website and purchase of digital products. Please read them carefully before making any purchases.
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div className='policy-body' variants={containerVariants} initial='hidden' animate='visible'>
          {sections.map((section, idx) => (
            <motion.section key={idx} className='policy-section' variants={itemVariants}>
              <h2>{section.title}</h2>

              {section.content && (
                <div className='section-content'>
                  {Array.isArray(section.content) ? (
                    <ul className='content-list'>
                      {section.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
              )}

              {section.subsections && (
                <div className='subsections'>
                  {section.subsections.map((sub, i) => (
                    <div key={i} className='subsection'>
                      <h3>{sub.subtitle}</h3>
                      {sub.content && <p>{sub.content}</p>}
                      {sub.items && (
                        <ul className='subsection-list'>
                          {sub.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div className='policy-footer' variants={itemVariants}>
          <p>
            If you have questions about these Terms and Conditions, please contact us at <a href="mailto:sumukh@example.com">sumukh@example.com</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default TermsConditions
