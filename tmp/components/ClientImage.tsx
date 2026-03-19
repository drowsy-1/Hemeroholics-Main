// src/components/ClientImage.tsx - update this file
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { DEFAULT_IMAGE_PATH } from '@/lib/constants';

export default function ClientImage({
                                        src,
                                        alt,
                                        className,
                                        ...props
                                    }: {
    src: string;
    alt: string;
    className?: string;
    [key: string]: any;
}) {
    const [imgSrc, setImgSrc] = useState<string>(src); // Start with actual src
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        // Update img source if prop changes
        setImgSrc(src);
    }, [src]);

    return (
        <div className="relative w-full h-full">
            <Image
                src={isError ? DEFAULT_IMAGE_PATH : imgSrc}
                alt={alt || "Daylily image"}
                className={`${className || ''} transition-opacity duration-300`}
                {...props}
                onError={() => {
                    console.log(`Image load error: ${imgSrc}`);
                    setIsError(true);
                }}
                unoptimized={true} // This can help with Safari compatibility
            />
        </div>
    );
}