// src/components/DaylilyImage.tsx
'use client';  // This marks it as a client component

import Image from 'next/image';
import { getImageUrl, DEFAULT_IMAGE_PATH } from '@/lib/constants';
import { useState } from 'react';

interface DaylilyImageProps {
    src: string;
    alt: string;
    priority?: boolean;
    className?: string;
    sizes?: string;
}

export default function DaylilyImage({
                                         src,
                                         alt,
                                         priority = false,
                                         className = "object-cover",
                                         sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                     }: DaylilyImageProps) {
    const [imgSrc, setImgSrc] = useState(getImageUrl(src));

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={className}
            onError={() => setImgSrc(DEFAULT_IMAGE_PATH)}
        />
    );
}