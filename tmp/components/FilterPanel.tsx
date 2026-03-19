'use client';

import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    FilterState,
    BLOOM_SEASONS,
    FOLIAGE_TYPES,
    INITIAL_FILTER_STATE
} from '@/types/daylily';

interface FilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function FilterPanel({
                                        isOpen,
                                        onClose,
                                        filters,
                                        setFilters
                                    }: FilterPanelProps) {
    const handleFilterChange = <K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetFilters = () => {
        setFilters(INITIAL_FILTER_STATE);
    };

    return (
        <div
            className={`
        fixed inset-y-0 right-0 w-full sm:w-96 overflow-y-auto border-l z-[100]
        transition-transform duration-200 ease-in-out bg-background
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
        >
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Filter Options</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label>Search Name</Label>
                        <Input
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Search daylilies..."
                        />
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={filters.matchType === 'exact'}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('matchType', checked ? 'exact' : 'partial')
                                }
                            />
                            <span>Exact match</span>
                        </div>
                    </div>

                    {/* Hybridizer */}
                    <div className="space-y-2">
                        <Label>Hybridizer</Label>
                        <Input
                            value={filters.hybridizer}
                            onChange={(e) => handleFilterChange('hybridizer', e.target.value)}
                            placeholder="Search by hybridizer"
                        />
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={filters.hybridizerMatchType === 'exact'}
                                onCheckedChange={(checked) =>
                                    handleFilterChange('hybridizerMatchType', checked ? 'exact' : 'partial')
                                }
                            />
                            <span>Exact match</span>
                        </div>
                    </div>

                    {/* Year Range */}
                    <div className="space-y-2">
                        <Label>Year Range</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Input
                                type="number"
                                placeholder="From"
                                value={filters.yearRange.start}
                                onChange={(e) =>
                                    handleFilterChange('yearRange', {
                                        ...filters.yearRange,
                                        start: e.target.value
                                    })
                                }
                            />
                            <Input
                                type="number"
                                placeholder="To"
                                value={filters.yearRange.end}
                                onChange={(e) =>
                                    handleFilterChange('yearRange', {
                                        ...filters.yearRange,
                                        end: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>

                    {/* Measurements */}
                    <div className="space-y-4">
                        {/* Bloom Size */}
                        <div className="space-y-2">
                            <Label>Bloom Size (inches)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.bloomSize.min}
                                    onChange={(e) =>
                                        handleFilterChange('bloomSize', {
                                            ...filters.bloomSize,
                                            min: e.target.value
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.bloomSize.max}
                                    onChange={(e) =>
                                        handleFilterChange('bloomSize', {
                                            ...filters.bloomSize,
                                            max: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Scape Height */}
                        <div className="space-y-2">
                            <Label>Scape Height (inches)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.scapeHeight.min}
                                    onChange={(e) =>
                                        handleFilterChange('scapeHeight', {
                                            ...filters.scapeHeight,
                                            min: e.target.value
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.scapeHeight.max}
                                    onChange={(e) =>
                                        handleFilterChange('scapeHeight', {
                                            ...filters.scapeHeight,
                                            max: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Branches */}
                        <div className="space-y-2">
                            <Label>Branches</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.branches.min}
                                    onChange={(e) =>
                                        handleFilterChange('branches', {
                                            ...filters.branches,
                                            min: e.target.value
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.branches.max}
                                    onChange={(e) =>
                                        handleFilterChange('branches', {
                                            ...filters.branches,
                                            max: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Bud Count */}
                        <div className="space-y-2">
                            <Label>Bud Count</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.budCount.min}
                                    onChange={(e) =>
                                        handleFilterChange('budCount', {
                                            ...filters.budCount,
                                            min: e.target.value
                                        })
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.budCount.max}
                                    onChange={(e) =>
                                        handleFilterChange('budCount', {
                                            ...filters.budCount,
                                            max: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ploidy */}
                    <div className="space-y-2">
                        <Label>Ploidy</Label>
                        <RadioGroup
                            value={filters.ploidy}
                            onValueChange={(value) => {
                                // If clicking the same value, reset to default
                                if (value === filters.ploidy) {
                                    handleFilterChange('ploidy', '');
                                } else {
                                    handleFilterChange('ploidy', value);
                                }
                            }}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="" id="ploidy-any" />
                                    <Label htmlFor="ploidy-any">Any</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Diploid" id="diploid" />
                                    <Label htmlFor="diploid">Diploid</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Tetraploid" id="tetraploid" />
                                    <Label htmlFor="tetraploid">Tetraploid</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Bloom Season */}
                    <div className="space-y-2">
                        <Label>Bloom Season</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {BLOOM_SEASONS.map((season) => (
                                <div key={season} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={season.toLowerCase().replace(/\s+/g, '-')}
                                        checked={filters.bloomSeason.includes(season)}
                                        onCheckedChange={(checked) => {
                                            const newSeasons = checked
                                                ? [...filters.bloomSeason, season]
                                                : filters.bloomSeason.filter(s => s !== season);
                                            handleFilterChange('bloomSeason', newSeasons);
                                        }}
                                    />
                                    <Label htmlFor={season.toLowerCase().replace(/\s+/g, '-')}>
                                        {season}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rebloom */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rebloom"
                            checked={filters.rebloom}
                            onCheckedChange={(checked) =>
                                handleFilterChange('rebloom', !!checked)
                            }
                        />
                        <Label htmlFor="rebloom">Rebloom</Label>
                    </div>

                    {/* Foliage Type */}
                    <div className="space-y-2">
                        <Label>Foliage Type</Label>
                        <RadioGroup
                            value={filters.foliageType}
                            onValueChange={(value) => {
                                // If clicking the same value, reset to default
                                if (value === filters.foliageType) {
                                    handleFilterChange('foliageType', '');
                                } else {
                                    handleFilterChange('foliageType', value);
                                }
                            }}
                        >
                            <div className="flex flex-col space-y-2">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="" id="foliage-any" />
                                    <Label htmlFor="foliage-any">Any</Label>
                                </div>
                                {FOLIAGE_TYPES.map((type) => (
                                    <div key={type} className="flex items-center space-x-2">
                                        <RadioGroupItem value={type} id={type.toLowerCase()} />
                                        <Label htmlFor={type.toLowerCase()}>{type}</Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Clear All
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={onClose}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
