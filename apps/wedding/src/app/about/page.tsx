'use client';

import {
  WEDDING_DATE,
  VENUE,
  SCHEDULE,
  DRESS_CODE,
  ACCOMMODATIONS,
  ADDITIONAL_INFO,
} from '@/lib/constants';
import { FadeIn, SlideIn, StaggerContainer } from '@/components/animations';
import { motion } from 'framer-motion';
import styles from './page.module.css';

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <FadeIn duration={0.8}>
          <h1 className={styles.heading}>About the Day</h1>
        </FadeIn>

        <FadeIn delay={0.2} duration={0.6}>
          <p className={styles.date}>{WEDDING_DATE}</p>
        </FadeIn>

        {/* Venue Section */}
        <SlideIn direction="left" delay={0.3}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Venue</h2>
            <div className={styles.venueInfo}>
              <h3 className={styles.venueName}>{VENUE.name}</h3>
              <address className={styles.address}>
                {VENUE.address}<br />
                {VENUE.city}<br />
                {VENUE.postcode}
              </address>
              <p className={styles.venueDescription}>{VENUE.description}</p>
            </div>
          </section>
        </SlideIn>

        {/* Schedule Section */}
        <SlideIn direction="right" delay={0.1}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Schedule</h2>
            <StaggerContainer staggerDelay={0.15} className={styles.timeline}>
              {SCHEDULE.map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className={styles.timelineItem}
                >
                  <div className={styles.time}>{item.time}</div>
                  <div className={styles.event}>
                    <h3 className={styles.eventName}>{item.event}</h3>
                    {item.description && (
                      <p className={styles.eventDescription}>{item.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </section>
        </SlideIn>

        {/* Dress Code Section */}
        <SlideIn direction="left" delay={0.1}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Dress Code</h2>
            <div className={styles.dressCode}>
              <h3 className={styles.dressCodeTitle}>{DRESS_CODE.title}</h3>
              <p className={styles.dressCodeDescription}>{DRESS_CODE.description}</p>
              {DRESS_CODE.note && (
                <p className={styles.dressCodeNote}>{DRESS_CODE.note}</p>
              )}
            </div>
          </section>
        </SlideIn>

        {/* Accommodations Section */}
        <SlideIn direction="right" delay={0.1}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Accommodations</h2>
            <p className={styles.accommodationsIntro}>
              We&apos;ve listed some nearby hotels for your convenience:
            </p>
            <StaggerContainer staggerDelay={0.1} className={styles.accommodationsList}>
              {ACCOMMODATIONS.map((hotel, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={styles.accommodation}
                >
                  <h3 className={styles.accommodationName}>{hotel.name}</h3>
                  <p className={styles.accommodationAddress}>{hotel.address}</p>
                  <p className={styles.accommodationDistance}>{hotel.distance}</p>
                  {hotel.phone && (
                    <p className={styles.accommodationContact}>
                      Phone: <a href={`tel:${hotel.phone.replace(/\s/g, '')}`}>{hotel.phone}</a>
                    </p>
                  )}
                  {hotel.website && (
                    <p className={styles.accommodationWebsite}>
                      <a href={hotel.website} target="_blank" rel="noopener noreferrer">
                        Visit website
                      </a>
                    </p>
                  )}
                </motion.div>
              ))}
            </StaggerContainer>
          </section>
        </SlideIn>

        {/* Additional Information */}
        <SlideIn direction="left" delay={0.1}>
          <section className={styles.section}>
            <h2 className={styles.sectionHeading}>Good to Know</h2>
            <StaggerContainer staggerDelay={0.1} className={styles.additionalInfo}>
              {ADDITIONAL_INFO.parking && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className={styles.infoItem}
                >
                  <h3 className={styles.infoTitle}>Parking</h3>
                  <p>{ADDITIONAL_INFO.parking}</p>
                </motion.div>
              )}
              {ADDITIONAL_INFO.accessibility && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className={styles.infoItem}
                >
                  <h3 className={styles.infoTitle}>Accessibility</h3>
                  <p>{ADDITIONAL_INFO.accessibility}</p>
                </motion.div>
              )}
              {ADDITIONAL_INFO.children && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className={styles.infoItem}
                >
                  <h3 className={styles.infoTitle}>Children</h3>
                  <p>{ADDITIONAL_INFO.children}</p>
                </motion.div>
              )}
              {ADDITIONAL_INFO.gifts && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  className={styles.infoItem}
                >
                  <h3 className={styles.infoTitle}>Gifts</h3>
                  <p>{ADDITIONAL_INFO.gifts}</p>
                </motion.div>
              )}
            </StaggerContainer>
          </section>
        </SlideIn>
      </div>
    </main>
  );
}
