// src/components/EmailLink.tsx
'use client';

import { Mail } from 'lucide-react';

interface EmailLinkProps {
    daylily: {
        name: string;
        availability?: string;
    };
}

export default function EmailLink({ daylily }: EmailLinkProps) {
    return (
        <a
        href={`mailto:daylilymagic@yahoo.com?subject=Variety%20Inquiry%20-%20${encodeURIComponent(daylily.name)}%20&body=I%20am%20interested%20in%20the%20variety%20${encodeURIComponent(daylily.name)}%20.%20Please%20provide%20information%20about%20its%20availability%20and%20pricing.`}
        className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer mt-2"
        onClick={(e) => {
        e.stopPropagation(); // Stop event propagation
         }}
        >
        <span className="italic group-hover:underline text-sm">
                {daylily.availability || "Email For Availability"}
        </span>
            <Mail className="h-4 w-4 transition-colors group-hover:text-primary" />
        </a>
);
}