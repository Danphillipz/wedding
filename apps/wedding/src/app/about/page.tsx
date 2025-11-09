import {
  WEDDING_DATE,
  VENUE,
  SCHEDULE,
  DRESS_CODE,
  ACCOMMODATIONS,
  ADDITIONAL_INFO,
} from '@/lib/constants';
import styles from './page.module.css';

export const metadata = {
  title: 'About the Day - Amy & Dan\'s Wedding',
  description: `Wedding details for ${WEDDING_DATE} at ${VENUE.name}, ${VENUE.city}`,
};

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.heading}>About the Day</h1>

        <p className={styles.date}>{WEDDING_DATE}</p>

        {/* Venue Section */}
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

        {/* Schedule Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Schedule</h2>
          <div className={styles.timeline}>
            {SCHEDULE.map((item, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.time}>{item.time}</div>
                <div className={styles.event}>
                  <h3 className={styles.eventName}>{item.event}</h3>
                  {item.description && (
                    <p className={styles.eventDescription}>{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dress Code Section */}
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

        {/* Accommodations Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Accommodations</h2>
          <p className={styles.accommodationsIntro}>
            We&apos;ve listed some nearby hotels for your convenience:
          </p>
          <div className={styles.accommodationsList}>
            {ACCOMMODATIONS.map((hotel, index) => (
              <div key={index} className={styles.accommodation}>
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
              </div>
            ))}
          </div>
        </section>

        {/* Additional Information */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Good to Know</h2>
          <div className={styles.additionalInfo}>
            {ADDITIONAL_INFO.parking && (
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Parking</h3>
                <p>{ADDITIONAL_INFO.parking}</p>
              </div>
            )}
            {ADDITIONAL_INFO.accessibility && (
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Accessibility</h3>
                <p>{ADDITIONAL_INFO.accessibility}</p>
              </div>
            )}
            {ADDITIONAL_INFO.children && (
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Children</h3>
                <p>{ADDITIONAL_INFO.children}</p>
              </div>
            )}
            {ADDITIONAL_INFO.gifts && (
              <div className={styles.infoItem}>
                <h3 className={styles.infoTitle}>Gifts</h3>
                <p>{ADDITIONAL_INFO.gifts}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
