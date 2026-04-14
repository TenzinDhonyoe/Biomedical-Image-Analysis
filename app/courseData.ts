export interface Topic {
  title: string;
  content: string;
  formulas?: string[];
  examTip?: string;
}

export interface FlashCard {
  question: string;
  answer: string;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  topics: Topic[];
  flashcards: FlashCard[];
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "Introduction to Medical Image Analysis",
    subtitle: "Modalities, Image Construction & Basic Definitions",
    topics: [
      {
        title: "What is a Medical Image?",
        content:
          "A geometric distribution of a certain physical/physiological property. A digital image is defined as I = f(x,y) where I is intensity, (x,y) is position. When both are finite and discrete, it becomes a digital image. Pixels (2D) and Voxels (3D) are the fundamental elements. Each medical image signal comes from a 3D slice of the body.",
      },
      {
        title: "Image Construction",
        content:
          "Goal: Draw images of a physical property of subject anatomy non-invasively. Two geometry types: Projection (maps 3D line to a single point -- cheaper, faster, loses depth info) and Tomography (cross-section imaging -- preserves spatial info, e.g. CT slices of ~1mm, PET ~5mm).",
      },
      {
        title: "Image Modalities",
        content:
          "X-Ray/CT: Absorption coefficient (mu), I_T = I_0 * e^(-muL), good resolution (<mm), good for hard tissue (bones), hazardous radiation.\n\nMRI: Spin density and relaxation times (T1, T2, PD), multichannel, excellent soft tissue contrast, no radiation hazard.\n\nUltrasound: Reflection of sound waves (3-30 MHz in medical), x=ct, low hazard, bad SNR, can't see behind bone/air.\n\nPET/SPECT: Radioactive annihilation, source inside body (injection/inhalation), functional/metabolic imaging, low resolution, low SNR.\n\nEIT: Electrical conductance imaging.",
      },
      {
        title: "Image Categories",
        content:
          "By Channel: Single channel (CT, PET, US) vs. Multichannel (MRI -- PD, T1, T2).\nBy Characteristic: Anatomical/Static (CT, X-ray -- skeleton structure) vs. Physiological/Functional (fMRI, 4D flow MRI -- metabolism, blood flow).\nBy Geometry: Projective (conventional radiography) vs. Tomographic (CT).\nBy Dimensionality: 2D or 3D (multi-2D reconstructing 3D).",
      },
      {
        title: "Pre-Processing vs Post-Processing",
        content:
          "Pre-processing: Raw data (signal) to image -- protocol design, image reconstruction, noise reduction in raw data space.\n\nPost-processing (this course's focus): Noise reduction in image space, contrast enhancement, image segmentation, Computer Aided Diagnosis (CAD), multimodality fusion, virtual surgery.",
      },
      {
        title: "Basic Concepts",
        content:
          "Frequency in 2D: Gray level changes in any direction.\nSampling: Nyquist theorem -- sampling rate must be > 2x the maximum frequency (Nyquist frequency) to uniquely reconstruct the signal.\nMatrix representation: Image as M x N matrix, origin at top-left, x = rows, y = columns.",
        formulas: [
          "I = f(x,y)",
          "I_T = I_0 e^{-\\mu L}",
          "x = ct",
          "\\Omega_S > 2\\Omega_N",
        ],
        examTip: "Know the Nyquist theorem cold. If asked about aliasing, it means the sampling rate was below 2x the max frequency.",
      },
    ],
    flashcards: [
      {
        question: "What is the mathematical definition of a digital image?",
        answer:
          "I = f(x,y) where I is intensity (or color), (x,y) is position. When both (x,y) and I are finite and discrete quantities, it's a digital image.",
      },
      {
        question: "What is the difference between a pixel and a voxel?",
        answer:
          "A pixel is the smallest area dedicated to a light intensity in a 2D image (picture element). A voxel is the 3D equivalent -- each medical image signal comes from a 3D slice of the body.",
      },
      {
        question:
          "What is the difference between Projection and Tomography imaging?",
        answer:
          "Projection: Maps a 3D line to a single point (e.g., X-ray). Cheaper and faster but loses depth/geometry info. Tomography: Images a cross-section of the object (e.g., CT). Preserves spatial information with a defined slice thickness.",
      },
      {
        question: "List 3 properties of X-Ray/CT imaging.",
        answer:
          "1) Uses absorption coefficient (mu) of X-ray photons (70-120 keV). 2) Very good resolution (below mm). 3) Good contrast for hard tissue (bones) but low contrast for soft tissue. Also: hazardous radiation, good SNR.",
      },
      {
        question: "Why is MRI considered multichannel?",
        answer:
          "MRI can acquire more than one property: Proton Density (PD -- how much water), T1 relaxation time, and T2 relaxation time. Each gives different tissue contrast from the same scan.",
      },
      {
        question: "What is the Nyquist sampling theorem?",
        answer:
          "If a signal is band-limited with max frequency Omega_N, the signal can be uniquely reconstructed if the sampling rate Omega_S > 2*Omega_N. Omega_N is the Nyquist frequency, Omega_S is the Nyquist rate.",
      },
      {
        question:
          "What are Anatomical vs. Functional imaging modalities? Give examples.",
        answer:
          "Anatomical: Static distribution of a physical property (structure). Examples: CT, X-ray, MRI.\nFunctional: Shows functionality or metabolism. Examples: PET, fMRI, SPECT, 4D flow MRI.",
      },
      {
        question: "What are the limitations of Ultrasound imaging?",
        answer:
          "Low/bad SNR, average resolution (different in two dimensions), cannot see behind bone and air (lung), needs access from only one side (reflection-based), not for metabolism imaging.",
      },
    ],
  },
  {
    id: 2,
    title: "Introduction to Medical Image Analysis (Part 2)",
    subtitle: "Digital Image Fundamentals & Sampling",
    topics: [
      {
        title: "Matrix Representation",
        content:
          "An image is represented as an M x N matrix. Origin at top-left corner. x-axis goes down (rows), y-axis goes right (columns). Each element f(x,y) holds the pixel intensity value.",
      },
      {
        title: "Sampling & Quantization",
        content:
          "Sampling: Converting continuous spatial coordinates to discrete. Quantization: Converting continuous intensity values to discrete levels (e.g., 8-bit = 256 gray levels, 0 to L-1 where L=256). More bits = finer gray level detail but more storage.",
      },
      {
        title: "Spatial Resolution",
        content:
          "Determined by sampling density. Higher sampling = more pixels = better spatial detail. The smallest discernible detail in an image. Measured in pixels per unit distance or line pairs per mm.",
      },
      {
        title: "Gray Level Resolution",
        content:
          "Determined by number of quantization levels. More bits per pixel = more gray levels = smoother intensity transitions. 8-bit is standard for medical images (256 levels), but CT can use 12-16 bits.",
      },
    ],
    flashcards: [
      {
        question:
          "How is the coordinate system oriented in digital image representation?",
        answer:
          "Origin at top-left. x-axis points downward (rows), y-axis points rightward (columns). This is like matrix notation, not standard math coordinates.",
      },
      {
        question: "What is the difference between sampling and quantization?",
        answer:
          "Sampling: Discretizing spatial coordinates (how many pixels). Quantization: Discretizing intensity values (how many gray levels). Both affect image quality.",
      },
      {
        question: "How many gray levels does an 8-bit image have?",
        answer:
          "2^8 = 256 gray levels, ranging from 0 (black) to 255 (white). This is the standard for most digital images.",
      },
    ],
  },
  {
    id: 3,
    title: "Image Enhancement - Spatial Domain",
    subtitle: "Point Operations, Histograms & Spatial Filtering",
    topics: [
      {
        title: "Spatial Domain Processing",
        content:
          "General form: g(x,y) = T(f(x,y)). T operates on the image f. Can be based on a single pixel (1x1 neighborhood -- point process) or a window (w x w neighborhood -- filtering/mask/kernel).",
      },
      {
        title: "Point Operations (1x1 Neighborhood)",
        content:
          "s = T(r) where r is input gray level, s is output.\n\nImage Negative: s = L-1-r (inverts intensities, useful for mammograms).\n\nLog Transform: s = c*log(1+r). Expands dark values, compresses bright. 'c' is a scale coefficient. '+1' avoids log(0). Good for displaying Fourier spectra.\n\nPower-Law (Gamma): s = c*r^gamma. gamma < 1 brightens dark regions; gamma > 1 darkens bright regions. 'c' scales back to [0, 255].\n\nContrast Stretching: Custom piecewise function to expand a specific intensity range. At extreme: thresholding (binary output).\n\nGray Level Slicing: Highlight a range [A,B] of gray levels. Two types: (a) highlight range, reduce all others to constant; (b) highlight range, preserve all others.",
        formulas: [
          "g(x,y) = T(f(x,y))",
          "s = L - 1 - r",
          "s = c \\log(1 + r)",
          "s = c \\cdot r^{\\gamma}",
        ],
      },
      {
        title: "Histogram Processing",
        content:
          "Histogram h(r_k) = n_k counts pixels at each gray level. Normalized: p(r_k) = n_k / (M*N).\n\nHistograms reveal: Dark image (values clustered left), Bright image (clustered right), Low contrast (narrow cluster), High contrast (wide spread). A uniform distribution generally gives better contrast.\n\nNote: Histogram is not unique -- randomly shuffling pixel positions changes the image but keeps the same histogram.",
        formulas: [
          "h(r_k) = n_k, \\quad r_k \\in [0, L-1]",
          "p(r_k) = \\frac{n_k}{M \\times N}",
        ],
      },
      {
        title: "Histogram Equalization",
        content:
          "Goal: Transform so output has approximately uniform histogram (better contrast).\n\nRequirements for T(r): T(0)=0, T(1)=1, T(r)>=0, T'(r)>=0 (monotonically increasing).\n\nContinuous: s = T(r) = integral from 0 to r of p(w)dw => CDF. Result is uniform distribution.\n\nDiscrete: S_k = T(r_k) = sum from j=0 to k of (n_j/n). Then round: S_hat_k = Int[(S_k - S_min)/(1 - S_min) * (L-1) + 0.5].\n\nNote: Result is never perfectly uniform due to rounding and using a continuous formula for a quantized problem. Also, in MATLAB, 0 may not map to 0.",
        formulas: [
          "s = T(r) = \\int_0^r p_r(w)\\,dw \\Rightarrow P_s(s) \\sim U(0,1)",
          "S_k = \\sum_{j=0}^{k} \\frac{n_j}{n}",
          "\\hat{S}_k = \\text{Int}\\left[\\frac{S_k - S_k^{\\min}}{1 - S_k^{\\min}}(L-1) + 0.5\\right]",
        ],
        examTip: "Histogram equalization is a CDF-based transform. Be able to compute S_k step by step given a small histogram. Remember: the result is never perfectly uniform because of rounding.",
      },
      {
        title: "Histogram Matching (Specification)",
        content:
          "When uniform is not ideal, we can target a specific desired histogram.\n\nMethod: First pass image through its own CDF (histogram equalization). Then apply inverse CDF of the desired histogram. The combined mapping transforms the original histogram toward the desired shape.",
      },
    ],
    flashcards: [
      {
        question: "What is the general form of spatial domain processing?",
        answer:
          "g(x,y) = T(f(x,y)). For 1x1 neighborhood (point process): s = T(r). For w x w neighborhood: filtering/convolution with a mask/kernel.",
      },
      {
        question:
          "When would you use a log transform vs. a power-law transform?",
        answer:
          "Log transform: s = c*log(1+r). Best for expanding dark pixel values and compressing bright ones (e.g., displaying Fourier spectra). Power-law: s = c*r^gamma. Gamma < 1 brightens darks (like log); gamma > 1 darkens brights. More flexible with the gamma parameter.",
      },
      {
        question: "What does histogram equalization do?",
        answer:
          "It transforms the image so the output histogram is approximately uniform, maximizing contrast. The transform function is the CDF of the input histogram. Discrete version: S_k = sum of p(r_j) for j=0 to k, then round to integer levels.",
      },
      {
        question:
          "Why is histogram equalization never perfectly uniform in practice?",
        answer:
          "Because we use a continuous formula (CDF) for a quantized/discrete problem. Rounding to integer gray levels causes some bins to merge. Also in some implementations, 0 may not map to 0.",
      },
      {
        question: "How does histogram matching (specification) work?",
        answer:
          "Step 1: Pass image through its own CDF (equalize to ~uniform). Step 2: Pass through the inverse CDF of the desired histogram distribution. This maps the original histogram toward the target shape.",
      },
      {
        question: "What does a histogram tell you about image quality?",
        answer:
          "Dark image: values clustered at low end. Bright: clustered at high end. Low contrast: narrow cluster in middle. High contrast: values spread widely across the full range. Generally, a uniform distribution gives better visual quality.",
      },
      {
        question: "What is gray level slicing?",
        answer:
          "Highlighting pixels in a specific intensity range [A, B]. Type (a): highlight the range, reduce everything else to a constant. Type (b): highlight the range, preserve all other levels unchanged.",
      },
    ],
  },
  {
    id: 4,
    title: "2D Signals and Systems",
    subtitle: "Fourier Transform, Convolution & Frequency Domain",
    topics: [
      {
        title: "2D Systems Properties",
        content:
          "General: g(x,y) = H[f(x,y)]. Key properties:\n\nLinearity: H[a*f1 + b*f2] = a*H[f1] + b*H[f2] (superposition).\n\nShift Invariant: If g(x,y) = H[f(x,y)], then g(x-x0, y-y0) = H[f(x-x0, y-y0)]. (2D analog of time-invariance; some optical systems like cameras are NOT shift invariant.)\n\nCausality: Not relevant in 2D -- we have all data at once (no 'time' dimension).\n\nStability: Same as 1D.",
      },
      {
        title: "Impulse Response & Convolution",
        content:
          "2D Unit Impulse (Pinhole): delta(x,y) = infinity at (0,0), 0 elsewhere, integral = 1.\n\nPoint Spread Function (PSF): H(x,y) = H[delta(x,y)] -- the system's response to a point input. Like pointing a laser at an optical system.\n\nFor Linear Shift Invariant (LSI) systems, output is convolution:\nf(x,y) * h(x,y) = integral of f(s,t)*h(x-s, y-t) ds dt.\n\nCorrelation: Similar but with (x+s, y+t) -- no flipping of h.\n\nWhy go to frequency domain? Convolution is computationally expensive in 2D. In frequency domain, convolution becomes multiplication.",
        formulas: [
          "f(x,y) \\star h(x,y) = \\int\\int f(s,t)\\,h(x-s, y-t)\\,ds\\,dt",
          "f(x,y) \\star h(x,y) \\Leftrightarrow F(u,v) \\cdot H(u,v)",
        ],
      },
      {
        title: "2D Discrete Fourier Transform (DFT)",
        content:
          "Forward: F(u,v) = (1/MN) * sum_m sum_n f(m,n) * exp(-j2pi(um/M + vn/N)).\n\nInverse: f(m,n) = sum_u sum_v F(u,v) * exp(+j2pi(um/M + vn/N)).\n\nF(u,v) is complex: has magnitude |F(u,v)| (spectrum) and phase angle phi(u,v). The 1/MN factor can go on either the forward or inverse transform.\n\nImportant properties: F(0,0) = average value of the image. DFT is periodic, separable (compute 1D transforms along rows then columns).",
        formulas: [
          "F(u,v) = \\frac{1}{MN}\\sum_{m=0}^{M-1}\\sum_{n=0}^{N-1} f(m,n)\\,e^{-j2\\pi\\left(\\frac{um}{M}+\\frac{vn}{N}\\right)}",
          "f(m,n) = \\sum_{u=0}^{M-1}\\sum_{v=0}^{N-1} F(u,v)\\,e^{+j2\\pi\\left(\\frac{um}{M}+\\frac{vn}{N}\\right)}",
        ],
      },
      {
        title: "FFT Shift & Centering",
        content:
          "The standard DFT places zero frequency at the corners. FFT Shift (fftshift in MATLAB) centers zero frequency in the middle by multiplying f(x,y) by (-1)^(x+y) before the transform.\n\nAfter centering: low frequencies are at the center, high frequencies at the corners. This makes the spectrum much easier to interpret visually.",
      },
      {
        title: "Phase Importance",
        content:
          "Most of the structural information in an image is in the PHASE, not the magnitude. Experiment: swap magnitude and phase between two images -- the result looks like whichever image contributed the phase.\n\nEven with noise magnitude + image phase, you can still recognize the image. Therefore: never manipulate the phase when filtering!",
      },
      {
        title: "Fourier Spectrum & Filtering",
        content:
          "Natural images have large magnitude at low frequencies (center after shift) and small at high frequencies (corners).\n\nRemoving high frequencies = blurring (lowpass filter). Removing low frequencies = edge detection (highpass filter).\n\nFrequency domain filtering pipeline: Input f(x,y) -> FFT -> F(u,v) -> Multiply by filter H(u,v) -> H(u,v)*F(u,v) -> Inverse FFT -> output g(x,y).\n\nKey FT pairs: Impulse <-> 1, Gaussian <-> Gaussian, Rectangle <-> Sinc.",
      },
      {
        title: "Important FT Properties",
        content:
          "Convolution theorem: f*h <-> F*H (spatial convolution = frequency multiplication).\nCorrelation theorem: f corr h <-> F* * H.\nDifferentiation: d/dx <-> (ju).\nLaplacian: nabla^2 f <-> -(u^2+v^2)*F.\nRotation: Rotating image by theta rotates spectrum by same theta.\nScaling: Shrinking in space = expanding in frequency.\nConjugate symmetry: |F(u,v)| = |F(-u,-v)| for real images.",
        formulas: [
          "f(x,y) \\star h(x,y) \\Leftrightarrow F(u,v) \\cdot H(u,v)",
          "\\nabla^2 f \\Leftrightarrow -(u^2 + v^2)F(u,v)",
          "f(x,y)(-1)^{x+y} \\Leftrightarrow F(u - M/2, v - N/2)",
        ],
        examTip: "Know the convolution theorem (spatial convolution = frequency multiplication) and that phase carries most structural info. These are the two most testable concepts from this chapter.",
      },
    ],
    flashcards: [
      {
        question:
          "Why do we care about frequency domain processing for images?",
        answer:
          "Because filtering in spatial domain requires convolution, which is computationally expensive in 2D. In frequency domain, convolution becomes simple multiplication: f*h <-> F*H. Filter, then inverse FFT back.",
      },
      {
        question:
          "Why is causality irrelevant in 2D image processing?",
        answer:
          "Causality means output depends only on past inputs. In 2D images, there is no 'time' -- you have all the data at once. So causality is not a meaningful constraint.",
      },
      {
        question:
          "What happens when you swap magnitude and phase between two images?",
        answer:
          "The reconstructed image looks like whichever image provided the PHASE. This shows most structural information is encoded in the phase, not the magnitude. Lesson: don't manipulate phase when filtering.",
      },
      {
        question: "What does F(0,0) represent?",
        answer:
          "F(0,0) is the DC component -- the average value of the entire image. F(0,0) = (1/MN) * sum of all pixel values.",
      },
      {
        question:
          "What does FFT shift do and why is it useful?",
        answer:
          "FFT shift centers the zero-frequency component in the middle of the spectrum (instead of corners). Done by multiplying f(x,y) by (-1)^(x+y). Makes the spectrum intuitive: low freq at center, high freq at edges.",
      },
      {
        question: "What is the convolution theorem?",
        answer:
          "Convolution in spatial domain equals multiplication in frequency domain: f(x,y)*h(x,y) <-> F(u,v)*H(u,v). And spatial multiplication corresponds to frequency convolution: f(x,y)*h(x,y) <-> F(u,v)*H(u,v).",
      },
      {
        question:
          "What is the effect of lowpass vs. highpass filtering?",
        answer:
          "Lowpass: Removes high frequencies -> blurs the image (smoothing, noise reduction). Highpass: Removes low frequencies -> keeps edges (edge detection, sharpening). The image goes dark because the DC/average component is removed.",
      },
      {
        question: "What is the Point Spread Function (PSF)?",
        answer:
          "The PSF is the impulse response of a 2D system: H(x,y) = H[delta(x,y)]. It describes how the system responds to a point input -- like pointing a laser at a lens system and seeing the spread/blur.",
      },
    ],
  },
  {
    id: 5,
    title: "Image Restoration",
    subtitle: "Degradation Models, Noise & Restoration Filters",
    topics: [
      {
        title: "Degradation/Restoration Model",
        content:
          "Model: g(x,y) = h(x,y) * f(x,y) + eta(x,y), where f = clean image, h = degradation function (e.g., blur from camera shake), eta = additive noise, g = observed/degraded image.\n\nIn frequency domain: G(u,v) = H(u,v)*F(u,v) + N(u,v).\n\nGoal: Design a restoration filter to get f-hat from g, assuming we know or can estimate H and noise statistics.",
        formulas: [
          "g(x,y) = h(x,y) \\star f(x,y) + \\eta(x,y)",
          "G(u,v) = H(u,v)F(u,v) + N(u,v)",
        ],
      },
      {
        title: "Noise Types",
        content:
          "Sources: Image acquisition (digitization) and transmission.\n\nSpatial properties: Statistical behavior of gray levels -- Is it Gaussian? Salt & pepper? Uniform?\n\nFrequency properties: Fourier spectrum of noise. White noise has constant/flat spectrum.\n\nAssumptions: Noise is additive, zero-mean, independent from the image (no correlation).\n\nTypes: Gaussian (most common), Rayleigh, Gamma, Exponential, Uniform, Salt & Pepper (impulse), Periodic (from electronic devices -- shows as impulses in frequency domain).\n\nWhen random variables are summed, their histograms are convolved.",
      },
      {
        title: "Noise Estimation",
        content:
          "From the imaging system: Capture images of a 'flat' environment (phantom -- e.g., cylinder filled with water for MRI).\n\nFrom noisy images: Take a strip from a constant/background area, draw the histogram, measure mean and variance.\n\nMedical artifacts: MRI Gibbs artifact (bad LPF), CT metal artifact (star pattern), MR motion artifact.",
      },
      {
        title: "Adaptive Local Noise Reduction",
        content:
          "For noise-only case: g(x,y) = f(x,y) + eta(x,y).\n\nAdaptive filter: f-hat(x,y) = g(x,y) - (sigma_eta^2 / sigma_L^2) * (g(x,y) - m_L).\n\nWhere sigma_eta^2 = noise variance (global), sigma_L^2 = local variance in window, m_L = local mean.\n\nBehavior: If sigma_eta^2 is small -> return g(x,y). If sigma_L^2 >> sigma_eta^2 (edge area) -> return close to g(x,y) (preserve edges). If sigma_L^2 ~ sigma_eta^2 (flat area) -> return local mean m_L (average out noise).",
        formulas: [
          "\\hat{f}(x,y) = g(x,y) - \\frac{\\sigma_\\eta^2}{\\sigma_L^2}\\left(g(x,y) - m_L\\right)",
        ],
      },
      {
        title: "Inverse Filtering",
        content:
          "Without noise: F-hat(u,v) = G(u,v)/H-hat(u,v). Problem: division by zero where H is zero.\n\nWith noise: F-hat(u,v) = F(u,v) + N(u,v)/H-hat(u,v). Even if H is known, wherever H is small, the noise term N/H gets amplified enormously. This makes inverse filtering impractical in most cases.",
        formulas: [
          "\\hat{F}(u,v) = \\frac{G(u,v)}{\\hat{H}(u,v)} = F(u,v) + \\frac{N(u,v)}{\\hat{H}(u,v)}",
        ],
        examTip: "Be able to explain WHY inverse filtering fails (N/H blows up) and why Wiener filter fixes it (adds S_n/S_f term to denominator). This is a common exam comparison question.",
      },
      {
        title: "Wiener Filter",
        content:
          "Optimal filter that minimizes mean square error between estimated and true image.\n\nF-hat(u,v) = [H*(u,v) / (|H(u,v)|^2 + S_n/S_f)] * G(u,v), where S_n = noise power spectrum, S_f = signal power spectrum.\n\nWhen SNR is high: acts like inverse filter. When SNR is low: suppresses noise. Often S_n/S_f is approximated as a constant K (tuning parameter).",
        formulas: [
          "\\hat{F}(u,v) = \\frac{H^*(u,v)}{|H(u,v)|^2 + S_n/S_f} \\cdot G(u,v)",
        ],
      },
      {
        title: "Degradation Estimation",
        content:
          "Three approaches:\n1) Observation: Look at the image directly.\n2) Experiment: Image a well-defined object (flat, pinhole/point source) -> get PSF.\n3) Modeling: Use physical knowledge to model the degradation (e.g., atmospheric turbulence: H(u,v) = exp(-k(u^2+v^2)^(5/6))).",
        formulas: [
          "H(u,v) = \\exp\\left(-k(u^2 + v^2)^{5/6}\\right)",
        ],
      },
    ],
    flashcards: [
      {
        question: "Write the image degradation model in both spatial and frequency domain.",
        answer:
          "Spatial: g(x,y) = h(x,y)*f(x,y) + eta(x,y). Frequency: G(u,v) = H(u,v)*F(u,v) + N(u,v). Where f = clean image, h = degradation, eta/N = noise, g/G = observed.",
      },
      {
        question: "Why does inverse filtering fail in practice?",
        answer:
          "F-hat = G/H = F + N/H. Wherever H(u,v) is small (near zero), the noise term N/H blows up, amplifying noise enormously. Division by zero is also possible. Even with known H, it's impractical.",
      },
      {
        question: "How does the adaptive local noise filter work?",
        answer:
          "f-hat = g - (sigma_eta^2/sigma_L^2)*(g - m_L). In flat areas (sigma_L ~ sigma_eta), it returns the local mean (smooths noise). At edges (sigma_L >> sigma_eta), the ratio is small, so it preserves the original value.",
      },
      {
        question: "What are the common assumptions about noise in image restoration?",
        answer:
          "Noise is additive (summed with image), zero-mean, independent from the image (no correlation), and identically distributed. In frequency domain: white noise has a constant/flat spectrum.",
      },
      {
        question: "What is the advantage of the Wiener filter over inverse filtering?",
        answer:
          "Wiener filter accounts for noise by balancing deconvolution with noise suppression. It minimizes mean square error. When SNR is high, it acts like inverse filter. When SNR is low, it suppresses noise instead of amplifying it.",
      },
      {
        question: "How can you estimate the degradation function H?",
        answer:
          "1) Observation: Look at the degraded image. 2) Experiment: Image a point source (impulse) to get the PSF directly. 3) Modeling: Use physics-based models (e.g., atmospheric turbulence model).",
      },
    ],
  },
  {
    id: 6,
    title: "Image Segmentation",
    subtitle: "Edge Detection, Thresholding & Hough Transform",
    topics: [
      {
        title: "Segmentation Overview",
        content:
          "Definition: Partitioning a digital image into multiple segments.\n\nTypes: Semantic segmentation (classify every pixel to a category, doesn't distinguish individual objects), Instance segmentation (identifies and separates individual countable objects with masks), Panoptic segmentation (combines both for complete scene understanding).",
      },
      {
        title: "Detection of Discontinuities",
        content:
          "Point detection: Laplacian-like operators (e.g., center = 8 or -4, surroundings = -1). Threshold: |R| >= T.\n\nLine detection: Gradient-based operators for specific directions (horizontal, +45, vertical, -45). Each mask has '2' values along the target direction and '-1' elsewhere. Decision: |R_i| >= |R_j| for all j.\n\nEdge detection: Most important -- find boundaries between regions.",
      },
      {
        title: "Edge Detection Fundamentals",
        content:
          "Edge models: Ideal edge (step function) and Ramp edge (gradual transition -- more realistic, slope proportional to blur).\n\nFirst derivative (gradient): Non-zero at edge, gives edge magnitude and direction.\nSecond derivative (Laplacian): Zero crossing at the edge location.\n\nNoise sensitivity: Second derivative is MUCH more sensitive to noise than first. Even small noise makes second derivative nearly useless without smoothing.",
      },
      {
        title: "Gradient Operators",
        content:
          "Gradient: nabla f = [Gx, Gy] = [df/dx, df/dy].\nMagnitude: |nabla f| = sqrt(Gx^2 + Gy^2) ~ |Gx| + |Gy| (approximation, easier to compute).\nDirection: alpha = arctan(Gy/Gx).\n\nRoberts Cross: 2x2 diagonal operators. Gx = z9-z5, Gy = z8-z6.\n\nPrewitt: 3x3 operators. Gx = (z7+z8+z9) - (z1+z2+z3).\n\nSobel: Like Prewitt but with weight 2 on center: Gx = (z7+2z8+z9) - (z1+2z2+z3).\n\nDiagonal versions exist for 45 and -45 degree edges.\n\nPre-smoothing helps reduce noise before edge detection. For linear systems, order doesn't matter (smooth then detect = detect then smooth).",
        formulas: [
          "\\nabla f = \\begin{bmatrix} G_x \\\\ G_y \\end{bmatrix} = \\begin{bmatrix} \\partial f/\\partial x \\\\ \\partial f/\\partial y \\end{bmatrix}",
          "|\\nabla f| \\approx |G_x| + |G_y|",
          "\\alpha(x,y) = \\tan^{-1}\\left(\\frac{G_y}{G_x}\\right)",
        ],
      },
      {
        title: "Laplacian & LoG",
        content:
          "Laplacian: nabla^2 f = d^2f/dx^2 + d^2f/dy^2. Isotropic (same response in all directions).\n\n4-neighbor: kernel [0,-1,0; -1,4,-1; 0,-1,0]. 8-neighbor: [-1,-1,-1; -1,8,-1; -1,-1,-1].\n\nProblem: Very sensitive to noise.\n\nSolution -- Laplacian of Gaussian (LoG): First smooth with Gaussian, then apply Laplacian. The combined filter looks like a 'Mexican hat'. Find edges at zero crossings.\n\nZero crossing detection: Check pairs of neighbors -- if >= 50% of pairs have different signs, it's a zero crossing. Can add thresholding first for robustness.",
        formulas: [
          "\\nabla^2 f = \\frac{\\partial^2 f}{\\partial x^2} + \\frac{\\partial^2 f}{\\partial y^2}",
          "\\nabla^2 h(r) = -\\left[\\frac{r^2 - \\sigma^2}{\\sigma^4}\\right]\\exp\\left(-\\frac{r^2}{2\\sigma^2}\\right)",
        ],
        examTip: "LoG combines smoothing + edge detection. Know the 5x5 mask approximation and that edges are found at zero crossings. Also know the difference between Sobel/Prewitt/Roberts operators.",
      },
      {
        title: "Hough Transform",
        content:
          "For global edge linking. Transforms points in image space to curves in parameter space.\n\nFor lines (y = ax + b): Each point (xi, yi) defines a line b = -xi*a + yi in (a,b) parameter space. Points on the same line in image space intersect at the same (a,b) in parameter space.\n\nAccumulator array: Discretize parameter space, vote for each cell. Peak in accumulator = detected line.\n\nFor circles and other parametric curves: Same principle with more parameters.\n\nAfter edge detection and thresholding, you have a binary edge map. Hough transform finds which edges form meaningful lines/curves.",
      },
      {
        title: "Thresholding",
        content:
          "Global thresholding: Single threshold T applied to entire image. Pixels > T = object, else background. Good when histogram is bimodal.\n\nOtsu's method: Automatically finds optimal threshold by maximizing between-class variance.\n\nAdaptive/Local thresholding: Different thresholds for different image regions. Used when illumination varies.\n\nMultiple thresholding: Multiple thresholds for multiple classes.",
      },
    ],
    flashcards: [
      {
        question: "What is the difference between first and second derivative for edge detection?",
        answer:
          "First derivative (gradient): Non-zero along the edge, gives magnitude and direction. Second derivative (Laplacian): Has zero crossing at the edge. However, second derivative is MUCH more sensitive to noise.",
      },
      {
        question: "What are the Sobel operator kernels for x and y directions?",
        answer:
          "Sobel x (vertical edges): [-1,0,1; -2,0,2; -1,0,1]. Sobel y (horizontal edges): [-1,-2,-1; 0,0,0; 1,2,1]. Like Prewitt but with weight 2 on the center element of each row/column.",
      },
      {
        question: "Why do we use LoG instead of just the Laplacian?",
        answer:
          "Laplacian alone is extremely sensitive to noise -- it amplifies noise. LoG first smooths with a Gaussian (removes noise) then applies Laplacian. The combined filter (Mexican hat shape) finds edges at zero crossings while being noise-robust.",
      },
      {
        question: "How does the Hough Transform detect lines?",
        answer:
          "Each edge point (xi,yi) maps to a line b = -xi*a + yi in parameter space (a,b). Points that are collinear in image space produce lines that intersect at the same (a,b). An accumulator array counts votes; peaks correspond to detected lines.",
      },
      {
        question: "What is Otsu's thresholding method?",
        answer:
          "An automatic method that finds the optimal global threshold by maximizing the between-class variance (equivalently, minimizing within-class variance). It assumes the histogram is bimodal and finds the best split point.",
      },
      {
        question: "Does the order of smoothing and edge detection matter for linear operators?",
        answer:
          "No. For linear systems, H1*H2 = H2*H1. You can smooth then detect edges, or detect then smooth, or combine filters into one -- all give the same result.",
      },
    ],
  },
  {
    id: 7,
    title: "Morphological Tools",
    subtitle: "Dilation, Erosion, Opening & Closing",
    topics: [
      {
        title: "Morphological Image Processing Overview",
        content:
          "Morphology = study of form, structure, and configuration of objects. Unlike previous chapters that manipulated gray levels, morphology focuses on geometry/shape.\n\nUsed to extract image components for representation and description: boundaries, skeletons, convex hulls, morphological filtering, thinning, pruning.\n\nAssumes binary images (0 or 1) -- typically after segmentation. Objects are represented as sets in Z^2 (coordinates of pixels belonging to the object).",
      },
      {
        title: "Preliminaries",
        content:
          "Set A in Z^2 with elements a = (a1, a2).\n\nReflection: B-hat = {w | w = -b, for b in B} -- mirror through origin.\n\nTranslation: (A)_z = {c | c = a + z, for a in A} -- shift all points by z.\n\nReference point: Needed for structuring element position.",
      },
      {
        title: "Dilation",
        content:
          "A dilation B = {z | (B-hat)_z intersect A != empty} = {z | (B-hat)_z intersect A is subset of A}.\n\nSet B is the structuring element (not called a filter here).\n\nRelation to convolution: involves flipping and overlapping.\n\nEffect: GROWS/EXPANDS the object. Fills holes and gaps, connects nearby regions, thickens boundaries.\n\nProblem: Dilates everywhere -- makes the entire object larger.",
        formulas: [
          "A \\oplus B = \\{z \\mid (\\hat{B})_z \\cap A \\neq \\emptyset\\}",
        ],
      },
      {
        title: "Erosion",
        content:
          "A erosion B = {z | (B)_z is subset of A}.\n\nThe structuring element must fit entirely inside the object.\n\nEffect: SHRINKS/REDUCES the object. Removes small details, separates touching objects, thins boundaries.\n\nNote: The result can be nothing (empty set) if the structuring element is larger than the object. So erosion is sometimes NOT reversible.",
        formulas: [
          "A \\ominus B = \\{z \\mid (B)_z \\subseteq A\\}",
        ],
      },
      {
        title: "Opening and Closing",
        content:
          "Opening: A circle B = (A erosion B) dilation B. Erosion followed by dilation with SAME structuring element.\nEffect: Smooths contours, breaks narrow connections (isthmuses), removes thin protrusions.\n\nClosing: A bullet B = (A dilation B) erosion B. Dilation followed by erosion with SAME structuring element.\nEffect: Smooths contours, fuses narrow breaks, fills small holes and gaps.\n\nKey properties:\n- Both are idempotent: (A circle B) circle B = A circle B. Applying multiple times has no additional effect.\n- Opening always shrinks or maintains size. Closing always grows or maintains size.\n\nNoise reduction example (fingerprint): Opening removes noise spurs, then closing of the opening fills remaining gaps. Result: clean boundaries.",
        formulas: [
          "A \\circ B = (A \\ominus B) \\oplus B",
          "A \\bullet B = (A \\oplus B) \\ominus B",
        ],
        examTip: "Opening = erosion then dilation (removes small protrusions). Closing = dilation then erosion (fills small holes). Both are idempotent. Know which to use for noise removal on binary images.",
      },
    ],
    flashcards: [
      {
        question: "What is the fundamental difference between morphological processing and previous image processing?",
        answer:
          "Previous chapters manipulated gray levels (intensity values). Morphological processing focuses on geometry/shape of objects, typically on binary images after segmentation. It uses set theory operations.",
      },
      {
        question: "What does dilation do and what is its formula?",
        answer:
          "Dilation: A+B = {z | (B-hat)_z intersect A is non-empty}. It GROWS/EXPANDS objects, fills holes, connects nearby regions, thickens boundaries. Problem: it dilates everywhere, not just where needed.",
      },
      {
        question: "What does erosion do and when can it fail?",
        answer:
          "Erosion: A-B = {z | (B)_z subset of A}. It SHRINKS objects, removes small details, separates touching objects. It can fail (give empty set) if the structuring element is larger than the object -- not always reversible.",
      },
      {
        question: "What is opening and what does it do to shapes?",
        answer:
          "Opening = erosion then dilation with same SE: A o B = (A-B)+B. Smooths contours from outside, breaks narrow connections, removes thin protrusions. It can only shrink or maintain size, never grow.",
      },
      {
        question: "What is closing and what does it do to shapes?",
        answer:
          "Closing = dilation then erosion with same SE: A . B = (A+B)-B. Smooths contours from inside, fuses narrow breaks, fills small holes. It can only grow or maintain size, never shrink.",
      },
      {
        question: "What does idempotent mean for opening and closing?",
        answer:
          "Applying the operation multiple times gives the same result as applying it once: (A o B) o B = A o B, and (A . B) . B = A . B. After one application, the shape is stable under that operation.",
      },
      {
        question: "How would you clean up a noisy binary fingerprint image?",
        answer:
          "Apply opening (erosion then dilation) to remove small noise spurs and disconnected pixels. Then apply closing (dilation then erosion) of the result to fill remaining small gaps and holes. The sequence: opening then closing of opening.",
      },
    ],
  },
  {
    id: 8,
    title: "Representation and Description",
    subtitle: "Chain Codes, Fourier Descriptors, Texture & GLCM",
    topics: [
      {
        title: "Representation vs. Description",
        content:
          "Representation: Convert segmented raw data into a usable format focusing on either boundary shape or internal region texture.\n\nDescription: Calculate quantitative features from the representation to enable object detection and classification.\n\nExample: Segmented tumor -> represent its contour -> extract features (numbers) -> feed to a classifier to decide benign vs. malignant.",
      },
      {
        title: "Chain Codes",
        content:
          "Rather than storing (x,y) coordinates of a boundary, store the direction to the next pixel.\n\n4-direction: 0=right, 1=up, 2=left, 3=down.\n8-direction: 0=right, 1=upper-right, ..., 7=lower-right.\n\nProblems: Long codes (solution: use coarser resolution), noise sensitivity (small noise fluctuates the chain).\n\nStart point normalization: Treat as circular sequence, rotate to find the minimum integer representation.\n\nFirst difference: Instead of absolute direction, record the change in direction (counter-clockwise). More rotation-invariant. E.g., 10103322 -> 3133030.",
      },
      {
        title: "Signatures (Parametric Curves)",
        content:
          "1D functional representation of a 2D boundary. Calculate distance from a central reference point as a function of angle: r(theta).\n\nCircle: r(theta) = constant. Square: periodic pattern.\n\nNot necessarily unique -- different shapes can have similar signatures depending on reference point choice.",
      },
      {
        title: "Boundary Descriptors",
        content:
          "Diameter: Diam(B) = max distance between any two boundary points. Leads to major axis and minor axis (perpendicular).\n\nBasic rectangle: Smallest enclosing rectangle aligned with major/minor axes.\n\nCurvature: Rate of change of tangent angle along the boundary.\n\nShape Number: Smallest integer formed by the first-difference chain code. Steps: 1) Make chain code, 2) Compute first difference code, 3) Rotate to find smallest integer. Order = number of chain code elements.",
      },
      {
        title: "Fourier Descriptors",
        content:
          "Treat boundary coordinates as a complex signal: s(k) = x(k) + j*y(k), k = 0,...,K-1.\n\nTake DFT: a(u) = (1/K) * sum s(k)*exp(-j2pi*uk/K).\n\nReconstruct with only first P terms: s-hat(k) = sum_{u=0}^{P-1} a(u)*exp(j2pi*uk/K).\n\nLow-frequency terms (first P): capture overall shape/structure. High-frequency terms: capture fine details/sharp edges/noise. So taking first P terms gives a compact shape representation.\n\nInvariance problem: Rotation multiplies a(u) by e^(j*theta) (doesn't change magnitude). Translation only affects a(0). Scaling multiplies by alpha. Starting point multiplies by e^(-j2pi*k0*u/K).\n\nSolution: Use normalized MAGNITUDE of Fourier descriptors -- invariant to rotation, translation, scaling, and starting point.",
        formulas: [
          "s(k) = x(k) + j\\,y(k)",
          "a(u) = \\frac{1}{K}\\sum_{k=0}^{K-1} s(k)\\,e^{-j2\\pi uk/K}",
        ],
      },
      {
        title: "Regional Descriptors",
        content:
          "Area: Number of pixels in the region.\nPerimeter: Length of boundary.\nCompactness: Perimeter^2 / Area -- not sensitive to scale, measures circularity.\nCircularity: Compare region's perimeter to that of a circle with same area.",
      },
      {
        title: "Texture: 1st Order Statistics",
        content:
          "From normalized histogram P(z_i) of the region.\n\nMean: m = sum(z_i * P(z_i)).\nVariance: sigma^2 = sum((z_i - m)^2 * P(z_i)).\nGray Level Contrast: R = 1 - 1/(1 + sigma^2).\nSkewness: mu_3 (asymmetry of distribution).\nKurtosis: mu_4 (flatness/peakedness).\nUniformity: sum(P(z_i)^2) -- high when one gray level dominates.\nEntropy: -sum(P(z_i)*log(P(z_i))) -- high when distribution is spread out.\n\nProblem: 1st order stats lack spatial information -- different images with same gray level counts have the same histogram.",
        formulas: [
          "R = 1 - \\frac{1}{1 + \\sigma_z^2}",
          "\\text{Entropy} = -\\sum P(z_i)\\log P(z_i)",
        ],
      },
      {
        title: "Texture: 2nd Order (GLCM)",
        content:
          "Grey Level Co-occurrence Matrix: Counts how many times gray level z_i occurs next to (as defined by a positioning operator P) gray level z_j.\n\nNeeds: A positioning operator (e.g., horizontal neighbor, diagonal). Normalized GLCM: C = A / sum(A).\n\nFeatures from GLCM:\n- Maximum probability: Max(c_ij) -- most frequent gray-level transition.\n- Contrast: sum(i-j)^k * c_ij (k=2). Measures local variation; high = many sharp changes.\n- Homogeneity (Inverse difference moment): sum(c_ij / ((i-j)^k + 1)). High for smooth, consistent texture.\n- Uniformity (Energy): sum(c_ij^2). High when few transitions dominate.\n- Entropy: -sum(c_ij * log(c_ij)). High when transitions are evenly spread (random texture).",
        formulas: [
          "\\text{Contrast} = \\sum_i\\sum_j (i-j)^2 c_{ij}",
          "\\text{Homogeneity} = \\sum_i\\sum_j \\frac{c_{ij}}{(i-j)^2 + 1}",
          "\\text{Entropy} = -\\sum_i\\sum_j c_{ij}\\log_2(c_{ij})",
        ],
        examTip: "GLCM is a very testable topic. Be able to construct a small GLCM from a given image and positioning operator, normalize it, and compute contrast/homogeneity/entropy from it.",
      },
    ],
    flashcards: [
      {
        question: "What is the difference between representation and description?",
        answer:
          "Representation: Convert segmented data into a usable format (boundary shape or internal texture). Description: Extract quantitative features (numbers) from the representation for classification or recognition.",
      },
      {
        question: "How do Fourier descriptors achieve rotation and scale invariance?",
        answer:
          "Rotation multiplies descriptors by e^(j*theta), scaling by alpha -- neither changes the magnitude. Translation only affects a(0). Starting point changes phase. Solution: use normalized MAGNITUDE of the descriptors.",
      },
      {
        question: "What is the GLCM and why is it better than a simple histogram for texture?",
        answer:
          "GLCM (Grey Level Co-occurrence Matrix) records how often gray level pairs occur as neighbors. Unlike 1st order histograms, it captures SPATIAL relationships between pixels, distinguishing textures that look very different but have the same histogram.",
      },
      {
        question: "What do the first P Fourier descriptor terms represent?",
        answer:
          "The first P (low-frequency) terms capture the overall/coarse shape structure. Higher terms capture fine details and sharp edges. a(0) is the DC component (centroid). a(1) ~ best circular approximation. Using few terms gives compact shape representation.",
      },
      {
        question: "What is compactness and why is it useful?",
        answer:
          "Compactness = Perimeter^2 / Area. It measures how circular a shape is (circle has minimum compactness). It's useful because it's not sensitive to scale -- doubling the size doesn't change the ratio.",
      },
      {
        question: "Name 3 features you can extract from a GLCM.",
        answer:
          "1) Contrast: sum((i-j)^2 * c_ij) -- measures local variation/sharp changes. 2) Homogeneity: sum(c_ij/((i-j)^2+1)) -- high for smooth texture. 3) Entropy: -sum(c_ij*log(c_ij)) -- high for random texture. Also: uniformity/energy, maximum probability.",
      },
    ],
  },
  {
    id: 9,
    title: "Wavelets and Multi-Resolution Processing",
    subtitle: "Image Pyramids, Subband Coding & Wavelet Denoising",
    topics: [
      {
        title: "Motivation",
        content:
          "Images are non-stationary -- different parts have different frequency characteristics (different local histograms). Fourier transform gives global frequency info but loses spatial localization.\n\nWavelets provide both frequency AND spatial information -- like using different size brushes for different features (Daubechies quote).\n\nDenoising: v = u + n (additive) or v = u*n (multiplicative). For multiplicative: take log to convert to additive, denoise, then exp back.\n\nTwo denoising domains: Spatial domain (work on image directly) vs. Transform domain (map to wavelet/Fourier domain, process, map back).",
      },
      {
        title: "Image Pyramids",
        content:
          "Gaussian Pyramid: Repeatedly low-pass filter and downsample by 2. Each level loses some detail but retains general structure. Used heavily in computer vision for feature extraction.\n\nLaplacian Pyramid: The prediction residual at each level (difference between original and upsampled-downsampled version). Contains the detail/edge information at each scale.\n\nEach pyramid level contains information about a specific frequency band.",
      },
      {
        title: "Subband Coding",
        content:
          "1D: Split signal into low-band (approximation, h0) and high-band (detail, h1) using filter bank. Downsample each by 2. Reconstruct using synthesis filters (g0, g1) and upsampling.\n\n2D: Apply 1D filters along rows first, then columns. Produces 4 sub-images:\n- A (LL): Approximation -- low-pass both directions\n- H (HL): Horizontal details -- high-pass rows, low-pass columns\n- V (LH): Vertical details -- low-pass rows, high-pass columns\n- D (HH): Diagonal details -- high-pass both directions\n\nCan reconstruct original exactly using the synthesis filter bank.",
      },
      {
        title: "Multi-Level Decomposition",
        content:
          "Repeat the subband coding on the Approximation (LL) sub-image at each level. At each level, the approximation is further split into A, H, V, D.\n\nHaar basis: The simplest wavelet family (averaging and differencing).\n\nFast Wavelet Transform (FWT): Efficient implementation using filter banks.\n\n2D FWT produces a characteristic decomposition layout: small approximation in top-left corner, surrounded by detail sub-bands at increasing scales.",
      },
      {
        title: "Wavelet Denoising",
        content:
          "Key insight: In wavelet domain, true edges produce large, significant coefficients, while noise produces many small, scattered coefficients.\n\nDenoising scheme:\n1) Compute DWT of noisy image: Y = W(X)\n2) Threshold the detail coefficients: Z = D(Y, lambda)\n3) Compute inverse DWT: S-hat = W^(-1)(Z)\n\nThresholding motivation: Small coefficients are dominated by noise, large ones by signal. Replace small coefficients with zero.\n\nAssumptions: Wavelet de-correlating property produces sparse signal representation. Noise spreads equally across all coefficients. Noise level is not too high.",
      },
      {
        title: "Wavelet Applications",
        content:
          "Edge detection: Zero out the approximation (A) coefficient, keep detail coefficients, then synthesize -> edges only.\n\nNoise reduction: Threshold small detail coefficients, keep approximation, synthesize -> denoised image.\n\nWavelet Packet Analysis: Instead of only decomposing the approximation, also decompose the detail subbands. Gives a full binary tree of frequency bands. More flexibility in choosing which bands to analyze.",
      },
    ],
    flashcards: [
      {
        question: "Why are wavelets better than Fourier for image processing?",
        answer:
          "Fourier gives global frequency info but loses spatial location. Wavelets provide BOTH frequency AND spatial information -- they can tell you what frequencies exist AND where they are in the image. Images are non-stationary, so this spatial-frequency localization is critical.",
      },
      {
        question: "What are the 4 sub-images produced by 2D wavelet decomposition?",
        answer:
          "A (LL): Approximation -- smooth/low-freq version. H (HL): Horizontal edges. V (LH): Vertical edges. D (HH): Diagonal edges/details. Produced by applying low/high pass filters along rows then columns.",
      },
      {
        question: "How does wavelet denoising work?",
        answer:
          "1) Apply wavelet transform. 2) Threshold detail coefficients (set small ones to zero -- they're mostly noise). 3) Inverse wavelet transform to reconstruct. Works because signal produces few large coefficients while noise spreads as many small coefficients.",
      },
      {
        question: "What is the difference between Gaussian and Laplacian pyramids?",
        answer:
          "Gaussian pyramid: Repeated low-pass filtering + downsampling. Each level is a blurrier, smaller version. Laplacian pyramid: The residual/error between levels (detail lost at each step). Contains edge information at each scale.",
      },
      {
        question: "What is wavelet packet analysis?",
        answer:
          "Standard wavelets only decompose the approximation (LL) band at each level. Wavelet packets also decompose the detail bands (HL, LH, HH), creating a full binary tree of frequency sub-bands. Gives more flexibility in choosing which frequency bands to analyze.",
      },
      {
        question: "How do you handle multiplicative noise with wavelets?",
        answer:
          "Take the log of the image (converts v = u*n to log(v) = log(u) + log(n) -- now additive noise). Apply denoising to log domain. Then apply exp() to return to original domain. This is called homomorphic processing.",
      },
    ],
  },
  {
    id: 10,
    title: "Image Registration",
    subtitle: "Alignment, Transformation & Optimization",
    topics: [
      {
        title: "Why Registration?",
        content:
          "Medical image integration is needed because: too many data for conventional diagnosis, data dependency (multiple information from a single slice), physical requirements (stereotactic surgery).\n\nRegistration: Bring modalities into spatial alignment (geometry only, don't change gray levels).\nFusion: Integrated display of aligned data (e.g., CT + MRI combined).\n\nVocabulary: Warping, co-registration, matching, alignment, normalization, morphing.",
      },
      {
        title: "Registration Definition",
        content:
          "A mathematical mapping that relates positions of corresponding structures in two images.\n\nCorrespondence: Exact (point by point) or Non-exact (structure by structure).\n\nTwo images: Source/Head (being transformed) and Destination/Target/Hat (the fixed reference).\n\nExamples: Mapping a brain from one subject to a standard template, or comparing the same patient at two time points, or overlaying CT and MRI of the same patient.",
      },
      {
        title: "Mathematical Formulation",
        content:
          "Source image I_S(x1,x2), Destination image I_D(x1,x2).\n\nSeek mapping T = (T_x1, T_x2): S -> D that maps features of source to corresponding features in destination.\n\nOptimization: (T1, T2) = argmin sum sum [I_D(x1,x2) - I_S(T1(x1,x2), T2(x1,x2))]^2.\n\nWe want to find T that tells every pixel in the source where it needs to move to land on the correct spot in the destination.",
        formulas: [
          "(T_1, T_2) = \\arg\\min_{T_1, T_2} \\sum_{x_1}\\sum_{x_2} \\left[I_D(x_1,x_2) - I_S(T_1, T_2)\\right]^2",
        ],
      },
      {
        title: "Classification of Methods",
        content:
          "Nine criteria for classifying registration methods:\n\n1) Dimensionality: 2D-2D, 2D-3D, 3D-3D (spatial and temporal)\n2) Nature of registration basis: What features are used (landmarks, surfaces, voxel intensities)\n3) Nature of transformation: Rigid, affine, deformable\n4) Domain of transformation: Global vs. local\n5) Interaction: Automatic, semi-automatic, manual\n6) Optimization procedure: How to find the best transform\n7) Modalities involved: Mono-modal vs. multi-modal\n8) Subject: Intra-subject vs. inter-subject vs. atlas\n9) Object: What organ/anatomy",
      },
      {
        title: "Transformation Types",
        content:
          "Rigid: Translation + Rotation only (6 DOF in 3D). Preserves distances and angles.\n\nAffine: Rigid + Scaling + Shearing (12 DOF in 3D). Preserves parallelism.\n\nDeformable/Non-rigid: Local deformations, each point can move independently. Used for inter-subject registration where anatomy differs. Examples: Thin-plate splines, B-splines, fluid registration.",
      },
      {
        title: "Applications of Registration",
        content:
          "Image segmentation using deformable atlases, characterization of normal vs. abnormal shape, multi-modality fusion (CT+PET, MRI+SPECT), functional brain mapping, surgical planning and evaluation, image-guided surgery, pre-surgical simulation, GIS and other fields.",
      },
    ],
    flashcards: [
      {
        question: "What is the difference between registration and fusion?",
        answer:
          "Registration: Bring images into spatial alignment (only change geometry, not gray levels). Fusion: Combined display of the aligned data (e.g., overlaying functional PET data on anatomical CT). Fusion needs registration first.",
      },
      {
        question: "What are the three main types of geometric transformation?",
        answer:
          "Rigid: Translation + Rotation (preserves distances). Affine: + Scaling + Shearing (preserves parallelism). Deformable/Non-rigid: Each point can move independently (for inter-subject anatomy differences).",
      },
      {
        question: "What is the optimization objective in image registration?",
        answer:
          "Find mapping T = (T1, T2) that minimizes the sum of squared differences between destination image and the transformed source: argmin sum[I_D(x) - I_S(T(x))]^2. T tells each source pixel where to land in the destination.",
      },
      {
        question: "Name 3 applications of image registration in medicine.",
        answer:
          "1) Multi-modality fusion (CT + MRI overlay). 2) Tracking disease progression (same patient at different times). 3) Atlas-based segmentation (mapping a template brain to individual patients). Also: surgical planning, functional brain mapping.",
      },
      {
        question: "What is the difference between landmarks and intensity-based registration?",
        answer:
          "Landmark-based: Select corresponding point pairs manually or automatically, find transform that maps them. Intensity-based: Use all pixel/voxel values, optimize a similarity measure (e.g., sum of squared differences, mutual information) over the entire image.",
      },
      {
        question: "What is Source-Target terminology in registration?",
        answer:
          "Source (Head): The image being transformed/warped. Target (Hat/Destination): The fixed reference image that stays in place. The mapping T moves source pixels to align with the target.",
      },
    ],
  },
];
