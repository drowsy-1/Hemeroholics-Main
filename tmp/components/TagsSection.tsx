// src/components/TagsSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagsSectionProps {
    initialExpanded?: boolean;
}

export default function TagsSection({ initialExpanded = false }: TagsSectionProps) {
    const [tags, setTags] = useState<string[]>([]);
    const [expanded, setExpanded] = useState(initialExpanded);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Organize tags into categories
    const colorTags = tags.filter(tag =>
        ['Purple', 'Lavender', 'Blue', 'Pink', 'Red', 'Yellow', 'Orange', 'Cream', 'White'].includes(tag)
    );

    const patternTags = tags.filter(tag =>
        ['Eye', 'Edge', 'Watermark', 'Green Throat'].includes(tag)
    );

    const formTags = tags.filter(tag =>
        ['Unusual Form', 'Spider', 'Crispate', 'Cascade', 'Sculpted', 'Cristate', 'Relief'].includes(tag)
    );

    const seasonTags = tags.filter(tag =>
        ['Early', 'Midseason', 'Late', 'Rebloomer'].includes(tag)
    );

    const ploidyTags = tags.filter(tag =>
        ['Diploid', 'Tetraploid'].includes(tag)
    );

    const foliageTags = tags.filter(tag =>
        ['Dormant', 'Evergreen', 'Semi-Evergreen'].includes(tag)
    );

    const otherTags = tags.filter(tag =>
        !colorTags.includes(tag) &&
        !patternTags.includes(tag) &&
        !formTags.includes(tag) &&
        !seasonTags.includes(tag) &&
        !ploidyTags.includes(tag) &&
        !foliageTags.includes(tag)
    );

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                // Directly access tags from the API route
                const response = await fetch('/api/tags');

                if (!response.ok) {
                    throw new Error('Failed to fetch tags');
                }

                const data = await response.json();
                setTags(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tags:', err);
                setError('Failed to load tags. Please try again later.');
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-2 border-b">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>Loading categories...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return null; // Don't display anything if there's an error
    }

    if (tags.length === 0) {
        return null; // Don't display if no tags
    }

    // Toggle the expanded state
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    return (
        <div className="container mx-auto px-4 py-2 border-b">
            {/* Make the entire header row clickable to toggle expansion */}
            <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={toggleExpanded}
            >
                <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    <span className="font-medium">Shop by Category</span>
                </div>
                <div className="text-muted-foreground">
                    {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </div>
            </div>

            {expanded && (
                <div className="mt-3 pb-3">
                    {colorTags.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Colors</h3>
                            <div className="flex flex-wrap gap-2">
                                {colorTags.map(tag => (
                                    <Link
                                        key={tag}
                                        href={`/category/${encodeURIComponent(tag)}`}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {patternTags.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Patterns</h3>
                            <div className="flex flex-wrap gap-2">
                                {patternTags.map(tag => (
                                    <Link
                                        key={tag}
                                        href={`/category/${encodeURIComponent(tag)}`}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {formTags.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Forms</h3>
                            <div className="flex flex-wrap gap-2">
                                {formTags.map(tag => (
                                    <Link
                                        key={tag}
                                        href={`/category/${encodeURIComponent(tag)}`}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {seasonTags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Bloom Season</h3>
                                <div className="flex flex-wrap gap-2">
                                    {seasonTags.map(tag => (
                                        <Link
                                            key={tag}
                                            href={`/category/${encodeURIComponent(tag)}`}
                                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {ploidyTags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Ploidy</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ploidyTags.map(tag => (
                                        <Link
                                            key={tag}
                                            href={`/category/${encodeURIComponent(tag)}`}
                                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {foliageTags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium mb-2 text-muted-foreground">Foliage</h3>
                                <div className="flex flex-wrap gap-2">
                                    {foliageTags.map(tag => (
                                        <Link
                                            key={tag}
                                            href={`/category/${encodeURIComponent(tag)}`}
                                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {otherTags.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Other</h3>
                            <div className="flex flex-wrap gap-2">
                                {otherTags.map(tag => (
                                    <Link
                                        key={tag}
                                        href={`/category/${encodeURIComponent(tag)}`}
                                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm hover:bg-secondary/80 transition-colors"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}