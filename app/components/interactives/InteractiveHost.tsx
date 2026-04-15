'use client';

import { Suspense, lazy, type ComponentType } from 'react';

const registry: Record<string, React.LazyExoticComponent<ComponentType>> = {
  'gamma-transform': lazy(() => import('./lecture3/GammaTransform')),
  'histogram-equalizer': lazy(() => import('./lecture3/HistogramEqualizer')),
  'convolution-demo': lazy(() => import('./lecture4/ConvolutionDemo')),
  'fourier-spectrum': lazy(() => import('./lecture4/FourierSpectrum')),
  'noise-restoration': lazy(() => import('./lecture5/NoiseAndRestoration')),
  'edge-detectors': lazy(() => import('./lecture6/EdgeDetectors')),
  'thresholding-demo': lazy(() => import('./lecture6/ThresholdingDemo')),
  'morphology-playground': lazy(() => import('./lecture7/MorphologyPlayground')),
  'glcm-calculator': lazy(() => import('./lecture8/GLCMCalculator')),
  'wavelet-decomposition': lazy(() => import('./lecture9/WaveletDecomposition')),
};

export default function InteractiveHost({ id }: { id: string }) {
  const Component = registry[id];
  if (!Component) return null;

  return (
    <div className="interactive-container my-5 rounded-lg border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <div className="px-4 py-2 border-b border-[var(--border-light)] bg-[var(--bg)] flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Interactive Demo
        </span>
      </div>
      <div className="p-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-8 text-[var(--text-3)] text-sm">
              Loading interactive...
            </div>
          }
        >
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
