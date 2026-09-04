// Historical case log + workbook parsing helpers, extracted from the Override Calibration Score tool.
(function(){
const CATEGORIES = ['Shelf-stable grocery', 'Refrigerated', 'Frozen', 'Beverage', 'Snacks', 'Supplements & wellness', 'Health & beauty', 'Household & general merchandise'];

const SEED_RECORDS = [
  { period: '2023-P8', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: -0.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P9', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: 14.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P10', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: 8.7, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P11', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 15, noSize: null, weeks: null, overshoot: 3.3, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P12', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 2.8, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P13', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 11.3, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P1', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -13.2, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P2', product: 'Brand X', category: 'Refrigerated', trend: 'viral', newness: 'established', override: 50, noSize: null, weeks: null, overshoot: -36.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P3', product: 'Brand X', category: 'Refrigerated', trend: 'viral', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: -5.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P4', product: 'Brand X', category: 'Refrigerated', trend: 'viral', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: 9.6, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P5', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 29, noSize: null, weeks: null, overshoot: 22.9, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P6', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 8.9, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P7', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 5.2, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P8', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 10.3, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P9', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 6.1, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P10', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -7.9, runBefore: 6, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P11', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 5.6, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P12', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -1.2, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P13', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 9.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P1', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 11.9, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P2', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -9.6, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P3', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 32, noSize: null, weeks: null, overshoot: -7.8, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P4', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 37, noSize: null, weeks: null, overshoot: 11.3, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P5', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 12, noSize: null, weeks: null, overshoot: 13.7, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P6', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 5.5, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P7', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -6.6, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P8', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 7.4, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P9', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 1.7, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P10', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -0.1, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P11', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 2.6, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P12', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -1, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P13', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 6.3, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P1', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -1.5, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P2', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 46, noSize: null, weeks: null, overshoot: 3.2, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P3', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 36, noSize: null, weeks: null, overshoot: 13.5, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P4', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 24, noSize: null, weeks: null, overshoot: 6, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P5', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: 8, noSize: null, weeks: null, overshoot: 11.3, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P6', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 10.8, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P7', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -4.7, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P8', product: 'Brand X', category: 'Refrigerated', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -3, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P2', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: -100, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P5', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: -11.4, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P6', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 108.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P7', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 55, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P8', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 13.7, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P9', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: 59, noSize: null, weeks: null, overshoot: 20.8, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P10', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: 29, noSize: null, weeks: null, overshoot: 70.1, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P11', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: 15, noSize: null, weeks: null, overshoot: 15.8, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P12', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: 27, noSize: null, weeks: null, overshoot: -26.5, runBefore: 6, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P13', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: -19.2, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P1', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: -9.2, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P2', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 79.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P3', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 40.2, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P4', product: 'Brand Y', category: 'Snacks', trend: 'viral', newness: 'new', override: null, noSize: 'baseline', weeks: null, overshoot: 15.1, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P5', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: 18, noSize: null, weeks: null, overshoot: 14.6, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P6', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'no-lift', weeks: null, overshoot: 39.5, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P7', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'no-lift', weeks: null, overshoot: 25.1, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P8', product: 'Brand Y', category: 'Snacks', trend: 'organic', newness: 'new', override: null, noSize: 'no-lift', weeks: null, overshoot: 9.3, runBefore: 6, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P8', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: -39.5, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P9', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: -12.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P10', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'baseline', weeks: null, overshoot: -11.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P11', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 33, noSize: null, weeks: null, overshoot: -5.6, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P12', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 11, noSize: null, weeks: null, overshoot: -1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2023-P13', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -20.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P1', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 22, noSize: null, weeks: null, overshoot: -6.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P2', product: 'Brand Z', category: 'Supplements & wellness', trend: 'viral', newness: 'established', override: 27, noSize: null, weeks: null, overshoot: -22.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P3', product: 'Brand Z', category: 'Supplements & wellness', trend: 'viral', newness: 'established', override: 39, noSize: null, weeks: null, overshoot: -7.6, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P4', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 11, noSize: null, weeks: null, overshoot: 9.4, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P5', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 7, noSize: null, weeks: null, overshoot: 35.1, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P6', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 34.1, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P7', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 25.3, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P8', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 0.3, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P9', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 15.4, runBefore: 5, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P10', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 50.1, runBefore: 6, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P11', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 27.1, runBefore: 7, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P12', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 7, noSize: null, weeks: null, overshoot: 33.4, runBefore: 8, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2024-P13', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 17.3, runBefore: 9, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P1', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -28, runBefore: 10, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P2', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 21, noSize: null, weeks: null, overshoot: -0.5, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P3', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 15, noSize: null, weeks: null, overshoot: 0.8, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P4', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 20.5, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P5', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 13.2, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P6', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 4.2, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P7', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -11.7, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P8', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -3.3, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P9', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 22, noSize: null, weeks: null, overshoot: -1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P10', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 37, noSize: null, weeks: null, overshoot: 6.1, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P11', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: 18, noSize: null, weeks: null, overshoot: 33.6, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P12', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 20, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2025-P13', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 8.4, runBefore: 3, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P1', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -1.3, runBefore: 4, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P2', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -1.7, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P3', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -2.2, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P4', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -5.2, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P5', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -8.3, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P6', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 11.8, runBefore: null, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P7', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: 6.4, runBefore: 1, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' },
  { period: '2026-P8', product: 'Brand Z', category: 'Supplements & wellness', trend: 'organic', newness: 'established', override: null, noSize: 'no-lift', weeks: null, overshoot: -4.7, runBefore: 2, excess: null, gtrends: null, source: 'Fair Chance Futures workbook' }
];

const COLUMN_ALIASES = {
  period: ['fiscal label', 'fiscal period', 'period label', 'period', 'week', 'date'],
  product: ['product', 'brand', 'item', 'sku'],
  category: ['category', 'product category', 'dept', 'department'],
  trend: ['trend', 'trend type', 'trendtype'],
  newness: ['newness', 'new or established', 'product stage', 'stage', 'lifecycle'],
  override: ['override', 'override %', 'override pct', 'override size'],
  weeks: ['weeks', 'duration', 'duration weeks'],
  overshoot: ['overshoot', 'overshoot %', 'forecast overshoot', 'error %'],
  brand: ['brand', 'brand name', 'vendor', 'supplier'],
  gtrends: ['gtrends', 'google trends', 'google trends index', 'trends index', 'search interest'],
  runBefore: ['runbefore', 'run before', 'consecutive periods', 'periods off', 'consecutive misses', 'streak'],
  excess: ['excess', 'excess handling', 'disposition', 'excess disposition', 'what happened to excess'],
  forecast: ['forecast', 'hist base forecast', 'base forecast', 'forecast units', 'forecast qty', 'forecast quantity', 'planned', 'plan'],
  actual: ['actual', 'actuals', 'base demand', 'actual units', 'actual qty', 'actual quantity', 'demand', 'sold']
};

// Legend, note and total rows live in the same column as the products. A product name is short and
// isn't a sentence.
const looksLikeProduct = v =>
  !!v && v.length <= 60 && !/[.;:]\s/.test(v) && !/^(total|subtotal|note|notes|legend|source|sample data)\b/i.test(v);
// Headers are matched exactly first, then by containment, so "Hist Base Forecast" or "Base Demand"
// still resolve without the export having to be renamed. Growth/error columns lose to the plain
// figure columns because the alias list is walked in order.
const findCol = (headers, key) => {
  const lower = headers.map(h => String(h).trim().toLowerCase());
  const aliases = COLUMN_ALIASES[key];
  for (let i = 0; i < aliases.length; i++) {
    const hit = lower.indexOf(aliases[i]);
    if (hit !== -1) return hit;
  }
  for (let i = 0; i < aliases.length; i++) {
    for (let c = 0; c < lower.length; c++) {
      if (lower[c] && lower[c].indexOf(aliases[i]) !== -1 && !/growth|%/.test(lower[c])) return c;
    }
  }
  return -1;
};

const round1 = n => Math.round(n * 10) / 10;
window.OCS = { CATEGORIES, SEED_RECORDS, COLUMN_ALIASES, looksLikeProduct, findCol, round1 };
})();
