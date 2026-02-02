import React from 'react'
import { motion } from 'framer-motion'
import './PrivacyPolicy.css'

const PrivacyPolicy = () => {
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
      title: "1. Introduction & Overview",
      content: [
        "Sumukh Visuals ('Company', 'we', 'our', or 'us') operates the website and digital product platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
        "We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our Terms and Conditions."
      ]
    },
    {
      title: "2. Information Collection & Usage",
      subsections: [
        {
          subtitle: "2.1 Personal Identification Information",
          items: [
            "Full Name",
            "Email Address",
            "Phone Number",
            "Country/Location",
            "Billing Address (when applicable)"
          ]
        },
        {
          subtitle: "2.2 Payment Information",
          content: "Payment processing is handled exclusively through Razorpay Payments Private Limited (a licensed payment aggregator and gateway provider). We do NOT store your complete credit/debit card details. Razorpay securely processes and stores all payment information in compliance with PCI DSS standards. For details, refer to Razorpay's Privacy Policy."
        },
        {
          subtitle: "2.3 Automatically Collected Data",
          items: [
            "IP Address & Device Information",
            "Browser Type, Version & Operating System",
            "Pages Visited, Time Spent & Click Patterns",
            "Referrer URLs",
            "Cookie & Session Data",
            "Crash Reports & Performance Metrics"
          ]
        }
      ]
    },
    {
      title: "3. Purpose of Data Collection",
      content: [
        "Account Creation & Management - Create and maintain your user account",
        "Order Processing - Process purchases and digital product deliveries",
        "Payment Facilitation - Enable secure transactions via Razorpay",
        "Service Delivery - Send download links and order confirmations",
        "Customer Support - Respond to inquiries, complaints, and issues",
        "Communication - Send transactional and promotional emails (with consent)",
        "Analytics & Improvement - Analyze usage patterns to enhance our service",
        "Fraud Prevention - Detect and prevent fraudulent activities",
        "Legal Compliance - Meet regulatory and legal obligations"
      ]
    },
    {
      title: "4. Data Sharing & Third-Party Services",
      subsections: [
        {
          subtitle: "4.1 Razorpay Integration",
          content: "Razorpay Payments Private Limited processes all payments. They collect payment information, transaction details, and device information as per their privacy policies. We share your name and email with Razorpay for payment verification."
        },
        {
          subtitle: "4.2 Other Service Providers",
          items: [
            "Firebase (Google Cloud) - Authentication, user data management, and cloud infrastructure",
            "Cloudinary - Image storage, optimization, and content delivery",
            "Email Service Providers - Transactional and marketing email delivery"
          ]
        },
        {
          subtitle: "4.3 Legal Requirements",
          content: "We may disclose personal information if required by law or in response to valid requests from legal authorities, courts, or government agencies."
        }
      ]
    },
    {
      title: "5. Data Security & Protection",
      subsections: [
        {
          subtitle: "5.1 Security Measures",
          items: [
            "SSL/TLS Encryption for data in transit",
            "Secure password hashing and salting",
            "Regular security audits and penetration testing",
            "Restricted access controls and role-based permissions",
            "Two-factor authentication for sensitive accounts",
            "HTTPS protocol across the entire website"
          ]
        },
        {
          subtitle: "5.2 Security Disclaimer",
          content: "While we implement industry-leading security measures, no transmission method over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security but commit to best practices."
        }
      ]
    },
    {
      title: "6. Digital Product Download Links",
      subsections: [
        {
          subtitle: "6.1 Link Management",
          items: [
            "Download links are generated and encrypted after successful payment",
            "Links contain unique identifiers tied to your purchase",
            "Links are sent to your registered email address within minutes",
            "Links remain valid for lifetime access - they never expire"
          ]
        },
        {
          subtitle: "6.2 Security & Access",
          items: [
            "Only verified buyers can access their download links",
            "Sharing download links is prohibited and monitored",
            "Multiple failed download attempts trigger security alerts",
            "Account suspension may result from sharing or unauthorized distribution"
          ]
        }
      ]
    },
    {
      title: "7. Data Retention Policy",
      content: [
        "Account Data: Retained as long as your account is active",
        "Transaction Data: Retained for 7 years to comply with financial regulations",
        "Download Links: Retained indefinitely for your lifetime access",
        "Email Communications: Retained for service & legal compliance purposes",
        "Marketing Data: Retained until you unsubscribe or withdraw consent",
        "You may request data deletion at any time (except legally required records)"
      ]
    },
    {
      title: "8. Your Privacy Rights & Choices",
      subsections: [
        {
          subtitle: "8.1 Access & Portability",
          content: "You have the right to request and download a copy of all your personal data in a machine-readable format."
        },
        {
          subtitle: "8.2 Correction & Updates",
          content: "You can access and update your profile information anytime from your account dashboard."
        },
        {
          subtitle: "8.3 Deletion & Erasure",
          content: "You may request deletion of your account and associated data. Some data may be retained for legal/financial compliance."
        },
        {
          subtitle: "8.4 Marketing Opt-Out",
          content: "Unsubscribe from promotional emails anytime using the link in our emails or account settings."
        },
        {
          subtitle: "8.5 Contact for Rights",
          content: "Email sumukhvisuals@gmail.com with 'Privacy Rights Request' to exercise any of these rights. We respond within 30 days."
        }
      ]
    },
    {
      title: "9. Cookies & Tracking Technologies",
      subsections: [
        {
          subtitle: "9.1 Cookie Usage",
          content: "We use cookies for authentication, preferences, analytics, and fraud prevention. Types include: Session Cookies (temporary), Persistent Cookies (long-term), and Third-party Cookies (analytics partners)."
        },
        {
          subtitle: "9.2 Cookie Control",
          content: "You can disable cookies in your browser settings, but this may impact website functionality and user experience."
        }
      ]
    },
    {
      title: "10. International Data Transfers",
      content: [
        "Your data may be stored and processed in India and other countries where our service providers operate.",
        "These countries may have different data protection laws than your home country.",
        "By using our Service, you consent to such transfers and processing."
      ]
    },
    {
      title: "11. Children's Privacy",
      content: [
        "Our Service is not intended for individuals under 18 years old.",
        "We do not knowingly collect personal information from children under 13.",
        "If we become aware of such collection, we will delete the data immediately.",
        "Parents/guardians can contact us to request removal of children's data."
      ]
    },
    {
      title: "12. Updates & Changes to Privacy Policy",
      content: [
        "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.",
        "We will notify you of material changes via email and update the 'Last Updated' date.",
        "Your continued use of our Service after changes constitutes acceptance of the updated policy."
      ]
    },
    {
      title: "13. Contact & Grievance Redressal",
      subsections: [
        {
          subtitle: "For Privacy Inquiries:",
          content: "Email: sumukhvisuals@gmail.com\nSubject: Privacy Policy Inquiry\nResponse Time: Within 7 business days"
        },
        {
          subtitle: "For Complaints:",
          content: "Email: sumukhvisuals@gmail.com\nSubject: Privacy Complaint\nWe investigate and respond within 30 days with resolution details."
        }
      ]
    }
  ]

  return (
    <motion.div
      className='privacy-page'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className='policy-wrapper'>
        {/* Header */}
        <motion.div className='policy-header' variants={itemVariants} initial='hidden' animate='visible'>
          <h1>Privacy Policy</h1>
          <p className='last-updated'>Last Updated: January 2025</p>
          <div className='policy-intro'>
            <p>
              At Sumukh Visuals, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
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
            If you have questions about this Privacy Policy, please contact us at <a href="mailto:sumukhvisuals@gmail.com">sumukhvisuals@gmail.com</a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PrivacyPolicy
