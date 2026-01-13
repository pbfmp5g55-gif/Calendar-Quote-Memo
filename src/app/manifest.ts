import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Calendar Quote Memo',
        short_name: 'CalQuote',
        description: '日々の記録と、偉人たちの言葉。',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#a855f7', // primary color roughly
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}
