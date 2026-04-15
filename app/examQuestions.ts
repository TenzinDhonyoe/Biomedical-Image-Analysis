// ============================================================
// Exam Question Bank for BME 872 Practice Final Exam
// Format: 10 MC (20 marks) + 2 SA (5 marks) + 1 LA (10 marks) + 1 Calc (10 marks) = 45 total
// ============================================================

// --- Type Definitions ---

export interface MCQuestion {
  id: string;
  chapter: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number; // 0-3 => A-D
  explanation?: string;
  formula?: string; // LaTeX
}

export interface ShortAnswerQuestion {
  id: string;
  chapter: number;
  question: string;
  modelAnswer: string;
  marks: number;
  formula?: string;
}

export interface LongAnswerSubPart {
  label: string;
  question: string;
  marks: number;
  modelAnswer: string;
  formula?: string;
}

export interface LongAnswerQuestion {
  id: string;
  chapters: number[];
  scenario: string;
  subParts: LongAnswerSubPart[];
}

export interface CalculationSubPart {
  label: string;
  question: string;
  marks: number;
  modelAnswer: string;
  modelAnswerFormulas?: string[];
}

export interface CalculationQuestion {
  id: string;
  chapter: number;
  setup: string;
  setupFormulas: string[];
  subParts: CalculationSubPart[];
}

// --- MC Question Bank (40 questions, 4 per chapter) ---

export const mcQuestions: MCQuestion[] = [
  // ===== Chapter 1: Introduction to Medical Image Analysis =====
  {
    id: 'mc-ch1-01',
    chapter: 1,
    question: 'Which of the following best describes tomography in medical imaging?',
    options: [
      'A straight line in the object is mapped to a single point in the image',
      'A cross-section of the object is imaged',
      'Only surface reflections of the object are recorded',
      'The image is always limited to one dimension',
    ],
    correctIndex: 1,
    explanation: 'Tomography images a cross-section (slice) of the body, preserving spatial information within that plane.',
  },
  {
    id: 'mc-ch1-02',
    chapter: 1,
    question: 'Which imaging modality uses spin density and relaxation times (T1, T2) to form images?',
    options: [
      'CT',
      'PET',
      'MRI',
      'Ultrasound',
    ],
    correctIndex: 2,
    explanation: 'MRI measures proton density, T1, and T2 relaxation times, providing excellent soft tissue contrast.',
  },
  {
    id: 'mc-ch1-03',
    chapter: 1,
    question: 'According to the Nyquist theorem, what is the minimum sampling rate required to reconstruct a band-limited signal with maximum frequency $\\Omega_N$?',
    options: [
      '$\\Omega_S = \\Omega_N$',
      '$\\Omega_S > 2\\Omega_N$',
      '$\\Omega_S = \\Omega_N / 2$',
      '$\\Omega_S > \\Omega_N / 2$',
    ],
    correctIndex: 1,
    explanation: 'The Nyquist theorem states the sampling rate must exceed twice the maximum frequency.',
  },
  {
    id: 'mc-ch1-04',
    chapter: 1,
    question: 'What is the key disadvantage of projection imaging (e.g., conventional X-ray) compared to tomography?',
    options: [
      'It requires more radiation',
      'It loses depth/geometry information by mapping a 3D line to a single point',
      'It cannot image bones',
      'It is always more expensive',
    ],
    correctIndex: 1,
    explanation: 'Projection imaging maps a 3D line to a single point, losing depth information.',
  },

  // ===== Chapter 2: Digital Image Fundamentals =====
  {
    id: 'mc-ch2-01',
    chapter: 2,
    question: 'How many gray levels does a 10-bit image have?',
    options: [
      '256',
      '512',
      '1024',
      '2048',
    ],
    correctIndex: 2,
    explanation: '$2^{10} = 1024$ gray levels.',
  },
  {
    id: 'mc-ch2-02',
    chapter: 2,
    question: 'In digital image representation, the origin is at the:',
    options: [
      'Bottom-left corner, x-axis pointing right',
      'Top-left corner, x-axis pointing down',
      'Center of the image',
      'Bottom-right corner, x-axis pointing up',
    ],
    correctIndex: 1,
    explanation: 'In digital images, the origin is at the top-left, x goes down (rows), y goes right (columns).',
  },
  {
    id: 'mc-ch2-03',
    chapter: 2,
    question: 'Which process converts continuous intensity values to discrete levels?',
    options: [
      'Sampling',
      'Quantization',
      'Convolution',
      'Interpolation',
    ],
    correctIndex: 1,
    explanation: 'Quantization discretizes intensity values. Sampling discretizes spatial coordinates.',
  },
  {
    id: 'mc-ch2-04',
    chapter: 2,
    question: 'Increasing the number of bits per pixel primarily improves:',
    options: [
      'Spatial resolution',
      'Temporal resolution',
      'Gray level resolution',
      'Color accuracy',
    ],
    correctIndex: 2,
    explanation: 'More bits = more gray levels = finer intensity transitions (gray level resolution).',
  },

  // ===== Chapter 3: Image Enhancement — Spatial Domain =====
  {
    id: 'mc-ch3-01',
    chapter: 3,
    question: 'In histogram equalization, the gray-level transformation function $T(r)$ should satisfy which of the following conditions?',
    options: [
      '$T(0) = 1$, $T(1) = 0$, and $T\'(r) < 0$',
      '$T(0) = 0$, $T(1) = 1$, and $T\'(r) \\geq 0$',
      '$T(0) = 0$, $T(1) = 0$, and $T\'(r) = 0$',
      '$T(0) = 1$, $T(1) = 1$, and $T\'(r) \\leq 0$',
    ],
    correctIndex: 1,
    explanation: 'The transform must be monotonically non-decreasing, map 0 to 0 and 1 to 1.',
  },
  {
    id: 'mc-ch3-02',
    chapter: 3,
    question: 'The log transform $s = c \\log(1+r)$ is particularly useful for:',
    options: [
      'Removing salt-and-pepper noise',
      'Displaying Fourier spectra by expanding dark values',
      'Performing edge detection',
      'Increasing image resolution',
    ],
    correctIndex: 1,
    explanation: 'Log transform expands dark pixel values and compresses bright ones, ideal for displaying Fourier spectra.',
  },
  {
    id: 'mc-ch3-03',
    chapter: 3,
    question: 'In power-law (gamma) transformation $s = c \\cdot r^\\gamma$, what happens when $\\gamma < 1$?',
    options: [
      'Dark regions become darker',
      'The image becomes binary',
      'Dark regions become brighter (expanded)',
      'The image is inverted',
    ],
    correctIndex: 2,
    explanation: 'Gamma < 1 brightens dark regions by expanding the lower gray level range.',
  },
  {
    id: 'mc-ch3-04',
    chapter: 3,
    question: 'Why is the result of discrete histogram equalization never perfectly uniform?',
    options: [
      'Because the Fourier transform introduces artifacts',
      'Because a continuous CDF formula is used for a quantized/discrete problem, requiring rounding',
      'Because the camera always introduces some noise',
      'Because the image must have at least 256 gray levels',
    ],
    correctIndex: 1,
    explanation: 'Rounding discrete CDF values to integer gray levels causes some bins to merge.',
  },

  // ===== Chapter 4: 2D Signals and Systems =====
  {
    id: 'mc-ch4-01',
    chapter: 4,
    question: 'Why is zero padding used before frequency-domain filtering?',
    options: [
      'To reduce the number of frequency samples',
      'To make the Fourier transform non-invertible',
      'To avoid incorrect convolution results and obtain the proper output size',
      'To convert a high-pass filter into a low-pass filter',
    ],
    correctIndex: 2,
    explanation: 'Zero padding prevents circular convolution artifacts and ensures the correct linear convolution output size.',
  },
  {
    id: 'mc-ch4-02',
    chapter: 4,
    question: 'What does $F(0,0)$ represent in the 2D DFT of an image?',
    options: [
      'The maximum intensity in the image',
      'The average (DC) value of the entire image',
      'The highest frequency component',
      'The phase at the center pixel',
    ],
    correctIndex: 1,
    explanation: 'F(0,0) is the DC component — the sum (and thus proportional to average) of all pixel values.',
  },
  {
    id: 'mc-ch4-03',
    chapter: 4,
    question: 'When you swap the magnitude and phase between two images and reconstruct, the result looks most like:',
    options: [
      'The image that contributed the magnitude',
      'The image that contributed the phase',
      'An average of both images',
      'Random noise',
    ],
    correctIndex: 1,
    explanation: 'Most structural information is in the phase, not the magnitude.',
  },
  {
    id: 'mc-ch4-04',
    chapter: 4,
    question: 'What does the convolution theorem state?',
    options: [
      'Convolution in spatial domain equals addition in frequency domain',
      'Convolution in spatial domain equals multiplication in frequency domain',
      'Convolution in frequency domain equals subtraction in spatial domain',
      'Convolution is commutative only in 1D',
    ],
    correctIndex: 1,
    explanation: 'f*h ↔ F·H: spatial convolution = frequency multiplication.',
  },

  // ===== Chapter 5: Image Restoration =====
  {
    id: 'mc-ch5-01',
    chapter: 5,
    question: 'In the degradation model $G(u,v) = H(u,v)F(u,v) + N(u,v)$, what does $H(u,v)$ represent?',
    options: [
      'The noise power spectrum',
      'The original clean image',
      'The degradation (blur) function in frequency domain',
      'The restored image',
    ],
    correctIndex: 2,
    explanation: 'H(u,v) is the degradation/blur function (e.g., camera shake, atmospheric turbulence).',
  },
  {
    id: 'mc-ch5-02',
    chapter: 5,
    question: 'Why does inverse filtering fail in practice?',
    options: [
      'It requires too much memory',
      'Wherever $H(u,v)$ is small, the noise term $N/H$ is amplified enormously',
      'It only works on color images',
      'It cannot handle Gaussian noise',
    ],
    correctIndex: 1,
    explanation: 'Division by small H values amplifies the noise term N/H, often producing useless results.',
  },
  {
    id: 'mc-ch5-03',
    chapter: 5,
    question: 'The Wiener filter minimizes:',
    options: [
      'The maximum absolute error',
      'The mean square error between estimated and true image',
      'The computational time',
      'The number of iterations needed',
    ],
    correctIndex: 1,
    explanation: 'The Wiener filter is optimal in the mean square error sense.',
  },
  {
    id: 'mc-ch5-04',
    chapter: 5,
    question: 'White noise is characterized by having:',
    options: [
      'A Gaussian spatial distribution only',
      'A constant/flat power spectrum in frequency domain',
      'Zero variance',
      'Peaks at specific frequencies',
    ],
    correctIndex: 1,
    explanation: 'White noise has constant power across all frequencies (flat spectrum).',
  },

  // ===== Chapter 6: Image Segmentation =====
  {
    id: 'mc-ch6-01',
    chapter: 6,
    question: 'Which statement about thresholding-based segmentation is correct?',
    options: [
      'If $f(x,y) \\leq T$, the pixel always belongs to the object',
      'Thresholding can only be applied when the histogram is unimodal',
      'Thresholding does not produce a binary image',
      'Thresholding assigns pixels to object or background based on comparison with a threshold value',
    ],
    correctIndex: 3,
    explanation: 'Thresholding compares each pixel to T and assigns it to object or background accordingly.',
  },
  {
    id: 'mc-ch6-02',
    chapter: 6,
    question: 'The Laplacian of Gaussian (LoG) edge detector finds edges at:',
    options: [
      'Peaks of the first derivative',
      'Zero crossings of the second derivative after Gaussian smoothing',
      'Minima of the Fourier magnitude',
      'Locations where the histogram is bimodal',
    ],
    correctIndex: 1,
    explanation: 'LoG smooths with Gaussian first, then the Laplacian zero crossings indicate edge locations.',
  },
  {
    id: 'mc-ch6-03',
    chapter: 6,
    question: 'In the Hough transform for line detection, what does a peak in the accumulator array represent?',
    options: [
      'A single edge pixel',
      'A collinear set of edge points forming a line in the image',
      'The average intensity of the image',
      'A region of uniform color',
    ],
    correctIndex: 1,
    explanation: 'Each peak in the accumulator corresponds to a set of collinear edge points — a detected line.',
  },
  {
    id: 'mc-ch6-04',
    chapter: 6,
    question: 'Otsu\'s thresholding method works by:',
    options: [
      'Manually selecting the threshold that looks best',
      'Minimizing the total number of pixels',
      'Maximizing the between-class variance of the two classes',
      'Setting the threshold to the median intensity',
    ],
    correctIndex: 2,
    explanation: 'Otsu automatically finds the threshold that maximizes between-class variance.',
  },

  // ===== Chapter 7: Morphological Tools =====
  {
    id: 'mc-ch7-01',
    chapter: 7,
    question: 'Which of the following best describes the effect of dilation in morphological image processing?',
    options: [
      'It grows or expands objects using a structuring element',
      'It shrinks objects and removes boundary pixels',
      'It converts a grayscale image into a binary image',
      'It extracts only the skeleton of an object',
    ],
    correctIndex: 0,
    explanation: 'Dilation grows/expands objects, fills holes and gaps, thickens boundaries.',
  },
  {
    id: 'mc-ch7-02',
    chapter: 7,
    question: 'Morphological opening (erosion then dilation) is used to:',
    options: [
      'Fill small holes and narrow breaks',
      'Remove small protrusions and break narrow connections',
      'Increase image contrast',
      'Perform edge detection',
    ],
    correctIndex: 1,
    explanation: 'Opening smooths contours from outside, removes thin protrusions, and breaks narrow connections.',
  },
  {
    id: 'mc-ch7-03',
    chapter: 7,
    question: 'What does it mean that opening and closing are idempotent?',
    options: [
      'They always produce the same output regardless of input',
      'Applying the operation multiple times gives the same result as applying it once',
      'They can only be applied to grayscale images',
      'They require exactly two iterations to converge',
    ],
    correctIndex: 1,
    explanation: '(A ∘ B) ∘ B = A ∘ B: applying again has no additional effect.',
  },
  {
    id: 'mc-ch7-04',
    chapter: 7,
    question: 'To clean a noisy binary fingerprint image, the recommended morphological sequence is:',
    options: [
      'Dilation followed by dilation',
      'Erosion only',
      'Opening (removes spurs) followed by closing (fills gaps)',
      'Closing followed by opening, repeated 10 times',
    ],
    correctIndex: 2,
    explanation: 'Opening removes small noise spurs, then closing fills remaining gaps and holes.',
  },

  // ===== Chapter 8: Representation and Description =====
  {
    id: 'mc-ch8-01',
    chapter: 8,
    question: 'Gray Level Co-occurrence Matrix (GLCM) is mainly used to compute:',
    options: [
      'First-order intensity histograms only',
      'Second-order gray-level texture statistics',
      'Morphological boundary extraction',
      'Fourier phase invariance',
    ],
    correctIndex: 1,
    explanation: 'GLCM captures second-order statistics — spatial relationships between neighboring gray level pairs.',
  },
  {
    id: 'mc-ch8-02',
    chapter: 8,
    question: 'Fourier descriptors are used to represent:',
    options: [
      'The intensity histogram of the whole image',
      'The frequency-domain description of a boundary shape',
      'Only the area of a segmented region',
      'The structuring element in morphology',
    ],
    correctIndex: 1,
    explanation: 'Fourier descriptors treat boundary coordinates as a complex signal and use the DFT for shape representation.',
  },
  {
    id: 'mc-ch8-03',
    chapter: 8,
    question: 'Compactness (Perimeter$^2$ / Area) is useful because:',
    options: [
      'It is always equal to 1 for any shape',
      'It is not sensitive to scale changes',
      'It only works for circular objects',
      'It measures the color of the region',
    ],
    correctIndex: 1,
    explanation: 'Compactness is scale-invariant: doubling the size does not change the ratio.',
  },
  {
    id: 'mc-ch8-04',
    chapter: 8,
    question: 'What is the main problem with first-order gray-level statistics (from the histogram)?',
    options: [
      'They require too much computation',
      'They cannot be computed from digital images',
      'They lack spatial information — different images with the same gray level counts have the same histogram',
      'They are not rotation-invariant',
    ],
    correctIndex: 2,
    explanation: 'Histograms ignore pixel locations. Rearranging pixels changes the image but keeps the same histogram.',
  },

  // ===== Chapter 9: Wavelets =====
  {
    id: 'mc-ch9-01',
    chapter: 9,
    question: 'In a 2D wavelet four-band decomposition, which subband corresponds to the approximation component?',
    options: [
      'HL',
      'LH',
      'HH',
      'LL',
    ],
    correctIndex: 3,
    explanation: 'LL = low-pass in both directions = approximation (smooth version of the image).',
  },
  {
    id: 'mc-ch9-02',
    chapter: 9,
    question: 'In wavelet denoising, why do we threshold the detail coefficients?',
    options: [
      'Because the approximation coefficients contain all the noise',
      'Because small detail coefficients are dominated by noise while large ones represent signal',
      'Because thresholding increases the image resolution',
      'Because all detail coefficients must be set to the same value',
    ],
    correctIndex: 1,
    explanation: 'Signal produces few large wavelet coefficients; noise produces many small scattered ones.',
  },
  {
    id: 'mc-ch9-03',
    chapter: 9,
    question: 'What is the main advantage of wavelets over the Fourier transform for image processing?',
    options: [
      'Wavelets are always faster to compute',
      'Wavelets provide both frequency AND spatial localization',
      'Wavelets can only process binary images',
      'Wavelets do not require any mathematical computation',
    ],
    correctIndex: 1,
    explanation: 'Fourier gives global frequency info but loses spatial location; wavelets provide both.',
  },
  {
    id: 'mc-ch9-04',
    chapter: 9,
    question: 'Wavelet packet analysis differs from standard wavelet decomposition because:',
    options: [
      'It only decomposes the approximation subband',
      'It also decomposes the detail subbands, creating a full binary tree of frequency bands',
      'It does not use filter banks',
      'It is limited to 1D signals only',
    ],
    correctIndex: 1,
    explanation: 'Standard wavelets only decompose LL at each level; wavelet packets also decompose HL, LH, HH.',
  },

  // ===== Chapter 10: Image Registration =====
  {
    id: 'mc-ch10-01',
    chapter: 10,
    question: 'Which of the following is a rigid body transform commonly used in image registration?',
    options: [
      'Rotation and translation only',
      'Rotation, translation, and nonlinear warping',
      'Translation and independent scaling in two axes',
      'Projective mapping with four-point correspondence',
    ],
    correctIndex: 0,
    explanation: 'Rigid body = rotation + translation only (preserves distances and angles).',
  },
  {
    id: 'mc-ch10-02',
    chapter: 10,
    question: 'What is the difference between image registration and image fusion?',
    options: [
      'They are exactly the same thing',
      'Registration changes gray levels while fusion changes geometry',
      'Registration brings images into spatial alignment; fusion is the integrated display of aligned data',
      'Fusion must be done before registration',
    ],
    correctIndex: 2,
    explanation: 'Registration = spatial alignment (geometry). Fusion = combined display (requires registration first).',
  },
  {
    id: 'mc-ch10-03',
    chapter: 10,
    question: 'Which statement about extrinsic registration methods is correct?',
    options: [
      'They are limited to rigid registration',
      'They are based only on voxel intensity values',
      'They are always nonrigid',
      'They use external markers or foreign objects attached to the patient',
    ],
    correctIndex: 3,
    explanation: 'Extrinsic methods rely on external fiducial markers, not image content alone.',
  },
  {
    id: 'mc-ch10-04',
    chapter: 10,
    question: 'An affine transformation preserves:',
    options: [
      'All distances between points',
      'Parallelism of lines',
      'Only rotation angles',
      'Nothing — it is completely free-form',
    ],
    correctIndex: 1,
    explanation: 'Affine = rigid + scaling + shearing. It preserves parallelism but not necessarily distances.',
  },
];

// --- Short Answer Question Bank (10 questions) ---

export const shortAnswerQuestions: ShortAnswerQuestion[] = [
  {
    id: 'sa-ch1-01',
    chapter: 1,
    question: 'Explain the difference between anatomical (static) and functional (physiological) imaging modalities. Give one example of each.',
    modelAnswer: 'Anatomical imaging shows the static distribution of a physical property — the structure of the body. Example: CT or X-ray (shows bones). Functional imaging shows metabolism, blood flow, or other physiological processes. Example: PET or fMRI (shows brain activity or metabolic uptake).',
    marks: 2.5,
  },
  {
    id: 'sa-ch2-01',
    chapter: 2,
    question: 'What happens to image quality if you decrease the number of quantization bits from 8 to 4? Explain in terms of gray levels and visual appearance.',
    modelAnswer: 'Reducing from 8-bit (256 gray levels) to 4-bit (16 gray levels) causes false contouring — smooth intensity gradients become visible staircase steps because there are too few levels to represent subtle intensity changes. The image appears posterized with abrupt transitions.',
    marks: 2.5,
  },
  {
    id: 'sa-ch3-01',
    chapter: 3,
    question: 'What is the difference between histogram equalization and histogram matching (specification)? When would you prefer matching over equalization?',
    modelAnswer: 'Histogram equalization maps the image through its CDF to produce an approximately uniform histogram. Histogram matching maps the image to achieve a specific desired histogram shape by chaining equalization with the inverse CDF of the target distribution. You prefer matching when a uniform histogram is not ideal — for example, when you want output to have a specific brightness distribution for a particular application.',
    marks: 2.5,
  },
  {
    id: 'sa-ch4-01',
    chapter: 4,
    question: 'Why do natural images have large magnitude at low frequencies and small magnitude at high frequencies in the Fourier domain? What happens when you remove the low-frequency components?',
    modelAnswer: 'Natural images are dominated by slowly varying regions (large smooth areas) which correspond to low frequencies, while edges and fine details (high frequency) are comparatively rare. Removing low frequencies (highpass filtering) removes the DC/average component and smooth regions, leaving only edges — the image goes dark except for boundary details.',
    marks: 2.5,
  },
  {
    id: 'sa-ch5-01',
    chapter: 5,
    question: 'Explain how the adaptive local noise reduction filter behaves differently in flat (smooth) areas versus edge areas of an image.',
    modelAnswer: 'The filter is: f-hat = g - (sigma_eta^2 / sigma_L^2)(g - m_L). In flat areas, the local variance sigma_L^2 is close to the noise variance sigma_eta^2, so the ratio is near 1, and the filter returns approximately the local mean m_L (smoothing out noise). At edges, sigma_L^2 >> sigma_eta^2, so the ratio is small and the filter returns close to the original value g, preserving the edge.',
    marks: 2.5,
    formula: '\\hat{f}(x,y) = g(x,y) - \\frac{\\sigma_\\eta^2}{\\sigma_L^2}\\left(g(x,y) - m_L\\right)',
  },
  {
    id: 'sa-ch6-01',
    chapter: 6,
    question: 'Why is the second derivative (Laplacian) much more sensitive to noise than the first derivative (gradient) for edge detection? What is the standard solution?',
    modelAnswer: 'The second derivative amplifies noise more because differentiation enhances high-frequency components, and doing it twice amplifies them further. Even small noise fluctuations produce large second-derivative responses, making the Laplacian nearly useless on noisy images. The solution is the Laplacian of Gaussian (LoG): first smooth with a Gaussian to remove noise, then apply the Laplacian. Edges are found at zero crossings.',
    marks: 2.5,
  },
  {
    id: 'sa-ch7-01',
    chapter: 7,
    question: 'Explain why erosion is sometimes not reversible. Under what condition does this occur?',
    modelAnswer: 'Erosion removes all pixels where the structuring element does not fit entirely inside the object. If the structuring element is larger than a feature (or the entire object), erosion removes it completely, producing an empty set. Once information is lost (pixels removed), dilation cannot recover the exact original shape. This is irreversible because you cannot reconstruct deleted features.',
    marks: 2.5,
  },
  {
    id: 'sa-ch8-01',
    chapter: 8,
    question: 'You are using chain code as a feature in a decision machine, but the chain code becomes very long and requires too much memory. What is one practical way to reduce this problem?',
    modelAnswer: 'Use a coarser segmentation or lower-resolution boundary representation so that the chain code becomes shorter. By resampling the boundary at a larger grid spacing, fewer direction codes are needed to represent the shape, reducing memory while preserving the overall shape structure.',
    marks: 2.5,
  },
  {
    id: 'sa-ch9-01',
    chapter: 9,
    question: 'In wavelet denoising, after computing the discrete wavelet transform (DWT) of a noisy image, why do we usually threshold the detail coefficients before reconstructing the image?',
    modelAnswer: 'Because in the wavelet domain, the true signal (edges and structures) produces a few large coefficients while noise spreads as many small coefficients across all subbands. By thresholding (setting small coefficients to zero), we remove the noise-dominated coefficients while preserving the signal-dominated ones. Reconstructing from the thresholded coefficients gives a denoised image.',
    marks: 2.5,
  },
  {
    id: 'sa-ch10-01',
    chapter: 10,
    question: 'What is the difference between rigid and affine transformations in image registration? How many degrees of freedom does each have in 3D?',
    modelAnswer: 'A rigid transformation includes only rotation and translation, preserving distances between all points. It has 6 DOF in 3D (3 rotations + 3 translations). An affine transformation adds scaling and shearing, preserving parallelism but not distances. It has 12 DOF in 3D (3 rotations + 3 translations + 3 scalings + 3 shears).',
    marks: 2.5,
  },
];

// --- Long Answer Question Bank (5 questions) ---

export const longAnswerQuestions: LongAnswerQuestion[] = [
  {
    id: 'la-01',
    chapters: [8],
    scenario: 'For extracting features from a segmented tumor to be used in a decision machine, we decide to use the following steps:\n(a) Extracting area, perimeter, and compactness as regional descriptors.\n(b) Extracting the minimum-integer chain code as a boundary feature.\n(c) Extracting first-order gray-level statistics as features.\n(d) Extracting second-order gray-level statistics as features.\n\nAnswer the following questions.',
    subParts: [
      {
        label: 'A',
        question: 'Area, perimeter, and compactness can all be used as regional descriptors. Compactness is defined as Perimeter$^2$ / Area. Why might compactness be a better feature than area and perimeter alone for comparing tumors across different medical images?',
        marks: 2,
        modelAnswer: 'Compactness is often a better feature than area or perimeter alone because it is less sensitive to scale. If the same tumor appears larger or smaller in different medical images, its area and perimeter will change, but compactness (Perimeter²/Area) remains more consistent. Therefore, compactness is more useful for comparing shape across images with different sizes or magnifications.',
        formula: '\\text{Compactness} = \\frac{\\text{Perimeter}^2}{\\text{Area}}',
      },
      {
        label: 'B',
        question: 'In boundary representation, chain code depends on the starting point. Explain why we use the minimum integer chain code. Also explain how to compute the minimum integer after writing the chain code around the boundary.',
        marks: 3,
        modelAnswer: 'We use the minimum integer chain code because the chain code depends on the starting point chosen on the boundary. For the same object, choosing different starting points can produce different chain-code sequences, even though the boundary is unchanged. To reduce this ambiguity, we use the minimum-integer chain code as a more consistent representation.\n\nTo compute it, we first write the chain code by starting from an arbitrary boundary point. Then we circularly rotate the resulting chain-code sequence in all possible ways, interpret each rotated sequence as an integer, and select the minimum one. That minimum integer is used as the final chain-code representation for the object.',
      },
      {
        label: 'C',
        question: 'First-order gray-level statistics are obtained from the normalized histogram and convert the gray-level distribution into numerical features. Give two examples of first-order gray-level statistics that can each be used as a single-number feature for the tumor, and briefly explain what each one measures.',
        marks: 2,
        modelAnswer: 'Two examples of first-order gray-level statistics are:\n\n1. Mean gray level: This measures the average brightness or average darkness of the tumor region.\n\n2. Standard deviation (or variance): This measures how much the gray levels vary, or how much intensity change exists within the tumor region.',
      },
      {
        label: 'D',
        question: 'In second-order gray-level statistics, the neighbourhood function counts how often a gray level appears as a neighbour of another gray level in four directions. Why do we still keep this second-order feature in the pipeline even though we already have first-order gray-level statistics? What extra information does it provide and what problem of the first-order statistics would be solved here?',
        marks: 3,
        modelAnswer: 'We keep second-order gray-level statistics in the pipeline because first-order statistics are based only on the histogram, and the histogram does not contain spatial information. If the pixel locations are rearranged, the histogram can stay exactly the same even though the texture changes significantly.\n\nSecond-order statistics solve this problem by considering relationships between neighboring pixels. They describe how often one gray level appears next to another gray level in specified directions. As a result, they provide spatial texture information such as smoothness, regularity, roughness, and local intensity transitions. Therefore, second-order statistics give more informative texture features than first-order statistics alone.',
      },
    ],
  },
  {
    id: 'la-02',
    chapters: [5, 4],
    scenario: 'You are given a medical image that has been degraded by a known blur function $H(u,v)$ and additive noise $N(u,v)$. The degradation model in frequency domain is $G(u,v) = H(u,v)F(u,v) + N(u,v)$.\n\nAnswer the following questions about restoring this image.',
    subParts: [
      {
        label: 'A',
        question: 'Write the inverse filter formula. Explain why inverse filtering fails in practice, even when $H(u,v)$ is known.',
        marks: 3,
        modelAnswer: 'The inverse filter formula is: F-hat(u,v) = G(u,v)/H(u,v) = F(u,v) + N(u,v)/H(u,v).\n\nIt fails because wherever H(u,v) is small (near zero), the noise term N(u,v)/H(u,v) is amplified enormously. Even if H is known perfectly, the division by small values makes the noise dominate the result, producing a useless output. Division by zero is also possible where H is exactly zero.',
        formula: '\\hat{F}(u,v) = \\frac{G(u,v)}{H(u,v)} = F(u,v) + \\frac{N(u,v)}{H(u,v)}',
      },
      {
        label: 'B',
        question: 'Write the Wiener filter formula and explain what makes it better than the inverse filter. What does it minimize?',
        marks: 3,
        modelAnswer: 'The Wiener filter is: F-hat(u,v) = [H*(u,v) / (|H(u,v)|² + S_n/S_f)] · G(u,v).\n\nIt is better than the inverse filter because it balances deconvolution with noise suppression. The term S_n/S_f in the denominator prevents the noise from being amplified when H is small. When SNR is high, the filter acts like an inverse filter; when SNR is low, it suppresses noise instead. It minimizes the mean square error between the estimated and true image.',
        formula: '\\hat{F}(u,v) = \\frac{H^*(u,v)}{|H(u,v)|^2 + S_n/S_f} \\cdot G(u,v)',
      },
      {
        label: 'C',
        question: 'Why do we perform filtering in the frequency domain rather than the spatial domain? What theorem makes this efficient?',
        marks: 2,
        modelAnswer: 'We filter in the frequency domain because convolution in the spatial domain is computationally expensive (requires summing over the entire kernel for every pixel). The convolution theorem states that spatial convolution equals frequency multiplication: f*h ↔ F·H. Multiplication is much faster than convolution, especially for large images and kernels. Using FFT to transform, multiply, and inverse-transform is far more efficient.',
      },
      {
        label: 'D',
        question: 'Name three approaches to estimate the degradation function $H(u,v)$ and briefly describe each.',
        marks: 2,
        modelAnswer: '1) Observation: Examine the degraded image directly to infer the type and extent of degradation.\n2) Experiment: Image a known object (e.g., a point source/impulse) through the same system to obtain the point spread function (PSF) directly.\n3) Modeling: Use physical knowledge to build a mathematical model of the degradation (e.g., atmospheric turbulence model: H(u,v) = exp(-k(u²+v²)^(5/6))).',
      },
    ],
  },
  {
    id: 'la-03',
    chapters: [6, 7],
    scenario: 'You need to segment and extract cells from a microscopy image. The cells appear as bright objects on a darker background, but the image has varying illumination across the field of view and the cells occasionally touch each other.\n\nAnswer the following questions about your segmentation pipeline.',
    subParts: [
      {
        label: 'A',
        question: 'Why would global thresholding fail on this image? What alternative thresholding approach would you use and why?',
        marks: 2,
        modelAnswer: 'Global thresholding fails because the varying illumination means different parts of the image have different optimal thresholds. A single global T would over-segment bright areas and under-segment dark areas. The solution is adaptive (local) thresholding, which computes a different threshold for each region based on local statistics, accounting for illumination variation.',
      },
      {
        label: 'B',
        question: 'After thresholding, some cells are touching. Which morphological operation would you use to separate them? Explain its effect.',
        marks: 3,
        modelAnswer: 'Erosion would help separate touching cells. It shrinks objects by removing boundary pixels, so thin connections between touching cells are broken. However, this also shrinks the cells themselves. A better approach is to apply an opening operation (erosion followed by dilation with the same structuring element): the erosion separates the cells by breaking narrow connections, then the dilation partially restores the cell sizes without re-connecting them.',
      },
      {
        label: 'C',
        question: 'Explain the difference between the Sobel and Prewitt gradient operators. Which is generally preferred and why?',
        marks: 2,
        modelAnswer: 'Both are 3x3 gradient operators for edge detection. Prewitt uses equal weights: e.g., [-1,0,1; -1,0,1; -1,0,1]. Sobel adds weight 2 to the center element: [-1,0,1; -2,0,2; -1,0,1]. Sobel is generally preferred because the extra weight on the center provides some smoothing perpendicular to the gradient direction, making it slightly more noise-resistant.',
      },
      {
        label: 'D',
        question: 'After edge detection, you have a binary edge map with broken contours. How could the Hough transform help you extract complete cell boundaries if the cells are approximately circular?',
        marks: 3,
        modelAnswer: 'The Hough transform can detect circles by mapping each edge point to a set of possible circle parameters (center x, center y, radius) in a 3D accumulator. Each edge point votes for all circles that could pass through it. Peaks in the accumulator correspond to the most likely circles, even if the edge contour is broken or incomplete. This allows detecting complete circular cell boundaries from fragmented edge maps.',
      },
    ],
  },
  {
    id: 'la-04',
    chapters: [3, 4],
    scenario: 'You are developing an image enhancement pipeline for low-contrast medical images. The pipeline will use both spatial domain and frequency domain techniques.\n\nAnswer the following questions.',
    subParts: [
      {
        label: 'A',
        question: 'Describe the steps of discrete histogram equalization. Given a small image, how would you compute the transformed gray levels $S_k$?',
        marks: 3,
        modelAnswer: 'Steps of discrete histogram equalization:\n1) Compute the histogram h(r_k) = n_k (count pixels at each gray level).\n2) Normalize to get probability: p(r_k) = n_k / (M×N).\n3) Compute CDF: S_k = sum from j=0 to k of p(r_j).\n4) Round to integer levels: S_hat_k = Int[(S_k - S_min)/(1 - S_min) × (L-1) + 0.5].\n5) Map each original gray level r_k to its new level S_hat_k.\n\nThe result is an approximately uniform histogram with better contrast.',
      },
      {
        label: 'B',
        question: 'Compare spatial domain filtering (convolution with a kernel) and frequency domain filtering (multiply by H(u,v)). When would you prefer one over the other?',
        marks: 2,
        modelAnswer: 'Spatial domain filtering applies a kernel/mask directly to the image via convolution. It is simpler for small kernels but computationally expensive for large kernels. Frequency domain filtering multiplies the image spectrum by a filter function. It is more efficient for large kernels (due to FFT) and provides more intuitive filter design (specify cutoff frequencies directly). Prefer spatial domain for small, simple filters; prefer frequency domain for large filters or when precise frequency control is needed.',
      },
      {
        label: 'C',
        question: 'What is the effect of a gamma correction with $\\gamma < 1$ on a dark medical image? What about $\\gamma > 1$?',
        marks: 2,
        modelAnswer: 'With gamma < 1: Dark regions are brightened (the lower gray level range is expanded). This is useful for dark medical images where important details are hidden in the dark regions. The transform maps low input intensities to higher output intensities.\n\nWith gamma > 1: Bright regions are darkened (the upper gray level range is compressed). This would make the image even darker, which is not helpful for an already dark image.',
      },
      {
        label: 'D',
        question: 'Explain what happens when you apply a lowpass filter versus a highpass filter in the frequency domain. How does each affect the image visually?',
        marks: 3,
        modelAnswer: 'Lowpass filter: Keeps low frequencies (smooth regions, overall structure) and removes high frequencies (edges, fine details, noise). The result is a blurred/smoothed image. Useful for noise reduction.\n\nHighpass filter: Removes low frequencies (smooth regions, DC component) and keeps high frequencies (edges, fine details). The result appears dark (because the average/DC is removed) with only edges visible. Useful for edge detection and sharpening.',
      },
    ],
  },
  {
    id: 'la-05',
    chapters: [9, 10],
    scenario: 'A hospital needs to combine CT and PET scans of the same patient to improve tumor localization. The CT provides high-resolution anatomical detail while PET shows metabolic activity. The images were acquired at different times and the patient may have moved slightly.\n\nAnswer the following questions about the processing pipeline.',
    subParts: [
      {
        label: 'A',
        question: 'Before fusion, image registration must be performed. Define registration and explain why it is necessary in this scenario.',
        marks: 2,
        modelAnswer: 'Registration is a mathematical mapping that brings two images into spatial alignment by relating corresponding positions. It is necessary here because CT and PET were acquired at different times and possibly with different equipment, so the patient may have shifted position. Without registration, the anatomical CT structures would not align with the PET metabolic data, making it impossible to accurately localize which anatomical region has high metabolic activity.',
      },
      {
        label: 'B',
        question: 'What type of geometric transformation (rigid, affine, or deformable) would you use for this intra-subject, multi-modal registration? Justify your choice.',
        marks: 3,
        modelAnswer: 'A rigid transformation (rotation + translation, 6 DOF in 3D) would be the most appropriate choice. Since this is intra-subject registration (same patient), the anatomy has not changed — only the patient\'s position may have shifted between scans. Rigid transformation preserves distances and angles, which is correct since the body\'s internal structure has not deformed. Affine or deformable transforms would be unnecessarily complex and could introduce artificial distortions.',
      },
      {
        label: 'C',
        question: 'The PET image has significant noise. Describe the wavelet denoising pipeline you would apply before registration.',
        marks: 3,
        modelAnswer: 'Wavelet denoising pipeline:\n1) Compute the forward discrete wavelet transform (DWT) of the noisy PET image, producing approximation (LL) and detail (LH, HL, HH) subbands.\n2) Apply thresholding to the detail coefficients: set small coefficients (dominated by noise) to zero while keeping large coefficients (dominated by signal/edges).\n3) Keep the approximation coefficients unchanged (they contain the overall structure).\n4) Compute the inverse DWT to reconstruct the denoised image.\n\nThis works because signal energy is concentrated in a few large wavelet coefficients while noise energy is spread across many small coefficients.',
      },
      {
        label: 'D',
        question: 'After registration, what is the difference between registration and fusion? How would you display the combined CT+PET result?',
        marks: 2,
        modelAnswer: 'Registration is the geometric alignment step — it only changes the spatial mapping so both images are in the same coordinate frame. It does not change gray levels. Fusion is the integrated display of the aligned data. For CT+PET display, a common approach is to overlay the PET metabolic data as a color map (e.g., hot spots in red/yellow) on top of the grayscale CT anatomical image, allowing the clinician to see exactly where in the anatomy the metabolic activity is located.',
      },
    ],
  },
];

// --- Calculation Question Bank (4 questions) ---

export const calculationQuestions: CalculationQuestion[] = [
  {
    id: 'calc-01',
    chapter: 10,
    setup: 'Consider the following bilinear transform:\n\n$x_d = a_{00} + a_{10}x_s + a_{01}y_s + a_{11}x_sy_s$\n$y_d = b_{00} + b_{10}x_s + b_{01}y_s + b_{11}x_sy_s$\n\nwith parameters:\n$a_{00} = 1,\\; a_{10} = 2,\\; a_{01} = 1,\\; a_{11} = 0.5$\n$b_{00} = -1,\\; b_{10} = 1,\\; b_{01} = 2,\\; b_{11} = 0.5$\n\nA source landmark is $\\mathbf{x}_s = \\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix}$ and its true target landmark is $\\mathbf{y} = \\begin{bmatrix} 6.5 \\\\ 4.5 \\end{bmatrix}$.',
    setupFormulas: [
      'x_d = a_{00} + a_{10}x_s + a_{01}y_s + a_{11}x_sy_s',
      'y_d = b_{00} + b_{10}x_s + b_{01}y_s + b_{11}x_sy_s',
    ],
    subParts: [
      {
        label: 'a',
        question: 'Compute the transformed point $\\hat{\\mathbf{y}} = (x_d, y_d)$.',
        marks: 4,
        modelAnswer: 'Substitute the source point (x_s, y_s) = (2, 1) into the bilinear transform equations:\n\nx_d = 1 + 2(2) + 1(1) + 0.5(2)(1) = 1 + 4 + 1 + 1 = 7\ny_d = -1 + 1(2) + 2(1) + 0.5(2)(1) = -1 + 2 + 2 + 1 = 4\n\nThe transformed point is y-hat = [7, 4].',
        modelAnswerFormulas: [
          'x_d = 1 + 2(2) + 1(1) + 0.5(2)(1) = 7',
          'y_d = -1 + 1(2) + 2(1) + 0.5(2)(1) = 4',
          '\\hat{\\mathbf{y}} = \\begin{bmatrix} 7 \\\\ 4 \\end{bmatrix}',
        ],
      },
      {
        label: 'b',
        question: 'Compute the error vector $\\mathbf{e} = \\hat{\\mathbf{y}} - \\mathbf{y}$.',
        marks: 3,
        modelAnswer: 'The error vector is:\ne = y-hat - y = [7, 4] - [6.5, 4.5] = [0.5, -0.5]',
        modelAnswerFormulas: [
          '\\mathbf{e} = \\begin{bmatrix} 7 \\\\ 4 \\end{bmatrix} - \\begin{bmatrix} 6.5 \\\\ 4.5 \\end{bmatrix} = \\begin{bmatrix} 0.5 \\\\ -0.5 \\end{bmatrix}',
        ],
      },
      {
        label: 'c',
        question: 'Compute the squared error $\\|\\mathbf{e}\\|^2$.',
        marks: 3,
        modelAnswer: 'The squared error is:\n||e||² = (0.5)² + (-0.5)² = 0.25 + 0.25 = 0.5',
        modelAnswerFormulas: [
          '\\|\\mathbf{e}\\|^2 = (0.5)^2 + (-0.5)^2 = 0.25 + 0.25 = 0.5',
        ],
      },
    ],
  },
  {
    id: 'calc-02',
    chapter: 3,
    setup: 'Consider a 4×4 image (M=4, N=4, total 16 pixels) with 4 gray levels (L=4, levels 0, 1, 2, 3). The histogram is:\n\n| Gray Level $r_k$ | 0 | 1 | 2 | 3 |\n|---|---|---|---|---|\n| Count $n_k$ | 2 | 4 | 6 | 4 |\n\nPerform histogram equalization on this image.',
    setupFormulas: [
      'S_k = \\sum_{j=0}^{k} \\frac{n_j}{n}',
      '\\hat{S}_k = \\text{round}\\left(S_k \\times (L-1)\\right)',
    ],
    subParts: [
      {
        label: 'a',
        question: 'Compute the normalized histogram $p(r_k) = n_k / n$ for each gray level.',
        marks: 3,
        modelAnswer: 'Total pixels n = 16.\n\np(0) = 2/16 = 0.125\np(1) = 4/16 = 0.25\np(2) = 6/16 = 0.375\np(3) = 4/16 = 0.25',
        modelAnswerFormulas: [
          'p(0) = 2/16 = 0.125',
          'p(1) = 4/16 = 0.250',
          'p(2) = 6/16 = 0.375',
          'p(3) = 4/16 = 0.250',
        ],
      },
      {
        label: 'b',
        question: 'Compute the CDF values $S_k$ for each gray level.',
        marks: 4,
        modelAnswer: 'S_0 = p(0) = 0.125\nS_1 = p(0) + p(1) = 0.125 + 0.25 = 0.375\nS_2 = S_1 + p(2) = 0.375 + 0.375 = 0.75\nS_3 = S_2 + p(3) = 0.75 + 0.25 = 1.0',
        modelAnswerFormulas: [
          'S_0 = 0.125',
          'S_1 = 0.375',
          'S_2 = 0.750',
          'S_3 = 1.000',
        ],
      },
      {
        label: 'c',
        question: 'Map each gray level to its new equalized level by computing $\\hat{S}_k = \\text{round}(S_k \\times (L-1))$. Write the final mapping.',
        marks: 3,
        modelAnswer: 'With L-1 = 3:\n\nS-hat_0 = round(0.125 × 3) = round(0.375) = 0\nS-hat_1 = round(0.375 × 3) = round(1.125) = 1\nS-hat_2 = round(0.75 × 3) = round(2.25) = 2\nS-hat_3 = round(1.0 × 3) = round(3.0) = 3\n\nMapping: 0→0, 1→1, 2→2, 3→3.\n\nIn this case the histogram was already fairly well-distributed, so equalization produces minimal change.',
        modelAnswerFormulas: [
          '\\hat{S}_0 = \\text{round}(0.125 \\times 3) = 0',
          '\\hat{S}_1 = \\text{round}(0.375 \\times 3) = 1',
          '\\hat{S}_2 = \\text{round}(0.75 \\times 3) = 2',
          '\\hat{S}_3 = \\text{round}(1.0 \\times 3) = 3',
        ],
      },
    ],
  },
  {
    id: 'calc-03',
    chapter: 10,
    setup: 'Consider the following 2D affine transformation:\n\n$\\begin{bmatrix} x_d \\\\ y_d \\end{bmatrix} = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix} \\begin{bmatrix} x_s \\\\ y_s \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ -2 \\end{bmatrix}$\n\nGiven two source landmarks:\n$\\mathbf{p}_1 = \\begin{bmatrix} 1 \\\\ 1 \\end{bmatrix}$ with true target $\\mathbf{q}_1 = \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix}$\n$\\mathbf{p}_2 = \\begin{bmatrix} 0 \\\\ 2 \\end{bmatrix}$ with true target $\\mathbf{q}_2 = \\begin{bmatrix} 1 \\\\ 4 \\end{bmatrix}$',
    setupFormulas: [
      '\\begin{bmatrix} x_d \\\\ y_d \\end{bmatrix} = \\begin{bmatrix} 2 & 0 \\\\ 0 & 3 \\end{bmatrix} \\begin{bmatrix} x_s \\\\ y_s \\end{bmatrix} + \\begin{bmatrix} 1 \\\\ -2 \\end{bmatrix}',
    ],
    subParts: [
      {
        label: 'a',
        question: 'Compute the transformed points $\\hat{\\mathbf{q}}_1$ and $\\hat{\\mathbf{q}}_2$ using the affine transform.',
        marks: 4,
        modelAnswer: 'For p_1 = (1, 1):\nx_d = 2(1) + 0(1) + 1 = 3\ny_d = 0(1) + 3(1) + (-2) = 1\nq-hat_1 = [3, 1]\n\nFor p_2 = (0, 2):\nx_d = 2(0) + 0(2) + 1 = 1\ny_d = 0(0) + 3(2) + (-2) = 4\nq-hat_2 = [1, 4]',
        modelAnswerFormulas: [
          '\\hat{\\mathbf{q}}_1 = \\begin{bmatrix} 2(1)+0(1)+1 \\\\ 0(1)+3(1)-2 \\end{bmatrix} = \\begin{bmatrix} 3 \\\\ 1 \\end{bmatrix}',
          '\\hat{\\mathbf{q}}_2 = \\begin{bmatrix} 2(0)+0(2)+1 \\\\ 0(0)+3(2)-2 \\end{bmatrix} = \\begin{bmatrix} 1 \\\\ 4 \\end{bmatrix}',
        ],
      },
      {
        label: 'b',
        question: 'Compute the error vectors $\\mathbf{e}_1 = \\hat{\\mathbf{q}}_1 - \\mathbf{q}_1$ and $\\mathbf{e}_2 = \\hat{\\mathbf{q}}_2 - \\mathbf{q}_2$.',
        marks: 3,
        modelAnswer: 'e_1 = [3, 1] - [3, 1] = [0, 0]\ne_2 = [1, 4] - [1, 4] = [0, 0]\n\nBoth errors are zero — the transformation maps the landmarks exactly to their targets.',
        modelAnswerFormulas: [
          '\\mathbf{e}_1 = \\begin{bmatrix} 3-3 \\\\ 1-1 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}',
          '\\mathbf{e}_2 = \\begin{bmatrix} 1-1 \\\\ 4-4 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix}',
        ],
      },
      {
        label: 'c',
        question: 'Compute the total squared error $E = \\|\\mathbf{e}_1\\|^2 + \\|\\mathbf{e}_2\\|^2$. Is this a good registration?',
        marks: 3,
        modelAnswer: 'E = ||e_1||² + ||e_2||² = (0² + 0²) + (0² + 0²) = 0\n\nTotal squared error is 0, meaning this is a perfect registration — the affine transform maps both landmarks exactly to their true target positions.',
        modelAnswerFormulas: [
          'E = 0 + 0 = 0',
        ],
      },
    ],
  },
  {
    id: 'calc-04',
    chapter: 8,
    setup: 'Consider the following 4×4 image with 3 gray levels (0, 1, 2):\n\n$\\begin{bmatrix} 0 & 0 & 1 & 1 \\\\ 0 & 0 & 1 & 1 \\\\ 2 & 2 & 2 & 2 \\\\ 2 & 2 & 2 & 2 \\end{bmatrix}$\n\nWe want to compute the GLCM using the horizontal right-neighbor positioning operator (each pixel paired with the pixel to its right).',
    setupFormulas: [
      '\\text{GLCM}(i,j) = \\text{count of pixel pairs where left pixel} = i \\text{ and right pixel} = j',
    ],
    subParts: [
      {
        label: 'a',
        question: 'Construct the 3×3 unnormalized GLCM matrix. Count all horizontal right-neighbor pairs.',
        marks: 4,
        modelAnswer: 'Scanning all horizontal pairs (each row has 3 pairs, so 4 rows × 3 = 12 total pairs):\n\nRow 1: (0,0), (0,1), (1,1)\nRow 2: (0,0), (0,1), (1,1)\nRow 3: (2,2), (2,2), (2,2)\nRow 4: (2,2), (2,2), (2,2)\n\nCounting:\n(0,0): 2, (0,1): 2, (0,2): 0\n(1,0): 0, (1,1): 2, (1,2): 0\n(2,0): 0, (2,1): 0, (2,2): 6\n\nGLCM = [[2,2,0],[0,2,0],[0,0,6]]',
        modelAnswerFormulas: [
          '\\text{GLCM} = \\begin{bmatrix} 2 & 2 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 6 \\end{bmatrix}',
        ],
      },
      {
        label: 'b',
        question: 'Normalize the GLCM by dividing by the total number of pairs. Write the normalized matrix.',
        marks: 3,
        modelAnswer: 'Total pairs = 12.\n\nNormalized GLCM:\nc(0,0) = 2/12 ≈ 0.167\nc(0,1) = 2/12 ≈ 0.167\nc(1,1) = 2/12 ≈ 0.167\nc(2,2) = 6/12 = 0.5\nAll others = 0.',
        modelAnswerFormulas: [
          'C = \\frac{1}{12}\\begin{bmatrix} 2 & 2 & 0 \\\\ 0 & 2 & 0 \\\\ 0 & 0 & 6 \\end{bmatrix} \\approx \\begin{bmatrix} 0.167 & 0.167 & 0 \\\\ 0 & 0.167 & 0 \\\\ 0 & 0 & 0.5 \\end{bmatrix}',
        ],
      },
      {
        label: 'c',
        question: 'Compute the contrast: $\\text{Contrast} = \\sum_i \\sum_j (i-j)^2 c_{ij}$. Interpret the result.',
        marks: 3,
        modelAnswer: 'Contrast = sum of (i-j)² × c(i,j) for all non-zero entries:\n\n(0,0): (0-0)²×0.167 = 0\n(0,1): (0-1)²×0.167 = 0.167\n(1,1): (1-1)²×0.167 = 0\n(2,2): (2-2)²×0.5 = 0\n\nContrast = 0 + 0.167 + 0 + 0 = 0.167\n\nThe contrast is low, which makes sense because the image has large uniform regions — most neighboring pixels have the same gray level, indicating a smooth texture with low local variation.',
        modelAnswerFormulas: [
          '\\text{Contrast} = (0-1)^2 \\times 0.167 = 0.167',
        ],
      },
    ],
  },
];

// --- Randomization helpers ---

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function groupBy<T>(arr: T[], key: (item: T) => number): Record<number, T[]> {
  const map: Record<number, T[]> = {};
  arr.forEach((item) => {
    const k = key(item);
    if (!map[k]) map[k] = [];
    map[k].push(item);
  });
  return map;
}

export function generateExam() {
  // MC: 1 per chapter (10 chapters), shuffled
  const mcByChapter = groupBy(mcQuestions, (q) => q.chapter);
  const selectedMC = shuffle(
    Object.values(mcByChapter).map((qs) => shuffle(qs)[0])
  );

  // SA: shuffle all, take 2
  const selectedSA = shuffle(shortAnswerQuestions).slice(0, 2);

  // Long: shuffle all, take 1
  const selectedLong = shuffle(longAnswerQuestions)[0];

  // Calc: shuffle all, take 1
  const selectedCalc = shuffle(calculationQuestions)[0];

  return { selectedMC, selectedSA, selectedLong, selectedCalc };
}
