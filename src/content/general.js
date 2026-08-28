// General view — the full picture. A multi-dimensional person, not a job title.
// Design doc section 3.1.
export default {
  key: 'general',
  label: 'General',
  sigil: '◆',
  corner: 'General',
  role: 'Software Developer · Runner · Writer',
  tagline: '"A developer who runs at dawn and reads past midnight."',
  stats: [
    { num: '20+', label: 'races' },
    { num: '43+', label: 'books' },
    { num: '15+', label: 'treks' },
    { num: '1.6K', label: 'posts' },
  ],
  back: {
    cols: [
      {
        sections: [
          {
            label: 'Connect',
            items: [
              { key: 'MAIL', text: 'sanket.tambare01@gmail.com' },
              { key: 'WEB', text: 'sankettambare.in' },
              { key: 'IN', text: 'linkedin.com/in/sankettambare' },
              { key: 'GH', text: 'github.com/daredavil01' },
              { key: 'SUB', text: 'sankettambare.substack.com' },
              { key: 'X', text: '@i_daredavil' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            label: 'Now',
            items: [
              { key: '→', text: 'Bridgenext · DORA metrics & ETL' },
              { key: '→', text: 'NAST Fellow · AI governance research' },
              { key: '→', text: 'Training for Khadakwasla Ultra 55K' },
            ],
          },
        ],
      },
    ],
    buttons: ['vCard', 'Copy', 'Resume'],
    quote: '"Critically engaging with the world, one commit at a time."',
  },
};
