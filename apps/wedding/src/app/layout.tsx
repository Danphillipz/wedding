import './global.css';
import Navigation from '@/components/Navigation/Navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Amy & Dan\'s Wedding | July 2, 2026',
    template: '%s | Amy & Dan\'s Wedding',
  },
  description: 'Join us as we celebrate our wedding on July 2, 2026 at Thorpe Gardens in Tamworth. RSVP and view wedding details.',
  keywords: ['wedding', 'Amy and Dan', 'Thorpe Gardens', 'Tamworth', 'July 2026', 'wedding RSVP'],
  authors: [{ name: 'Amy & Dan' }],
  creator: 'Amy & Dan',
  metadataBase: new URL('https://amy-and-dan-wedding.github.io'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://amy-and-dan-wedding.github.io',
    siteName: 'Amy & Dan\'s Wedding',
    title: 'Amy & Dan\'s Wedding | July 2, 2026',
    description: 'Join us as we celebrate our wedding on July 2, 2026 at Thorpe Gardens in Tamworth.',
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Amy & Dan\'s Wedding',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amy & Dan\'s Wedding | July 2, 2026',
    description: 'Join us as we celebrate our wedding on July 2, 2026 at Thorpe Gardens in Tamworth.',
    images: ['/hero.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Amy & Dan\'s Wedding',
    description: 'Wedding celebration of Amy and Dan',
    startDate: '2026-07-02T14:00:00+01:00',
    endDate: '2026-07-03T00:00:00+01:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Thorpe Gardens',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Thorpe Gardens',
        addressLocality: 'Tamworth',
        postalCode: 'B79 7XX',
        addressCountry: 'GB',
      },
    },
    organizer: {
      '@type': 'Person',
      name: 'Amy & Dan',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InviteOnly',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
