export const ABOUT_PRINT_STYLES = `
  @media print {
    header, footer, .no-print {
      display: none !important;
    }
    body {
      background: white !important;
      color: black !important;
    }
    .container {
      max-width: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    .Card {
      border: 1px solid #e2e8f0 !important;
      box-shadow: none !important;
      background: white !important;
    }
    .Badge {
      border: 1px solid #ccc !important;
    }
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .grid {
      display: grid !important;
    }
    .lg\\:grid-cols-3 {
      grid-template-columns: 1fr 2fr !important;
    }
  }
`;
