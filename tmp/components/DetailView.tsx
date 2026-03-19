import { X, Mail } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Daylily } from '@/types/daylily';
import { getImageUrl, DEFAULT_IMAGE_PATH } from '@/lib/constants';

interface DetailViewProps {
    daylily: Daylily;
    isOpen: boolean;
    onClose: () => void;
}

export default function DetailView({ daylily, isOpen, onClose }: DetailViewProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <div className="relative">
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2 z-10 bg-background/80 p-2 rounded-lg shadow-md hover:bg-destructive hover:text-destructive-foreground transition-colors backdrop-blur-sm"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="aspect-square relative mb-4">
                        <Image
                            src={getImageUrl(daylily.image_url)}
                            alt={daylily.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority
                            className="object-cover rounded-lg"
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = DEFAULT_IMAGE_PATH;
                            }}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <h2 className="text-2xl font-bold">{daylily.name}</h2>
                                {daylily.price && (
                                    <p className="text-2xl font-medium text-green-600 dark:text-green-400">
                                        ${daylily.price}
                                    </p>
                                )}
                            </div>
                            <p className="text-lg text-muted-foreground">
                                {daylily.hybridizer} ({daylily.year})
                            </p>
                            <a
                                href={`mailto:daylilycat68@gmail.com?subject=Variety%20Inquiry%20-%20${encodeURIComponent(daylily.name)}%20-DTV%20&body=I%20am%20interested%20in%20the%20variety%20${encodeURIComponent(daylily.name)}%20.%20Please%20provide%20information%20about%20its%20availability%20and%20pricing.`}
                                className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                                <span className="italic group-hover:underline">
                                    {daylily.availability || "Email For Availability"}
                                </span>
                                <Mail className="h-4 w-4 transition-colors group-hover:text-primary" />
                            </a>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Characteristics</h3>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Ploidy:</span> {daylily.ploidy}
                                </div>
                                <div>
                                    <span className="font-medium">Bloom Size:</span> {daylily.bloom_size}
                                </div>
                                <div>
                                    <span className="font-medium">Scape Height:</span> {daylily.scape_height}
                                </div>
                                <div>
                                    <span className="font-medium">Branches:</span> {daylily.branches}
                                </div>
                                <div>
                                    <span className="font-medium">Bud Count:</span> {daylily.bud_count}
                                </div>
                                <div>
                                    <span className="font-medium">Bloom Season:</span> {daylily.bloom_season}
                                </div>
                                <div>
                                    <span className="font-medium">Foliage Type:</span> {daylily.foliage_type}
                                </div>
                                {daylily.fragrance && (
                                    <div>
                                        <span className="font-medium">Fragrance:</span> {daylily.fragrance}
                                    </div>
                                )}
                                {daylily.bloom_habit && (
                                    <div>
                                        <span className="font-medium">Bloom Habit:</span> {daylily.bloom_habit}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Details</h3>
                            {daylily.color_description && (
                                <p className="text-sm">
                                    <span className="font-medium">Color:</span> {daylily.color_description}
                                </p>
                            )}
                            {daylily.parentage && (
                                <p className="text-sm">
                                    <span className="font-medium">Parentage:</span> {daylily.parentage}
                                </p>
                            )}
                            {daylily.form && (
                                <p className="text-sm">
                                    <span className="font-medium">Form:</span> {daylily.form}
                                </p>
                            )}
                            {daylily.sculpting && (
                                <p className="text-sm">
                                    <span className="font-medium">Sculpting:</span> {daylily.sculpting}
                                </p>
                            )}
                            {daylily["seedling_#"] && (
                                <p className="text-sm">
                                    <span className="font-medium">Seedling #:</span> {daylily["seedling_#"]}
                                </p>
                            )}
                            {daylily.notes && (
                                <p className="text-sm">
                                    <span className="font-medium">Notes:</span> {daylily.notes}
                                </p>
                            )}
                        </div>

                        {daylily.description && (
                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">Description</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                    {daylily.description}
                                </p>
                            </div>
                        )}

                        {daylily.learn_more_url && (
                            <div className="mt-4">
                                <a
                                    href={daylily.learn_more_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
                                >
                                    Learn More
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}