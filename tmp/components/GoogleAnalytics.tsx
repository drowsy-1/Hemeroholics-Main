// src/components/GoogleAnalytics.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

// Declare the gtag function for TypeScript
declare global {
    interface Window {
        gtag: (
            command: string,
            action: string,
            params?: Record<string, any>
        ) => void;
        dataLayer: any[];
    }
}

export default function GoogleAnalytics({ measurementId }: { measurementId: string }) {
    // Instead of using usePathname and useSearchParams,
    // we'll use the window object directly on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleRouteChange = () => {
                const url = window.location.pathname + window.location.search;
                window.gtag('event', 'page_view', {
                    page_location: window.location.href,
                    page_path: url,
                    page_title: document.title,
                    send_to: measurementId
                });
            };

            // Track initial page load
            handleRouteChange();

            // Use history API to detect client-side route changes
            const originalPushState = window.history.pushState;
            window.history.pushState = function() {
                // @ts-ignore - calling original method with 'arguments'
                originalPushState.apply(this, arguments);
                handleRouteChange();
            };

            // Handle browser back/forward buttons
            window.addEventListener('popstate', handleRouteChange);

            return () => {
                window.history.pushState = originalPushState;
                window.removeEventListener('popstate', handleRouteChange);
            };
        }
    }, [measurementId]);

    // Handle errors for gtag loading
    const handleGtagError = () => {
        console.error('Error loading Google Analytics');
    };

    return (
        <>
            {/* Google tag (gtag.js) - Google Analytics 4 */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                onError={handleGtagError}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        
                        // Basic configuration
                        gtag('config', '${measurementId}', {
                            page_path: window.location.pathname,
                            cookie_flags: 'SameSite=None;Secure',
                            cookie_domain: 'none',
                            send_page_view: true,
                        });
                        
                        // Add enhanced link attribution
                        gtag('set', 'link_attribution', true);

                        // Set user properties
                        gtag('set', 'user_properties', {
                            app_name: 'Rice Daylilies',
                            app_version: '1.0.0',
                            page_type: 'web'
                        });
                        
                        // Add any custom events you want to track here
                        // Example: tracking outbound email clicks
                        document.addEventListener('click', function(e) {
                            const target = e.target;
                            if (target instanceof HTMLAnchorElement && 
                                target.href && 
                                target.href.indexOf('mailto:') === 0) {
                                gtag('event', 'email_click', {
                                    email_address: target.href.substring(7),
                                    page_location: window.location.href
                                });
                            }
                        });
                    `
                }}
            />
        </>
    );
}