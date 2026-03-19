'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {Sun, Moon, Mail} from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Daylily, FilterState, INITIAL_FILTER_STATE } from '@/types/daylily';
import { getImageUrl, DEFAULT_IMAGE_PATH } from '@/lib/constants';
import FilterPanel from './FilterPanel';
import { Card, CardContent } from './ui/card';
import ClientImage from '@/components/ClientImage';
import { createSlugFromName } from '@/lib/client-utils';
import TagsSection from './TagsSection';

// Remove any imports from daylily-data.ts

const ITEMS_PER_PAGE = 32;

export default function DaylilyGallery() {
    const [mounted, setMounted] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [daylilies, setDaylilies] = useState<Daylily[]>([]);
    const [filteredDaylilies, setFilteredDaylilies] = useState<Daylily[]>([]);
    const [displayedDaylilies, setDisplayedDaylilies] = useState<Daylily[]>([]);
    const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { resolvedTheme, setTheme } = useTheme();

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            const response = await fetch('/data/varieties.jsonl');
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim());
            const parsedData: Daylily[] = lines.map(line => JSON.parse(line));
            setDaylilies(parsedData);
            setFilteredDaylilies(parsedData);
            setDisplayedDaylilies(parsedData.slice(0, ITEMS_PER_PAGE));
            setHasMore(parsedData.length > ITEMS_PER_PAGE);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useEffect(() => {
        let filtered = [...daylilies];

        // Name search
        if (filters.search) {
            filtered = filtered.filter(d => {
                if (filters.matchType === 'exact') {
                    return d.name.toLowerCase() === filters.search.toLowerCase();
                }
                return d.name.toLowerCase().includes(filters.search.toLowerCase());
            });
        }

        // Hybridizer
        if (filters.hybridizer) {
            filtered = filtered.filter(d => {
                if (filters.hybridizerMatchType === 'exact') {
                    return d.hybridizer.toLowerCase() === filters.hybridizer.toLowerCase();
                }
                return d.hybridizer.toLowerCase().includes(filters.hybridizer.toLowerCase());
            });
        }

        // Year range
        if (filters.yearRange.start) {
            filtered = filtered.filter(d => parseInt(d.year) >= parseInt(filters.yearRange.start));
        }
        if (filters.yearRange.end) {
            filtered = filtered.filter(d => parseInt(d.year) <= parseInt(filters.yearRange.end));
        }

        // Ploidy
        if (filters.ploidy) {
            filtered = filtered.filter(d => d.ploidy === filters.ploidy);
        }

        // Bloom size
        if (filters.bloomSize.min) {
            filtered = filtered.filter(d => {
                const size = parseFloat(d.bloom_size);
                return !isNaN(size) && size >= parseFloat(filters.bloomSize.min);
            });
        }
        if (filters.bloomSize.max) {
            filtered = filtered.filter(d => {
                const size = parseFloat(d.bloom_size);
                return !isNaN(size) && size <= parseFloat(filters.bloomSize.max);
            });
        }

        // Scape height
        if (filters.scapeHeight.min) {
            filtered = filtered.filter(d => {
                const height = parseFloat(d.scape_height);
                return !isNaN(height) && height >= parseFloat(filters.scapeHeight.min);
            });
        }
        if (filters.scapeHeight.max) {
            filtered = filtered.filter(d => {
                const height = parseFloat(d.scape_height);
                return !isNaN(height) && height <= parseFloat(filters.scapeHeight.max);
            });
        }

        // Branches
        if (filters.branches.min) {
            filtered = filtered.filter(d => {
                const branches = parseFloat(d.branches);
                return !isNaN(branches) && branches >= parseFloat(filters.branches.min);
            });
        }
        if (filters.branches.max) {
            filtered = filtered.filter(d => {
                const branches = parseFloat(d.branches);
                return !isNaN(branches) && branches <= parseFloat(filters.branches.max);
            });
        }

        // Bud count
        if (filters.budCount.min) {
            filtered = filtered.filter(d => {
                const buds = parseFloat(d.bud_count);
                return !isNaN(buds) && buds >= parseFloat(filters.budCount.min);
            });
        }
        if (filters.budCount.max) {
            filtered = filtered.filter(d => {
                const buds = parseFloat(d.bud_count);
                return !isNaN(buds) && buds <= parseFloat(filters.budCount.max);
            });
        }

        // Bloom season
        if (filters.bloomSeason.length > 0) {
            filtered = filtered.filter(d => filters.bloomSeason.includes(d.bloom_season));
        }

        // Rebloom
        if (filters.rebloom) {
            filtered = filtered.filter(d =>
                d.bloom_season?.toLowerCase().includes('rebloom') ||
                d.bloom_habit?.toLowerCase().includes('rebloom') ||
                d.notes?.toLowerCase().includes('rebloom')
            );
        }

        // Foliage type
        if (filters.foliageType) {
            filtered = filtered.filter(d => d.foliage_type === filters.foliageType);
        }

        setFilteredDaylilies(filtered);
        setDisplayedDaylilies(filtered.slice(0, ITEMS_PER_PAGE));
        setPage(1);
        setHasMore(filtered.length > ITEMS_PER_PAGE);
    }, [filters, daylilies]);

    const loadMoreItems = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;
        const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newItems = filteredDaylilies.slice(0, endIndex);

        setDisplayedDaylilies(newItems);
        setPage(nextPage);
        setHasMore(endIndex < filteredDaylilies.length);
        setLoading(false);
    }, [loading, hasMore, page, filteredDaylilies]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !loading) {
                loadMoreItems();
            }
        }, options);

        observerRef.current = observer;

        const currentLoadingRef = loadingRef.current;
        if (currentLoadingRef) {
            observer.observe(currentLoadingRef);
        }

        return () => {
            if (currentLoadingRef) {
                observer.unobserve(currentLoadingRef);
            }
        };
    }, [loadMoreItems, hasMore, loading]);

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="container mx-auto p-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Rice Daylilies</h1>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            >
                                {resolvedTheme === 'dark' ? (
                                    <Sun className="h-5 w-5"/>
                                ) : (
                                    <Moon className="h-5 w-5"/>
                                )}
                            </Button>
                            <Link href="/about">
                                <Button
                                    variant="outline"
                                    className="h-auto min-h-[40px] px-4 py-2"
                                >
                                    About & Contact
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="h-auto min-h-[40px] px-4 py-2"
                                onClick={() => setIsFilterOpen(true)}
                            >
                                Filter & Search
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tags Section - Add this new section */}
            <TagsSection initialExpanded={false} />

            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            {/* src/components/DaylilyGallery.tsx - Main content section */}
            <main className="flex-1 container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedDaylilies.map((daylily) => (
                        <Link
                            key={daylily.name}
                            href={`/daylily/${createSlugFromName(daylily.name)}`}
                        >
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                                <div className="aspect-square relative">
                                    <ClientImage
                                        src={getImageUrl(daylily.image_url)}
                                        alt={daylily.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover rounded-t-xl"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <h2 className="font-semibold truncate">{daylily.name}</h2>
                                        {daylily.price && (
                                            <span className="text-sm font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
                                              ${daylily.price}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {daylily.hybridizer} ({daylily.year})
                                    </p>
                                    <a
                                    href={`mailto:personallybored@gmail.com?subject=Variety%20Inquiry%20-%20${encodeURIComponent(daylily.name)}%20&body=I%20am%20interested%20in%20the%20variety%20${encodeURIComponent(daylily.name)}%20.%20Please%20provide%20information%20about%20its%20availability%20and%20pricing.`}
                                    className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()} // Prevent Link navigation
                                    >
                                    <span className="italic group-hover:underline">
                                        {daylily.availability || "Email For Availability"}
                                      </span>
                                    <Mail className="h-4 w-4 transition-colors group-hover:text-primary"/>
                                </a>
                            </CardContent>
                        </Card>
                        </Link>
                        ))}
                </div>

                {/* Loading indicator and intersection observer target */}
                {hasMore && (
                    <div
                        ref={loadingRef}
                        className="w-full h-20 flex items-center justify-center mt-8"
                    >
                        {loading && (
                            <div className="animate-pulse text-muted-foreground">
                                Loading more daylilies...
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}