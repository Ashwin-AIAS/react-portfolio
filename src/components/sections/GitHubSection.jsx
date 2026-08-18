import React, { useState, useEffect } from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { StatCounter } from '../ui/StatCounter';

// The heatmap used GitHub's own green ramp — the one hue on the page that
// belonged to another product. It now steps through the site's accent, via
// tokens so the light theme gets its own ramp rather than a washed-out one.
const HEAT_STEPS = ['var(--heat-0)', 'var(--heat-1)', 'var(--heat-2)', 'var(--heat-3)', 'var(--heat-4)'];

const heatLevel = (count) => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
};

const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-surface-2 ${className}`} style={{ borderRadius: 'var(--r-sm)' }} />
);

// LABEL above, big mono number below — the same readout used on project cards.
const StatPanel = ({ label, value, loading, delay, mono = true }) => (
    <AnimateOnScroll delay={delay} className="h-full">
        <Card className="h-full">
            <div className="p-5 h-full flex flex-col justify-between gap-4">
                <span className="label">{label}</span>
                {loading ? (
                    <Skeleton className="h-7 w-16" />
                ) : (
                    <span
                        className={`font-display text-3xl font-bold tracking-tighter text-ink ${mono ? 'tabular-nums' : 'truncate'}`}
                    >
                        {value}
                    </span>
                )}
            </div>
        </Card>
    </AnimateOnScroll>
);

export const GitHubSection = ({ t }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [stats, setStats] = useState({
        publicRepos: 0,
        totalStars: 0,
        topLanguage: "N/A",
        contributionsThisYear: 0,
        heatmap: []
    });

    useEffect(() => {
        let isMounted = true;
        const fetchGitHubData = async () => {
            try {
                const [userRes, reposRes, heatmapRes] = await Promise.all([
                    fetch('https://api.github.com/users/Ashwin-AIAS'),
                    fetch('https://api.github.com/users/Ashwin-AIAS/repos?per_page=100'),
                    fetch('https://github-contributions-api.jogruber.de/v4/Ashwin-AIAS?y=last')
                ]);

                if (!userRes.ok || !reposRes.ok || !heatmapRes.ok) {
                    throw new Error('API request failed');
                }

                const userData = await userRes.json();
                const reposData = await reposRes.json();
                const heatmapData = await heatmapRes.json();

                const totalRepos = userData.public_repos;
                const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);

                const languages = {};
                reposData.forEach(r => {
                    if (r.language) {
                        languages[r.language] = (languages[r.language] || 0) + 1;
                    }
                });
                let topLang = "N/A";
                let topCount = 0;
                for (const [lang, count] of Object.entries(languages)) {
                    if (count > topCount) { topCount = count; topLang = lang; }
                }

                // ?y=last returns the trailing 365 days, already sorted chronologically
                const last365 = heatmapData.contributions || [];
                const totalContributions = heatmapData.total?.lastYear || last365.reduce((sum, c) => sum + c.count, 0);

                if (isMounted) {
                    setStats({
                        publicRepos: totalRepos,
                        totalStars,
                        topLanguage: topLang,
                        contributionsThisYear: totalContributions,
                        heatmap: last365
                    });
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError(true);
                    setLoading(false);
                }
            }
        };
        fetchGitHubData();
        return () => { isMounted = false; };
    }, []);

    return (
        <Section id="github" title={t.github.title} subtitle={t.github.subtitle}>
            <div className="flex flex-col gap-4">
                <AnimateOnScroll>
                    <Card>
                        <div className="p-6 md:p-7">
                            <div className="flex items-baseline gap-3 mb-6 pb-3 border-b border-rule">
                                <span className="label label-accent">Activity</span>
                                <span className="label truncate">Trailing 365 days</span>
                                {!loading && !error && (
                                    <span className="readout-value readout-value-accent ml-auto flex-shrink-0 text-base">
                                        {stats.contributionsThisYear}
                                        <span className="label ml-2">{t.github.contributions}</span>
                                    </span>
                                )}
                            </div>

                            {loading ? (
                                <Skeleton className="w-full h-32" />
                            ) : error ? (
                                <div
                                    className="w-full h-32 flex items-center justify-center border border-rule label"
                                    style={{ color: 'var(--err)', borderRadius: 'var(--r-sm)' }}
                                >
                                    GitHub stats temporarily unavailable
                                </div>
                            ) : (
                                <div className="w-full overflow-x-auto custom-scrollbar pb-2">
                                    <div className="min-w-[800px]">
                                        <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                                            {stats.heatmap.map((day, i) => (
                                                <div
                                                    key={`heatmap-${i}`}
                                                    className="w-3 h-3"
                                                    style={{ backgroundColor: HEAT_STEPS[heatLevel(day.count)] }}
                                                    title={`${day.date}: ${day.count} commits`}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <span className="label">{t.github.less}</span>
                                            <div className="flex gap-1">
                                                {HEAT_STEPS.map((step, i) => (
                                                    <div key={i} className="w-3 h-3" style={{ backgroundColor: step }} />
                                                ))}
                                            </div>
                                            <span className="label">{t.github.more}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </AnimateOnScroll>

                {/* Four circular icon chips in four different hues became four
                    readouts. The numbers were always the point. */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatPanel
                        label="Public Repos"
                        loading={loading}
                        delay={80}
                        value={<StatCounter end={stats.publicRepos} duration={1500} />}
                    />
                    <StatPanel
                        label="Total Stars"
                        loading={loading}
                        delay={160}
                        value={<StatCounter end={stats.totalStars} duration={1500} />}
                    />
                    <StatPanel
                        label={t.github.topLanguage}
                        loading={loading}
                        delay={240}
                        mono={false}
                        value={stats.topLanguage}
                    />
                    <StatPanel
                        label="Total Commits"
                        loading={loading}
                        delay={320}
                        value={<StatCounter end={stats.contributionsThisYear} duration={1500} />}
                    />
                </div>
            </div>
        </Section>
    );
};
