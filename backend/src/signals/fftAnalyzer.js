/**
 * Fast Fourier Transform (FFT) Vibration Spectral Analyzer
 * Implements Cooley-Tukey Radix-2 FFT, windowing functions, and bearing defect
 * frequency anomaly detection (BPFO, BPFI, BSF, FTF, Unbalance, Misalignment)
 * following ISO 10816 and ISO 13373 standards.
 */

export const VIBRATION_SEVERITY = {
  NORMAL: 'NORMAL',
  WATCH: 'WATCH',
  ALARM: 'ALARM',
  CRITICAL: 'CRITICAL'
};

export const BEARING_DEFECT_TYPES = {
  UNBALANCE: 'UNBALANCE_1X',
  MISALIGNMENT: 'MISALIGNMENT_2X',
  BPFO: 'BPFO_BALL_PASS_OUTER_RACE',
  BPFI: 'BPFI_BALL_PASS_INNER_RACE',
  BSF: 'BSF_BALL_SPIN_FREQUENCY',
  FTF: 'FTF_CAGE_FREQUENCY'
};

/**
 * Apply Hanning window function to reduce spectral leakage
 */
export function applyHanningWindow(signal) {
  const N = signal.length;
  const windowed = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    const factor = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (N - 1)));
    windowed[i] = signal[i] * factor;
  }
  return windowed;
}

/**
 * Cooley-Tukey Radix-2 Decimation-in-Time Fast Fourier Transform (FFT)
 * Requires length N to be a power of 2.
 * @param {Float64Array|Array<number>} real - Input time-domain real amplitudes
 * @returns {{ real: Float64Array, imag: Float64Array }} Complex frequency components
 */
export function cooleyTukeyFFT(realInput) {
  const N = realInput.length;
  if ((N & (N - 1)) !== 0) {
    throw new Error(`FFT input length must be a power of 2, received ${N}`);
  }

  const real = new Float64Array(realInput);
  const imag = new Float64Array(N);

  // Bit-reversal permutation
  let j = 0;
  for (let i = 0; i < N - 1; i++) {
    if (i < j) {
      const tempR = real[i];
      real[i] = real[j];
      real[j] = tempR;

      const tempI = imag[i];
      imag[i] = imag[j];
      imag[j] = tempI;
    }
    let k = N >> 1;
    while (k <= j) {
      j -= k;
      k >>= 1;
    }
    j += k;
  }

  // Butterfly computations
  for (let len = 2; len <= N; len <<= 1) {
    const halfLen = len >> 1;
    const angle = (-2 * Math.PI) / len;
    const wStepR = Math.cos(angle);
    const wStepI = Math.sin(angle);

    for (let i = 0; i < N; i += len) {
      let wR = 1.0;
      let wI = 0.0;

      for (let k = 0; k < halfLen; k++) {
        const uR = real[i + k];
        const uI = imag[i + k];

        const vR = real[i + k + halfLen] * wR - imag[i + k + halfLen] * wI;
        const vI = real[i + k + halfLen] * wI + imag[i + k + halfLen] * wR;

        real[i + k] = uR + vR;
        imag[i + k] = uI + vI;

        real[i + k + halfLen] = uR - vR;
        imag[i + k + halfLen] = uI - vI;

        const nextWR = wR * wStepR - wI * wStepI;
        const nextWI = wR * wStepI + wI * wStepR;
        wR = nextWR;
        wI = nextWI;
      }
    }
  }

  return { real, imag };
}

/**
 * Compute single-sided amplitude spectrum from raw vibration signal
 * @param {Array<number>} signal - Time-domain signal samples
 * @param {number} sampleRateHz - Sampling frequency (e.g. 2048 Hz or 5120 Hz)
 * @returns {{ frequencies: Array<number>, amplitudes: Array<number>, resolutionHz: number }}
 */
export function computeAmplitudeSpectrum(signal, sampleRateHz) {
  // Pad or trim to nearest power of 2
  let N = 1;
  while (N * 2 <= signal.length) {
    N *= 2;
  }
  const slice = signal.slice(0, N);
  const windowed = applyHanningWindow(slice);
  const { real, imag } = cooleyTukeyFFT(windowed);

  const numBins = N / 2;
  const resolutionHz = sampleRateHz / N;
  const frequencies = new Array(numBins);
  const amplitudes = new Array(numBins);

  // DC bin
  frequencies[0] = 0;
  amplitudes[0] = Math.sqrt(real[0] * real[0] + imag[0] * imag[0]) / N;

  // Single-sided AC bins (scaled by 2/N and 2.0 Hanning energy compensation factor)
  const hanningScale = 2.0;
  for (let i = 1; i < numBins; i++) {
    frequencies[i] = Number((i * resolutionHz).toFixed(2));
    const mag = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]);
    amplitudes[i] = Number(((mag * 2.0 * hanningScale) / N).toFixed(4));
  }

  return { frequencies, amplitudes, resolutionHz };
}

export class VibrationSpectralAnalyzer {
  /**
   * @param {Object} [options]
   * @param {number} [options.sampleRateHz=2048] - Accelerometer sampling frequency
   * @param {number} [options.nominalRpm=1800] - Shaft rotating speed
   * @param {Object} [options.bearingGeometry] - Bearing dimensional parameters
   */
  constructor(options = {}) {
    this.sampleRateHz = options.sampleRateHz || 2048;
    this.nominalRpm = options.nominalRpm || 1800;

    // Default 6205 deep-groove ball bearing geometry
    this.bearing = options.bearingGeometry || {
      numBalls: 9,
      ballDiameterMm: 7.94,
      pitchDiameterMm: 39.04,
      contactAngleDeg: 0
    };
  }

  /**
   * Compute characteristic fault frequencies for current bearing geometry
   * @param {number} [rpm] - Operating RPM
   * @returns {Object} Fault frequencies in Hz
   */
  getBearingFaultFrequencies(rpm = this.nominalRpm) {
    const fR = rpm / 60; // 1X running speed
    const n = this.bearing.numBalls;
    const d = this.bearing.ballDiameterMm;
    const D = this.bearing.pitchDiameterMm;
    const thetaRad = (this.bearing.contactAngleDeg * Math.PI) / 180;
    const ratio = (d / D) * Math.cos(thetaRad);

    const bpfo = (n / 2) * fR * (1 - ratio);
    const bpfi = (n / 2) * fR * (1 + ratio);
    const bsf = (D / (2 * d)) * fR * (1 - ratio * ratio);
    const ftf = 0.5 * fR * (1 - ratio);

    return {
      runningSpeed1X: Number(fR.toFixed(2)),
      misalignment2X: Number((2 * fR).toFixed(2)),
      bpfo: Number(bpfo.toFixed(2)),
      bpfi: Number(bpfi.toFixed(2)),
      bsf: Number(bsf.toFixed(2)),
      ftf: Number(ftf.toFixed(2))
    };
  }

  /**
   * Analyze vibration time-series waveform and diagnose anomalies
   * @param {Array<number>} timeSeriesSignal - Discrete vibration acceleration (g) or velocity (mm/s)
   * @param {number} [rpm] - Actual RPM during measurement
   * @param {number} [amplitudeAlarmThreshold=2.5] - Peak threshold in mm/s or g
   * @returns {Object} Diagnostic report with spectral peaks and anomalies
   */
  analyzeWaveform(timeSeriesSignal, rpm = this.nominalRpm, amplitudeAlarmThreshold = 2.5) {
    if (!timeSeriesSignal || timeSeriesSignal.length < 64) {
      throw new Error('Vibration signal requires at least 64 samples for FFT analysis.');
    }

    const { frequencies, amplitudes, resolutionHz } = computeAmplitudeSpectrum(
      timeSeriesSignal,
      this.sampleRateHz
    );

    const faultFreqs = this.getBearingFaultFrequencies(rpm);
    const detectedAnomalies = [];
    let overallRms = 0;

    // Calculate overall RMS velocity
    let sumSq = 0;
    for (let i = 0; i < amplitudes.length; i++) {
      sumSq += amplitudes[i] * amplitudes[i];
    }
    overallRms = Number(Math.sqrt(sumSq / 2).toFixed(3));

    // Peak detection with local maxima
    const peaks = [];
    const minProminence = amplitudeAlarmThreshold * 0.25;

    for (let i = 1; i < amplitudes.length - 1; i++) {
      if (
        amplitudes[i] > amplitudes[i - 1] &&
        amplitudes[i] > amplitudes[i + 1] &&
        amplitudes[i] >= minProminence
      ) {
        peaks.push({
          frequencyHz: frequencies[i],
          amplitude: amplitudes[i]
        });
      }
    }
    peaks.sort((a, b) => b.amplitude - a.amplitude);

    // Correlate prominent peaks with characteristic defect frequencies
    const freqTolerance = Math.max(resolutionHz * 1.5, 2.5); // +/- Hz tolerance

    const checkDefect = (defectType, targetFreq, label) => {
      const matchedPeak = peaks.find((p) => Math.abs(p.frequencyHz - targetFreq) <= freqTolerance);
      if (matchedPeak && matchedPeak.amplitude >= amplitudeAlarmThreshold * 0.6) {
        const severity =
          matchedPeak.amplitude >= amplitudeAlarmThreshold * 1.5
            ? VIBRATION_SEVERITY.CRITICAL
            : matchedPeak.amplitude >= amplitudeAlarmThreshold
            ? VIBRATION_SEVERITY.ALARM
            : VIBRATION_SEVERITY.WATCH;

        detectedAnomalies.push({
          type: defectType,
          label,
          targetFrequencyHz: targetFreq,
          observedFrequencyHz: matchedPeak.frequencyHz,
          amplitude: matchedPeak.amplitude,
          severity
        });
      }
    };

    checkDefect(BEARING_DEFECT_TYPES.UNBALANCE, faultFreqs.runningSpeed1X, 'Mechanical Unbalance (1X)');
    checkDefect(BEARING_DEFECT_TYPES.MISALIGNMENT, faultFreqs.misalignment2X, 'Shaft Misalignment (2X)');
    checkDefect(BEARING_DEFECT_TYPES.BPFO, faultFreqs.bpfo, 'Outer Race Defect (BPFO)');
    checkDefect(BEARING_DEFECT_TYPES.BPFI, faultFreqs.bpfi, 'Inner Race Defect (BPFI)');
    checkDefect(BEARING_DEFECT_TYPES.BSF, faultFreqs.bsf, 'Rolling Element Defect (BSF)');
    checkDefect(BEARING_DEFECT_TYPES.FTF, faultFreqs.ftf, 'Cage Defect (FTF)');

    // Overall severity evaluation
    let severity = VIBRATION_SEVERITY.NORMAL;
    if (detectedAnomalies.some((a) => a.severity === VIBRATION_SEVERITY.CRITICAL) || overallRms > 7.1) {
      severity = VIBRATION_SEVERITY.CRITICAL;
    } else if (detectedAnomalies.some((a) => a.severity === VIBRATION_SEVERITY.ALARM) || overallRms > 4.5) {
      severity = VIBRATION_SEVERITY.ALARM;
    } else if (detectedAnomalies.some((a) => a.severity === VIBRATION_SEVERITY.WATCH) || overallRms > 2.8) {
      severity = VIBRATION_SEVERITY.WATCH;
    }

    return {
      severity,
      overallRmsMmSec: overallRms,
      operatingRpm: rpm,
      faultFrequencies: faultFreqs,
      prominentPeaks: peaks.slice(0, 5),
      anomalies: detectedAnomalies,
      spectralResolutionHz: resolutionHz,
      recommendedAction:
        severity === VIBRATION_SEVERITY.CRITICAL
          ? 'Urgent: Stop machine and perform emergency bearing replacement and balance inspection.'
          : severity === VIBRATION_SEVERITY.ALARM
          ? 'Schedule maintenance inspection within 7 days; lubricate bearing and inspect alignment.'
          : severity === VIBRATION_SEVERITY.WATCH
          ? 'Monitor vibration trend; schedule check during next planned operational downtime.'
          : 'Asset operating within normal vibration thresholds.'
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VIBRATION_SEVERITY,
    BEARING_DEFECT_TYPES,
    applyHanningWindow,
    cooleyTukeyFFT,
    computeAmplitudeSpectrum,
    VibrationSpectralAnalyzer
  };
}

export default VibrationSpectralAnalyzer;
