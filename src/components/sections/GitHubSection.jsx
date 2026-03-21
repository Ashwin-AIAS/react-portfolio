import React, { useState, useEffect } from 'react';
import { Section } from '../ui/Section';
import { Card } from '../ui/Card';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import { StatCounter } from '../ui/StatCounter';

const FolderIcon = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>);
const StarIcon = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const CodeBracketIcon = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>);
const GitCommitIcon = ({ className }) => (<svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 108 0 4 4 0 00-8 0zm0 0H4m12 0h4" /></svg>);

const getCommitColor = (count) => {
    if (count === 0) return 'rgba(255,255,255,0.04)';
    if (count >= 1 && count <= 3) return '#0e4429';
    if (count >= 4 && count <= 6) return '#006d32';
    if (count >= 7 && count <= 9) return '#26a641';
    return '#39d353';
};

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
                    fetch('https://github-contributions-api.jogruber.de/v4/Ashwin-AIAS')
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

                const contributions = heatmapData.contributions || [];
                const today = new Date();
                const lastYear = new Date(today);
                lastYear.setDate(lastYear.getDate() - 365);
                const last365 = contributions.filter(c => new Date(c.date) >= lastYear);
                const totalContributions = heatmapData.total?.[today.getFullYear()] || last365.reduce((sum, c) => sum + c.count, 0);

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

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Mon", "", "Wed", "", "Fri", "", ""];

    return (
        <Section id="github" title={t.github.title} subtitle={t.github.subtitle}>
            <div className="flex flex-col gap-8">
                <AnimateOnScroll>
                    <Card className="p-8 border border-white/[0.06] bg-black/40 hover:border-blue-500/30 transition-all duration-500 glow-card relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 opacity-30"></div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white/90">
                                {!loading && !error ? (
                                    <span>{stats.contributionsThisYear} {t.github.contributions}</span>
                                ) : (
                                    <span>{t.github.title}</span>
                                )}
                            </h3>
                        </div>

                        {loading ? (
                            <div className="w-full h-32 bg-white/[0.03] animate-pulse rounded-lg"></div>
                        ) : error ? (
                            <div className="w-full h-32 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                GitHub stats temporarily unavailable
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto custom-scrollbar pb-4">
                                <div className="min-w-[800px]">
                                    <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                                        {stats.heatmap.map((day, i) => (
                                            <div
                                                key={`heatmap-${i}`}
                                                className="w-3 h-3 rounded-[2px]"
                                                style={{ backgroundColor: getCommitColor(day.count) }}
                                                title={`${day.date}: ${day.count} commits`}
                                            ></div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 mt-4 text-xs text-white/40">
                                        <span>{t.github.less}</span>
                                        <div className="flex gap-1">
                                            {[0, 2, 5, 8, 12].map((val, i) => (
                                                <div key={i} className="w-3 h-3 rounded-[2px]" style={{ backgroundColor: getCommitColor(val) }}></div>
                                            ))}
                                        </div>
                                        <span>{t.github.more}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>
                </AnimateOnScroll>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimateOnScroll delay={100}>
                        <Card className="p-6 h-full border border-white/[0.06] bg-black/40 hover:border-blue-500/30 transition-all duration-300">
                            {loading ? (
                                <div className="h-20 w-full animate-pulse bg-white/[0.03] rounded-lg"></div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                        <FolderIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 tracking-wider">Public Repos</p>
                                        <div className="text-2xl font-bold text-white/90">
                                            <StatCounter end={stats.publicRepos} duration={1500} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={200}>
                        <Card className="p-6 h-full border border-white/[0.06] bg-black/40 hover:border-yellow-500/30 transition-all duration-300">
                            {loading ? (
                                <div className="h-20 w-full animate-pulse bg-white/[0.03] rounded-lg"></div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                        <StarIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 tracking-wider">Total Stars</p>
                                        <div className="text-2xl font-bold text-white/90">
                                            <StatCounter end={stats.totalStars} duration={1500} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={300}>
                        <Card className="p-6 h-full border border-white/[0.06] bg-black/40 hover:border-violet-500/30 transition-all duration-300">
                            {loading ? (
                                <div className="h-20 w-full animate-pulse bg-white/[0.03] rounded-lg"></div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                                        <CodeBracketIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 tracking-wider">{t.github.topLanguage}</p>
                                        <div className="text-xl font-bold text-white/90 truncate max-w-[100px] mt-1 text-violet-300">
                                            {stats.topLanguage}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </AnimateOnScroll>
                    <AnimateOnScroll delay={400}>
                        <Card className="p-6 h-full border border-white/[0.06] bg-black/40 hover:border-green-500/30 transition-all duration-300">
                            {loading ? (
                                <div className="h-20 w-full animate-pulse bg-white/[0.03] rounded-lg"></div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                        <GitCommitIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/40 tracking-wider">Total Commits</p>
                                        <div className="text-2xl font-bold text-white/90">
                                            <StatCounter end={stats.contributionsThisYear} duration={1500} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </AnimateOnScroll>
                </div>
            </div>
        </Section>
    );
};
