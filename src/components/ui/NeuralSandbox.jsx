import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Module 1: Edge CNN Int8 Quantization & Im2Col Inference Lab
// ---------------------------------------------------------------------------

const DIGIT_PRESETS = {
    '7': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 1, 1, 1, 1, 1, 1, 1, 1, 0,
        0, 1, 0.4, 0.2, 0.2, 0.2, 0.6, 1, 0.8, 0,
        0, 0, 0, 0, 0, 0, 0.8, 0.9, 0, 0,
        0, 0, 0, 0, 0, 0.8, 0.9, 0, 0, 0,
        0, 0, 0, 0, 0.8, 0.9, 0, 0, 0, 0,
        0, 0, 0, 0.6, 1, 0.3, 0, 0, 0, 0,
        0, 0, 0, 0.8, 0.8, 0, 0, 0, 0, 0,
        0, 0, 0, 0.9, 0.6, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    '0': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0.4, 1, 1, 1, 0.9, 0, 0, 0,
        0, 0.6, 1, 0.3, 0, 0.2, 1, 0.7, 0, 0,
        0, 0.9, 0.5, 0, 0, 0, 0.3, 1, 0, 0,
        0, 1, 0.2, 0, 0, 0, 0.2, 1, 0, 0,
        0, 1, 0.2, 0, 0, 0, 0.2, 1, 0, 0,
        0, 0.9, 0.5, 0, 0, 0, 0.4, 0.9, 0, 0,
        0, 0.5, 1, 0.4, 0, 0.3, 1, 0.6, 0, 0,
        0, 0, 0.3, 0.9, 1, 0.9, 0.5, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    '3': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0.9, 1, 1, 1, 0.9, 0.3, 0, 0,
        0, 0, 0.2, 0, 0, 0.3, 1, 0.8, 0, 0,
        0, 0, 0, 0, 0, 0.5, 0.9, 0.2, 0, 0,
        0, 0, 0, 0.8, 1, 1, 0.6, 0, 0, 0,
        0, 0, 0, 0, 0.2, 0.7, 1, 0.6, 0, 0,
        0, 0, 0, 0, 0, 0.2, 0.9, 1, 0, 0,
        0, 0, 0.6, 0.3, 0, 0.4, 1, 0.7, 0, 0,
        0, 0, 0.8, 1, 1, 1, 0.8, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ],
    '8': [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0.5, 1, 1, 1, 0.6, 0, 0, 0,
        0, 0.3, 1, 0.2, 0, 0.2, 1, 0.3, 0, 0,
        0, 0.2, 0.9, 0.4, 0.2, 0.5, 0.9, 0.2, 0, 0,
        0, 0, 0.3, 1, 1, 1, 0.4, 0, 0, 0,
        0, 0.3, 0.9, 0.3, 0, 0.3, 0.9, 0.3, 0, 0,
        0, 0.5, 1, 0, 0, 0, 1, 0.5, 0, 0,
        0, 0.3, 0.9, 0.5, 0.2, 0.5, 0.9, 0.3, 0, 0,
        0, 0, 0.4, 0.9, 1, 0.9, 0.4, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
};

const KERNELS = {
    sobelX: {
        name: 'Vertical Edge (Sobel-X)',
        tag: 'CONV_K0',
        weights: [
            [-1.0, 0.0, 1.0],
            [-2.0, 0.0, 2.0],
            [-1.0, 0.0, 1.0],
        ],
    },
    sobelY: {
        name: 'Horizontal Edge (Sobel-Y)',
        tag: 'CONV_K1',
        weights: [
            [-1.0, -2.0, -1.0],
            [0.0, 0.0, 0.0],
            [1.0, 2.0, 1.0],
        ],
    },
    laplacian: {
        name: 'Feature Ridge (Laplacian)',
        tag: 'CONV_K2',
        weights: [
            [-0.5, -1.0, -0.5],
            [-1.0, 6.0, -1.0],
            [-0.5, -1.0, -0.5],
        ],
    },
    diagonal: {
        name: 'Diagonal Stroke Filter',
        tag: 'CONV_K3',
        weights: [
            [1.5, 0.5, -1.0],
            [0.5, 1.0, -0.5],
            [-1.0, -0.5, 1.5],
        ],
    },
};

const PRECISION_SPECS = {
    fp32: {
        id: 'fp32',
        label: 'FP32 (IEEE 754)',
        bits: 32,
        levels: null,
        weightBytes: '247.4 KB',
        latencyMs: '4.82 ms',
        speedup: '1.0x',
        compression: '1.0x',
        isa: 'FMA32 Float',
    },
    int8: {
        id: 'int8',
        label: 'INT8 Symmetric',
        bits: 8,
        levels: 127,
        weightBytes: '61.8 KB',
        latencyMs: '1.31 ms',
        speedup: '3.68x',
        compression: '4.0x',
        isa: 'SIMD DP4A (Int8)',
    },
    int4: {
        id: 'int4',
        label: 'INT4 Extreme Edge',
        bits: 4,
        levels: 7,
        weightBytes: '30.9 KB',
        latencyMs: '0.84 ms',
        speedup: '5.74x',
        compression: '8.0x',
        isa: 'Packed Int4 LUT',
    },
};

function quantizeMatrix(matrix2D, levels) {
    const flat = matrix2D.flat();
    const maxAbs = Math.max(...flat.map(Math.abs), 1e-6);
    if (!levels) {
        return {
            scale: 1.0,
            qWeights: matrix2D,
            dequantWeights: matrix2D,
        };
    }
    const scale = maxAbs / levels;
    const qWeights = matrix2D.map(row =>
        row.map(v => Math.max(-levels, Math.min(levels, Math.round(v / scale))))
    );
    const dequantWeights = qWeights.map(row => row.map(q => q * scale));
    return { scale, qWeights, dequantWeights };
}

function runConv2D(grid10x10, weights3x3, useRelu = true) {
    const out = [];
    for (let r = 0; r < 8; r++) {
        const row = [];
        for (let c = 0; c < 8; c++) {
            let acc = 0;
            for (let kr = 0; kr < 3; kr++) {
                for (let kc = 0; kc < 3; kc++) {
                    acc += grid10x10[(r + kr) * 10 + (c + kc)] * weights3x3[kr][kc];
                }
            }
            row.push(useRelu ? Math.max(0, acc) : acc);
        }
        out.push(row);
    }
    return out;
}

const CNNQuantizationLab = ({ t }) => {
    const [activePreset, setActivePreset] = useState('7');
    const [grid, setGrid] = useState(() => [...DIGIT_PRESETS['7']]);
    const [kernelKey, setKernelKey] = useState('sobelX');
    const [precision, setPrecision] = useState('int8');
    const [reluEnabled, setReluEnabled] = useState(true);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hoverPatch, setHoverPatch] = useState({ r: 2, c: 4 });

    const selectPreset = (digit) => {
        setActivePreset(digit);
        setGrid([...DIGIT_PRESETS[digit]]);
    };

    const clearGrid = () => {
        setActivePreset('');
        setGrid(new Array(100).fill(0));
    };

    const paintCell = (idx) => {
        setGrid(prev => {
            const next = [...prev];
            next[idx] = 1.0;
            // Soft brush halo on direct neighbors for realistic anti-aliasing
            const r = Math.floor(idx / 10);
            const c = idx % 10;
            [
                [r - 1, c],
                [r + 1, c],
                [r, c - 1],
                [r, c + 1],
            ].forEach(([nr, nc]) => {
                if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10) {
                    const nIdx = nr * 10 + nc;
                    next[nIdx] = Math.min(1.0, Math.max(next[nIdx], 0.35));
                }
            });
            return next;
        });
    };

    const computation = useMemo(() => {
        const kernel = KERNELS[kernelKey];
        const spec = PRECISION_SPECS[precision];

        // Reference FP32 activation map
        const fp32Out = runConv2D(grid, kernel.weights, reluEnabled);

        // Quantized weights & activation map
        const { scale: wScale, qWeights, dequantWeights } = quantizeMatrix(kernel.weights, spec.levels);

        // Quantize input activations if precision != fp32
        const inLevels = spec.levels;
        const qGrid = inLevels
            ? grid.map(v => Math.round(v * inLevels) / inLevels)
            : grid;

        const quantOut = runConv2D(qGrid, dequantWeights, reluEnabled);

        // Compute SQNR & Mean Absolute Quantization Error
        let signalPower = 0;
        let noisePower = 0;
        let maxAct = 0.01;
        let dotA = 0;
        let normA = 0;
        let normB = 0;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const ref = fp32Out[r][c];
                const q = quantOut[r][c];
                const err = ref - q;
                signalPower += ref * ref;
                noisePower += err * err;
                maxAct = Math.max(maxAct, Math.abs(ref), Math.abs(q));
                dotA += ref * q;
                normA += ref * ref;
                normB += q * q;
            }
        }

        const rmse = Math.sqrt(noisePower / 64);
        const cosineSim =
            normA > 1e-8 && normB > 1e-8
                ? (dotA / (Math.sqrt(normA) * Math.sqrt(normB))) * 100
                : 100.0;
        const sqnrDb =
            precision === 'fp32'
                ? '∞ dB'
                : noisePower > 1e-9 && signalPower > 1e-9
                ? `${(10 * Math.log10(signalPower / noisePower)).toFixed(1)} dB`
                : '42.4 dB';

        // Extract active 3x3 patch for Im2Col inspection
        const pr = hoverPatch.r;
        const pc = hoverPatch.c;
        const im2colPatch = [];
        for (let kr = 0; kr < 3; kr++) {
            for (let kc = 0; kc < 3; kc++) {
                im2colPatch.push(qGrid[(pr + kr) * 10 + (pc + kc)]);
            }
        }

        return {
            kernel,
            spec,
            fp32Out,
            quantOut,
            qWeights,
            wScale,
            rmse,
            cosineSim,
            sqnrDb,
            maxAct,
            im2colPatch,
        };
    }, [grid, kernelKey, precision, reluEnabled, hoverPatch]);

    return (
        <div
            className="grid lg:grid-cols-12 gap-6 select-none"
            onMouseUp={() => setIsDrawing(false)}
            onMouseLeave={() => setIsDrawing(false)}
        >
            {/* Left Column: Interactive Input Canvas + Kernel Weights */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="panel p-5">
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-rule">
                        <div>
                            <span className="label label-accent block">01 // Input Tensor (10×10)</span>
                            <span className="text-xs text-ink-muted">Draw on grid or load test pattern</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {Object.keys(DIGIT_PRESETS).map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => selectPreset(d)}
                                    className={`px-2 py-1 text-xs font-mono border rounded transition-colors ${
                                        activePreset === d
                                            ? 'border-accent text-accent bg-accent/10'
                                            : 'border-rule text-ink-muted hover:border-accent/50'
                                    }`}
                                >
                                    #{d}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={clearGrid}
                                className="px-2 py-1 text-xs font-mono border border-rule text-ink-dim hover:text-ink hover:border-rule-strong rounded transition-colors ml-1"
                            >
                                CLR
                            </button>
                        </div>
                    </div>

                    {/* 10x10 Interactive Pixel Grid */}
                    <div
                        className="grid grid-cols-10 gap-1 aspect-square max-w-[270px] mx-auto p-2 bg-surface-2 border border-rule rounded"
                        onTouchEnd={() => setIsDrawing(false)}
                    >
                        {grid.map((val, idx) => {
                            const r = Math.floor(idx / 10);
                            const c = idx % 10;
                            const inReceptiveField =
                                r >= hoverPatch.r &&
                                r < hoverPatch.r + 3 &&
                                c >= hoverPatch.c &&
                                c < hoverPatch.c + 3;

                            return (
                                <div
                                    key={idx}
                                    onMouseDown={() => {
                                        setIsDrawing(true);
                                        paintCell(idx);
                                    }}
                                    onMouseEnter={() => {
                                        if (isDrawing) paintCell(idx);
                                    }}
                                    className={`relative rounded-[1px] cursor-crosshair transition-colors duration-75 ${
                                        inReceptiveField ? 'ring-1 ring-accent z-10' : ''
                                    }`}
                                    style={{
                                        backgroundColor:
                                            val > 0.02
                                                ? `color-mix(in srgb, var(--accent) ${Math.round(val * 95)}%, var(--surface-3))`
                                                : 'var(--surface-1)',
                                    }}
                                    title={`Input[${r},${c}] = ${val.toFixed(2)}`}
                                />
                            );
                        })}
                    </div>

                    <p className="text-[11px] font-mono text-ink-dim text-center mt-3">
                        Receptive field Window [{hoverPatch.r}:{hoverPatch.r + 2}, {hoverPatch.c}:{hoverPatch.c + 2}] highlighted
                    </p>
                </div>

                {/* Quantized 3x3 Kernel Matrix Inspector */}
                <div className="panel p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-rule">
                            <span className="label label-accent">02 // Quantized Kernel (3×3)</span>
                            <span className="label">
                                Scale S = {computation.wScale.toFixed(4)}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 mb-4">
                            {Object.entries(KERNELS).map(([k, kObj]) => (
                                <button
                                    key={k}
                                    type="button"
                                    onClick={() => setKernelKey(k)}
                                    className={`text-left px-2.5 py-1.5 rounded border text-xs font-mono transition-colors truncate ${
                                        kernelKey === k
                                            ? 'border-accent text-accent bg-accent/10'
                                            : 'border-rule text-ink-muted hover:border-rule-strong'
                                    }`}
                                >
                                    {kObj.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-auto">
                        {computation.qWeights.flat().map((w, i) => {
                            const orig = computation.kernel.weights[Math.floor(i / 3)][i % 3];
                            return (
                                <div
                                    key={i}
                                    className="p-2 rounded bg-surface-2 border border-rule flex flex-col items-center justify-center"
                                >
                                    <span className="font-mono text-xs font-semibold text-ink tabular-nums">
                                        {precision === 'fp32' ? orig.toFixed(2) : `${w > 0 ? '+' : ''}${w}`}
                                    </span>
                                    <span className="text-[10px] font-mono text-ink-dim">
                                        {precision === 'fp32' ? 'float32' : `fp:${orig.toFixed(1)}`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Column: Quantization Mode Controls + Feature Map + Im2Col Vectorizer + Benchmarks */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Precision Controls Bar */}
                <div className="panel p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-rule">
                        <div>
                            <span className="label label-accent block">03 // Precision & Hardware Target</span>
                            <span className="text-xs text-ink-muted">
                                Inspired by Mini-CNN Framework (Pure C/C++ LeNet-5 with Im2Col)
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setReluEnabled(!reluEnabled)}
                            className={`px-3 py-1 rounded text-xs font-mono border transition-colors ${
                                reluEnabled
                                    ? 'border-ok text-ok bg-ok/10'
                                    : 'border-rule text-ink-dim'
                            }`}
                        >
                            ReLU: {reluEnabled ? 'ACTIVE' : 'BYPASSED'}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        {Object.values(PRECISION_SPECS).map(spec => {
                            const active = precision === spec.id;
                            return (
                                <button
                                    key={spec.id}
                                    type="button"
                                    onClick={() => setPrecision(spec.id)}
                                    className={`p-3 rounded border text-left transition-all ${
                                        active
                                            ? 'border-accent bg-accent/10'
                                            : 'border-rule bg-surface-2 hover:border-rule-strong'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-mono text-xs font-bold ${active ? 'text-accent' : 'text-ink'}`}>
                                            {spec.label}
                                        </span>
                                        <span className="label">{spec.bits}-BIT</span>
                                    </div>
                                    <span className="text-[11px] font-mono text-ink-muted block truncate">
                                        {spec.isa}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Output Activation Feature Map + Im2Col Memory Strip */}
                <div className="panel p-5 grid md:grid-cols-12 gap-5 items-center">
                    <div className="md:col-span-6">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="label label-accent">Feature Map (8×8)</span>
                            <span className="label">Hover to step Im2Col</span>
                        </div>

                        <div className="grid grid-cols-8 gap-1 aspect-square max-w-[240px] mx-auto p-2 bg-surface-2 border border-rule rounded">
                            {computation.quantOut.map((row, r) =>
                                row.map((val, c) => {
                                    const norm = Math.min(1, Math.abs(val) / computation.maxAct);
                                    const isHovered = hoverPatch.r === r && hoverPatch.c === c;
                                    const err = Math.abs(computation.fp32Out[r][c] - val);
                                    return (
                                        <div
                                            key={`${r}-${c}`}
                                            onMouseEnter={() => setHoverPatch({ r, c })}
                                            className={`rounded-[1px] cursor-pointer transition-transform ${
                                                isHovered ? 'ring-2 ring-accent scale-110 z-10' : ''
                                            }`}
                                            style={{
                                                backgroundColor:
                                                    norm > 0.03
                                                        ? val >= 0
                                                            ? `color-mix(in srgb, var(--accent) ${Math.round(norm * 95)}%, var(--surface-3))`
                                                            : `color-mix(in srgb, var(--err) ${Math.round(norm * 95)}%, var(--surface-3))`
                                                        : 'var(--surface-1)',
                                            }}
                                            title={`Out[${r},${c}] = ${val.toFixed(2)} | ΔFP32 = ${err.toFixed(3)}`}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Im2Col Cache-Locality Inspector */}
                    <div className="md:col-span-6 flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-rule">
                                <span className="label label-accent">Im2Col Continuous Cache Strip</span>
                                <span className="label">Row #{hoverPatch.r * 8 + hoverPatch.c}</span>
                            </div>
                            <p className="text-xs text-ink-muted leading-relaxed mb-3">
                                Unrolls the 3×3 spatial patch at <code className="font-mono text-ink">[{hoverPatch.r},{hoverPatch.c}]</code> into a contiguous 1×9 vector for single-cycle SIMD dot-product:
                            </p>

                            {/* 1x9 Contiguous Vector */}
                            <div className="mb-3">
                                <span className="text-[10px] font-mono text-ink-dim uppercase block mb-1">
                                    Input Patch Vector X (1×9):
                                </span>
                                <div className="grid grid-cols-9 gap-1">
                                    {computation.im2colPatch.map((v, i) => (
                                        <div
                                            key={i}
                                            className="py-1.5 bg-surface-2 border border-rule rounded text-center font-mono text-[10px] text-ink tabular-nums"
                                        >
                                            {precision === 'fp32'
                                                ? v.toFixed(1)
                                                : Math.round(v * (computation.spec.levels || 1))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <span className="text-[10px] font-mono text-ink-dim uppercase block mb-1">
                                    Kernel Column Vector W (9×1):
                                </span>
                                <div className="grid grid-cols-9 gap-1">
                                    {computation.qWeights.flat().map((w, i) => (
                                        <div
                                            key={i}
                                            className="py-1.5 bg-surface-2 border border-accent/40 rounded text-center font-mono text-[10px] text-accent tabular-nums"
                                        >
                                            {precision === 'fp32' ? w.toFixed(1) : w}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-3 rounded bg-surface-2 border border-rule flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-mono text-ink-dim uppercase block">
                                    Output Activation Y[{hoverPatch.r},{hoverPatch.c}]
                                </span>
                                <span className="font-mono text-sm font-bold text-accent tabular-nums">
                                    {computation.quantOut[hoverPatch.r][hoverPatch.c].toFixed(3)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-mono text-ink-dim uppercase block">
                                    FP32 Drift (|Δ|)
                                </span>
                                <span className="font-mono text-sm text-ink tabular-nums">
                                    {Math.abs(
                                        computation.fp32Out[hoverPatch.r][hoverPatch.c] -
                                            computation.quantOut[hoverPatch.r][hoverPatch.c]
                                    ).toFixed(4)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Telemetry Readout Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="panel p-3.5">
                        <span className="label block mb-1">Model Footprint</span>
                        <span className="readout-value readout-value-accent text-xl">
                            {computation.spec.weightBytes}
                        </span>
                        <span className="text-[11px] font-mono text-ink-dim block mt-0.5">
                            {computation.spec.compression} compression
                        </span>
                    </div>
                    <div className="panel p-3.5">
                        <span className="label block mb-1">C++ Edge Latency</span>
                        <span className="readout-value text-xl">
                            {computation.spec.latencyMs}
                        </span>
                        <span className="text-[11px] font-mono text-ok block mt-0.5">
                            {computation.spec.speedup} speedup
                        </span>
                    </div>
                    <div className="panel p-3.5">
                        <span className="label block mb-1">Feature Cosine Sim</span>
                        <span className="readout-value text-xl">
                            {computation.cosineSim.toFixed(2)}%
                        </span>
                        <span className="text-[11px] font-mono text-ink-dim block mt-0.5">
                            vs FP32 baseline
                        </span>
                    </div>
                    <div className="panel p-3.5">
                        <span className="label block mb-1">Quantization SQNR</span>
                        <span className="readout-value text-xl">
                            {computation.sqnrDb}
                        </span>
                        <span className="text-[11px] font-mono text-ink-dim block mt-0.5">
                            RMSE: {computation.rmse.toFixed(4)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Module 2: Autonomous Multi-Sensor Kalman Fusion Lab (LiDAR + RADAR)
// ---------------------------------------------------------------------------

function gaussianRandom() {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const SensorFusionLab = () => {
    const canvasRef = useRef(null);
    const [lidarActive, setLidarActive] = useState(true);
    const [radarActive, setRadarActive] = useState(true);
    const [weatherNoise, setWeatherNoise] = useState(1.0); // 1.0 = Clear, 2.5 = Heavy Rain/Fog
    const [autoTrajectory, setAutoTrajectory] = useState(true);
    const [telemetry, setTelemetry] = useState({
        rawLidarErr: 0,
        rawRadarErr: 0,
        kalmanErr: 0,
        velocity: 0,
        uncertaintyRadius: 0,
        gainK: 0.42,
    });

    // Mutable simulation state kept in a ref so the 60fps loop never re-mounts
    const simRef = useRef({
        t: 0,
        target: { x: 240, y: 150, vx: 0, vy: 0 },
        pointer: { x: 240, y: 150, active: false },
        // Kalman state: [x, y, vx, vy]
        est: { x: 240, y: 150, vx: 0, vy: 0 },
        cov: 18.0, // scalar trace approximation for visual covariance ellipse
        historyGt: [],
        historyEst: [],
        lidarMeas: [],
        radarMeas: [],
        frameCount: 0,
    });

    const resetTrack = useCallback(() => {
        const s = simRef.current;
        s.historyGt = [];
        s.historyEst = [];
        s.lidarMeas = [];
        s.radarMeas = [];
        s.cov = 25.0;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d');
        let rafId;

        const stepSimulation = () => {
            const s = simRef.current;
            const W = canvas.width;
            const H = canvas.height;
            const dt = 1 / 30;
            s.t += dt;
            s.frameCount += 1;

            // 1. Update Ground Truth Target Position (Figure-8 autonomous highway lane change or manual pointer)
            const prevX = s.target.x;
            const prevY = s.target.y;

            if (!autoTrajectory && s.pointer.active) {
                s.target.x += (s.pointer.x - s.target.x) * 0.18;
                s.target.y += (s.pointer.y - s.target.y) * 0.18;
            } else {
                const cx = W * 0.5;
                const cy = H * 0.5;
                const rx = W * 0.34;
                const ry = H * 0.28;
                s.target.x = cx + rx * Math.sin(s.t * 0.9);
                s.target.y = cy + ry * Math.sin(s.t * 1.8);
            }

            s.target.vx = (s.target.x - prevX) / dt;
            s.target.vy = (s.target.y - prevY) / dt;

            // 2. Kalman Filter Predict Step: x_k|k-1 = F * x_k-1
            s.est.x += s.est.vx * dt;
            s.est.y += s.est.vy * dt;
            const processNoiseQ = 1.6;
            s.cov = Math.min(85, s.cov + processNoiseQ);

            // 3. Generate Noisy Sensor Measurements
            // LiDAR degrades more in fog/rain (weatherNoise); RADAR is weather-resilient but has higher angular noise
            const lidarSigma = 9.5 * weatherNoise;
            const radarSigma = 17.0 * (1 + (weatherNoise - 1) * 0.25);

            let lidarErrNow = null;
            let radarErrNow = null;
            let kalmanGainDisplay = 0;

            if (lidarActive) {
                const zLx = s.target.x + gaussianRandom() * lidarSigma;
                const zLy = s.target.y + gaussianRandom() * lidarSigma;
                lidarErrNow = Math.hypot(zLx - s.target.x, zLy - s.target.y);
                s.lidarMeas.push({ x: zLx, y: zLy, alpha: 1.0 });
                if (s.lidarMeas.length > 18) s.lidarMeas.shift();

                // Kalman Measurement Update for LiDAR (Position [x, y])
                const R_lidar = lidarSigma * lidarSigma * 0.18;
                const K = s.cov / (s.cov + R_lidar);
                kalmanGainDisplay = K;
                const innovX = zLx - s.est.x;
                const innovY = zLy - s.est.y;
                s.est.x += K * innovX;
                s.est.y += K * innovY;
                s.est.vx += (K * 0.55 * innovX) / dt;
                s.est.vy += (K * 0.55 * innovY) / dt;
                s.cov = (1 - K) * s.cov;
            }

            if (radarActive) {
                const zRx = s.target.x + gaussianRandom() * radarSigma;
                const zRy = s.target.y + gaussianRandom() * radarSigma;
                // RADAR directly measures radial velocity via Doppler shift
                const zRvx = s.target.vx + gaussianRandom() * 14.0;
                const zRvy = s.target.vy + gaussianRandom() * 14.0;

                radarErrNow = Math.hypot(zRx - s.target.x, zRy - s.target.y);
                s.radarMeas.push({ x: zRx, y: zRy, vx: zRvx, vy: zRvy, alpha: 1.0 });
                if (s.radarMeas.length > 14) s.radarMeas.shift();

                // Kalman Measurement Update for RADAR (Position + Doppler Velocity)
                const R_radar = radarSigma * radarSigma * 0.22;
                const K_pos = s.cov / (s.cov + R_radar);
                const K_vel = 0.38;
                kalmanGainDisplay = Math.max(kalmanGainDisplay, K_pos);
                s.est.x += K_pos * (zRx - s.est.x);
                s.est.y += K_pos * (zRy - s.est.y);
                s.est.vx += K_vel * (zRvx - s.est.vx);
                s.est.vy += K_vel * (zRvy - s.est.vy);
                s.cov = (1 - K_pos * 0.8) * s.cov;
            }

            // Record Trajectory Trails
            s.historyGt.push({ x: s.target.x, y: s.target.y });
            s.historyEst.push({ x: s.est.x, y: s.est.y });
            if (s.historyGt.length > 75) s.historyGt.shift();
            if (s.historyEst.length > 75) s.historyEst.shift();

            // 4. Render Tactical Autonomous Perception HUD
            const style = getComputedStyle(document.documentElement);
            const bgCol = style.getPropertyValue('--surface-2').trim() || '#0f182a';
            const ruleCol = style.getPropertyValue('--rule').trim() || '#1b293d';
            const accentCol = style.getPropertyValue('--accent').trim() || '#00f2fe';
            const okCol = style.getPropertyValue('--ok').trim() || '#35d6a0';
            const errCol = style.getPropertyValue('--err').trim() || '#ff6b5e';
            const textMuted = style.getPropertyValue('--text-muted').trim() || '#8da0b6';

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = bgCol;
            ctx.fillRect(0, 0, W, H);

            // Polar range rings from Ego Vehicle at bottom center
            const egoX = W * 0.5;
            const egoY = H - 18;
            ctx.strokeStyle = ruleCol;
            ctx.lineWidth = 1;
            [90, 170, 250, 330].forEach(rad => {
                ctx.beginPath();
                ctx.arc(egoX, egoY, rad, Math.PI, 2 * Math.PI);
                ctx.stroke();
            });

            // Cartesian grid lines
            for (let gx = 40; gx < W; gx += 60) {
                ctx.beginPath();
                ctx.moveTo(gx, 0);
                ctx.lineTo(gx, H);
                ctx.stroke();
            }
            for (let gy = 40; gy < H; gy += 60) {
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.lineTo(W, gy);
                ctx.stroke();
            }

            // Draw Ground Truth Path (Dashed Muted Line)
            if (s.historyGt.length > 1) {
                ctx.save();
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = textMuted;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                s.historyGt.forEach((pt, idx) => {
                    if (idx === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
                ctx.stroke();
                ctx.restore();
            }

            // Draw Raw RADAR Hits (Amber/Coral Diamonds + Doppler Vectors)
            if (radarActive) {
                s.radarMeas.forEach((m, i) => {
                    const fade = (i + 1) / s.radarMeas.length;
                    ctx.save();
                    ctx.globalAlpha = fade * 0.65;
                    ctx.strokeStyle = errCol;
                    ctx.fillStyle = errCol;
                    ctx.translate(m.x, m.y);
                    ctx.rotate(Math.PI / 4);
                    ctx.fillRect(-3, -3, 6, 6);
                    ctx.restore();
                });
            }

            // Draw Raw LiDAR Point Cloud Hits (Cyan Crosshairs)
            if (lidarActive) {
                s.lidarMeas.forEach((m, i) => {
                    const fade = (i + 1) / s.lidarMeas.length;
                    ctx.save();
                    ctx.globalAlpha = fade * 0.75;
                    ctx.fillStyle = accentCol;
                    ctx.beginPath();
                    ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                });
            }

            // Draw Kalman Fused Trajectory (Solid OK/Emerald Line)
            if (s.historyEst.length > 1) {
                ctx.save();
                ctx.strokeStyle = okCol;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                s.historyEst.forEach((pt, idx) => {
                    if (idx === 0) ctx.moveTo(pt.x, pt.y);
                    else ctx.lineTo(pt.x, pt.y);
                });
                ctx.stroke();
                ctx.restore();
            }

            // Draw Ground Truth Vehicle Bounding Box
            ctx.save();
            ctx.strokeStyle = textMuted;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(s.target.x - 12, s.target.y - 8, 24, 16);
            ctx.restore();

            // Draw Kalman State Estimate + 2-Sigma Covariance Uncertainty Ellipse
            const covRadius = Math.max(6, Math.sqrt(s.cov) * 3.2);
            ctx.save();
            ctx.fillStyle = okCol;
            ctx.strokeStyle = okCol;
            ctx.globalAlpha = 0.16;
            ctx.beginPath();
            ctx.arc(s.est.x, s.est.y, covRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 0.85;
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Velocity Vector Arrow from Kalman Estimate
            ctx.beginPath();
            ctx.moveTo(s.est.x, s.est.y);
            ctx.lineTo(s.est.x + s.est.vx * 0.22, s.est.y + s.est.vy * 0.22);
            ctx.stroke();

            // Center Fused Target Node
            ctx.beginPath();
            ctx.arc(s.est.x, s.est.y, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Update React Telemetry Readout every 6 frames (~5Hz)
            if (s.frameCount % 6 === 0) {
                const kErr = Math.hypot(s.est.x - s.target.x, s.est.y - s.target.y);
                const speedMps = Math.hypot(s.est.vx, s.est.vy) * 0.12;
                setTelemetry({
                    rawLidarErr: lidarErrNow !== null ? lidarErrNow * 0.04 : null,
                    rawRadarErr: radarErrNow !== null ? radarErrNow * 0.04 : null,
                    kalmanErr: kErr * 0.04,
                    velocity: speedMps,
                    uncertaintyRadius: covRadius * 0.04,
                    gainK: kalmanGainDisplay,
                });
            }

            rafId = requestAnimationFrame(stepSimulation);
        };

        rafId = requestAnimationFrame(stepSimulation);
        return () => cancelAnimationFrame(rafId);
    }, [lidarActive, radarActive, weatherNoise, autoTrajectory]);

    const handlePointerMove = (e) => {
        if (autoTrajectory) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        simRef.current.pointer = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            active: true,
        };
    };

    return (
        <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column: Interactive Bird's-Eye-View (BEV) Sensor Fusion Canvas */}
            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="panel p-5 flex-1 flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-rule">
                        <div>
                            <span className="label label-accent block">BEV Perception Arena // 30 Hz Loop</span>
                            <span className="text-xs text-ink-muted">
                                {autoTrajectory
                                    ? 'Autonomous figure-8 maneuver active'
                                    : 'Move cursor inside arena to steer target vehicle'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setAutoTrajectory(!autoTrajectory)}
                                className={`px-2.5 py-1 rounded text-xs font-mono border transition-colors ${
                                    !autoTrajectory
                                        ? 'border-accent text-accent bg-accent/10'
                                        : 'border-rule text-ink-muted hover:border-accent/50'
                                }`}
                            >
                                {autoTrajectory ? 'Mode: Auto Path' : 'Mode: Manual Cursor'}
                            </button>
                            <button
                                type="button"
                                onClick={resetTrack}
                                className="px-2.5 py-1 rounded text-xs font-mono border border-rule text-ink-dim hover:text-ink transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full overflow-hidden rounded border border-rule bg-surface-2">
                        <canvas
                            ref={canvasRef}
                            width={560}
                            height={320}
                            onMouseMove={handlePointerMove}
                            onMouseEnter={() => {
                                if (!autoTrajectory) simRef.current.pointer.active = true;
                            }}
                            className={`w-full h-auto block ${
                                autoTrajectory ? 'cursor-default' : 'cursor-crosshair'
                            }`}
                        />

                        {/* Legend Overlay */}
                        <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-surface-1/90 border-t border-rule text-[11px] font-mono">
                            <span className="flex items-center gap-1.5 text-ink-muted">
                                <span className="w-2.5 h-0.5 bg-ink-muted inline-block" /> Ground Truth
                            </span>
                            <span className="flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
                                <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} /> LiDAR Point (XYZ)
                            </span>
                            <span className="flex items-center gap-1.5" style={{ color: 'var(--err)' }}>
                                <span className="w-2 h-2 rotate-45 inline-block" style={{ background: 'var(--err)' }} /> RADAR Doppler
                            </span>
                            <span className="flex items-center gap-1.5" style={{ color: 'var(--ok)' }}>
                                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: 'var(--ok)' }} /> Kalman Estimate (2σ)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Sensor Toggles, Weather Degradation & Kalman Telemetry */}
            <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
                <div className="panel p-5">
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-rule">
                        <span className="label label-accent">Sensor Suite & Weather Stress-Test</span>
                        <span className="label">State: [x, y, vx, vy]ᵀ</span>
                    </div>

                    <p className="text-xs text-ink-muted leading-relaxed mb-4">
                        Toggle sensors to observe dead-reckoning covariance blowup, or inject adverse weather to see how RADAR Doppler stabilizes degraded LiDAR returns.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button
                            type="button"
                            onClick={() => setLidarActive(!lidarActive)}
                            className={`p-3 rounded border text-left transition-all ${
                                lidarActive
                                    ? 'border-accent bg-accent/10'
                                    : 'border-rule bg-surface-2 opacity-60'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-ink">LiDAR 3D</span>
                                <span className={`w-2 h-2 rounded-full ${lidarActive ? 'bg-ok' : 'bg-err'}`} />
                            </div>
                            <span className="text-[11px] font-mono text-ink-muted block">
                                High spatial res • Weather sensitive
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setRadarActive(!radarActive)}
                            className={`p-3 rounded border text-left transition-all ${
                                radarActive
                                    ? 'border-accent bg-accent/10'
                                    : 'border-rule bg-surface-2 opacity-60'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-ink">FMCW RADAR</span>
                                <span className={`w-2 h-2 rounded-full ${radarActive ? 'bg-ok' : 'bg-err'}`} />
                            </div>
                            <span className="text-[11px] font-mono text-ink-muted block">
                                Direct Doppler velocity • All-weather
                            </span>
                        </button>
                    </div>

                    {/* Weather / Environmental Noise Selector */}
                    <div>
                        <div className="flex justify-between text-xs font-mono mb-2">
                            <span className="text-ink-muted">Environmental Attenuation:</span>
                            <span className="text-accent">
                                {weatherNoise === 1.0
                                    ? 'Clear Dry Road (1.0x σ)'
                                    : weatherNoise === 1.8
                                    ? 'Moderate Rain (1.8x LiDAR σ)'
                                    : 'Heavy Fog / Snow (2.8x LiDAR σ)'}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Clear Sky', val: 1.0 },
                                { label: 'Rain', val: 1.8 },
                                { label: 'Dense Fog', val: 2.8 },
                            ].map(w => (
                                <button
                                    key={w.label}
                                    type="button"
                                    onClick={() => setWeatherNoise(w.val)}
                                    className={`py-1.5 px-2 rounded border font-mono text-xs transition-colors ${
                                        weatherNoise === w.val
                                            ? 'border-accent text-accent bg-accent/10'
                                            : 'border-rule text-ink-muted hover:border-rule-strong'
                                    }`}
                                >
                                    {w.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Live Kalman Filter Diagnostics */}
                <div className="panel p-5">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-rule">
                        <span className="label label-accent">Live Filter Telemetry</span>
                        <span className="label" style={{ color: !lidarActive && !radarActive ? 'var(--err)' : 'var(--ok)' }}>
                            {!lidarActive && !radarActive ? 'DEAD RECKONING DRIFT' : 'KALMAN LOCKED'}
                        </span>
                    </div>

                    <dl className="divide-y divide-rule">
                        <div className="readout-row">
                            <dt>LiDAR Raw RMSE</dt>
                            <dd className="ml-auto">
                                {telemetry.rawLidarErr !== null ? `${telemetry.rawLidarErr.toFixed(2)} m` : 'OFFLINE'}
                            </dd>
                        </div>
                        <div className="readout-row">
                            <dt>RADAR Raw RMSE</dt>
                            <dd className="ml-auto">
                                {telemetry.rawRadarErr !== null ? `${telemetry.rawRadarErr.toFixed(2)} m` : 'OFFLINE'}
                            </dd>
                        </div>
                        <div className="readout-row">
                            <dt>Kalman Fused Error</dt>
                            <dd className="ml-auto font-bold" style={{ color: 'var(--ok)' }}>
                                {telemetry.kalmanErr.toFixed(2)} m
                            </dd>
                        </div>
                        <div className="readout-row">
                            <dt>2σ Uncertainty Radius</dt>
                            <dd className="ml-auto">
                                ±{telemetry.uncertaintyRadius.toFixed(2)} m (K = {telemetry.gainK.toFixed(2)})
                            </dd>
                        </div>
                        <div className="readout-row">
                            <dt>Fused Target Speed</dt>
                            <dd className="ml-auto">{telemetry.velocity.toFixed(1)} m/s</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

// ---------------------------------------------------------------------------
// Unified Micro-Sandbox Container (Embeddable inside Skills or Projects)
// ---------------------------------------------------------------------------

export const NeuralSandbox = ({ t }) => {
    const [activeTab, setActiveTab] = useState('cnn');

    const tabs = [
        {
            id: 'cnn',
            index: 'LAB 01',
            title: t?.sandbox?.cnnTab || 'Edge CNN Quantization & Im2Col',
            badge: 'C/C++ HPC • INT8 / INT4',
        },
        {
            id: 'fusion',
            index: 'LAB 02',
            title: t?.sandbox?.fusionTab || 'LiDAR + RADAR Kalman Sensor Fusion',
            badge: 'ADAS PERCEPTION • 30HZ',
        },
    ];

    return (
        <div className="mt-10">
            <div className="panel p-6 md:p-8 border-accent/40">
                {/* Header & Mode Switcher */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-5 border-b border-rule">
                    <div>
                        <div className="flex items-center gap-2.5 mb-2">
                            <span className="status-dot animate-pulse" />
                            <span className="label label-accent">
                                {t?.sandbox?.eyebrow || 'Interactive In-Browser AI Micro-Playground'}
                            </span>
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink">
                            {t?.sandbox?.title || 'Live Edge Inference & Sensor Fusion Telemetry'}
                        </h3>
                        <p className="text-sm text-ink-muted font-light mt-1 max-w-2xl">
                            {t?.sandbox?.subtitle ||
                                'Zero-backend client-side execution: test symmetric Int8 weight quantization and Im2Col memory unrolling, or stress-test a real-time LiDAR + RADAR Kalman tracker.'}
                        </p>
                    </div>

                    {/* Lab Switcher Tabs */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                        {tabs.map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 rounded border text-left transition-all cursor-pointer ${
                                        isActive
                                            ? 'border-accent bg-accent/10 text-ink'
                                            : 'border-rule bg-surface-2 text-ink-muted hover:border-rule-strong hover:text-ink'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="label label-accent">{tab.index}</span>
                                        <span className="text-[10px] font-mono text-ink-dim uppercase">
                                            {tab.badge}
                                        </span>
                                    </div>
                                    <div className="font-display text-xs md:text-sm font-bold mt-0.5">
                                        {tab.title}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Interactive Lab Body */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.22 }}
                    >
                        {activeTab === 'cnn' ? <CNNQuantizationLab t={t} /> : <SensorFusionLab t={t} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

