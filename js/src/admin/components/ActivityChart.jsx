import { Bar } from 'react-chartjs-2';
import {
    BarElement, CategoryScale, Chart as ChartJS,
    LinearScale, Tooltip, Legend,
} from 'chart.js';
import axios from 'axios';
import { ChevronDown, LineChart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const RANGES = [
    { label: 'Last 7 days',   value: '7'  },
    { label: 'Last 30 days',  value: '30' },
    { label: 'Last 3 months', value: '90' },
];

const fmt = (n) => n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n ?? 0);

export default function ActivityChart() {
    const [range, setRange] = useState('7');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const h = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get('/admin/chart', { params: { range } })
            .then((r) => setChartData(r.data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [range]);

    const getGradient = (ctx, chartArea, color) => {
        if (!chartArea) return color;
        const g = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
        g.addColorStop(0, color + '99');
        g.addColorStop(1, color + 'dd');
        return g;
    };

    const data = {
        labels: chartData?.labels ?? [],
        datasets: [
            {
                label: 'Uploads',
                data: chartData?.uploads ?? [],
                borderRadius: 8,
                borderSkipped: false,
                backgroundColor: (ctx) => {
                    const { chart } = ctx;
                    if (!chart.chartArea) return '#f97316';
                    return getGradient(chart.ctx, chart.chartArea, '#f97316');
                },
                hoverBackgroundColor: '#ea6c0a',
            },
            {
                label: 'New Users',
                data: chartData?.users ?? [],
                borderRadius: 8,
                borderSkipped: false,
                backgroundColor: (ctx) => {
                    const { chart } = ctx;
                    if (!chart.chartArea) return '#71717a';
                    return getGradient(chart.ctx, chart.chartArea, '#71717a');
                },
                hoverBackgroundColor: '#52525b',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800, easing: 'easeOutQuart' },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { boxWidth: 10, boxHeight: 10, borderRadius: 3, usePointStyle: true, pointStyle: 'circle', color: '#9ca3af', font: { size: 11 } },
            },
            tooltip: {
                backgroundColor: '#18181b',
                titleColor: '#fff',
                bodyColor: '#a1a1aa',
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af', font: { size: 11 }, maxRotation: 0 },
            },
            y: {
                grid: { color: 'rgba(156,163,175,0.1)', drawBorder: false },
                ticks: { color: '#9ca3af', font: { size: 11 } },
                beginAtZero: true,
            },
        },
    };

    const rangeLabel = RANGES.find((r) => r.value === range)?.label ?? 'Last 7 days';

    return (
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h2 className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                        <LineChart size={16} className="text-orange-500" />
                        Platform Activity
                    </h2>
                    <p className="text-xs text-gray-400 dark:text-zinc-500 mt-0.5">
                        {loading ? 'Loading...' : `${fmt(chartData?.total_uploads ?? 0)} uploads in period`}
                    </p>
                </div>

                <div className="relative w-full sm:w-44" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-full px-4 py-2 flex items-center justify-between text-sm hover:bg-orange-100 dark:hover:bg-orange-500/20 transition text-gray-700 dark:text-zinc-200">
                        {rangeLabel}
                        <ChevronDown size={14} className={`transition-transform text-gray-400 dark:text-zinc-500 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className="absolute z-20 mt-1.5 w-full bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl py-1.5">
                            {RANGES.map((r) => (
                                <button key={r.value} onClick={() => { setRange(r.value); setDropdownOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${range === r.value ? 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 font-medium' : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-50 dark:hover:bg-zinc-700'}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="h-56 relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-end gap-1.5 px-2 pb-2">
                        {Array.from({ length: parseInt(range) > 30 ? 12 : parseInt(range) }).map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-100 dark:bg-zinc-800 rounded-lg animate-pulse"
                                style={{ height: `${30 + Math.random() * 60}%` }} />
                        ))}
                    </div>
                ) : (
                    <Bar data={data} options={options} />
                )}
            </div>

            <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-3 text-right">
                Live data · Updated now
            </p>
        </div>
    );
}
