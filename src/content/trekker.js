// Trekker view — for trekking groups, Sahyadri explorers, fort enthusiasts.
// Design doc section 3.4.
export default {
  key: 'trekker',
  label: 'Trekker',
  sigil: '▲',
  corner: 'Trekker',
  role: 'Sahyadri Trekker · Fort Collector',
  tagline: '"15+ summits, and one 22-hour night march."',
  stats: [
    { num: '15+', label: 'treks done' },
    { num: '22 hr', label: 'night march' },
    { num: '∞', label: 'still to go' },
  ],
  note: 'Signature: Panhala → Pawankhind · the 22hr historic night trek',
  back: {
    cols: [
      {
        sections: [
          {
            label: 'Summit log (selected)',
            items: [
              { key: '▲', text: 'Panhala → Pawankhind · 22hr night march' },
              { key: '▲', text: 'Sahyadri fort series · 15+ summits' },
              { key: '▲', text: 'Ridge routes & historic trails' },
            ],
          },
          {
            label: 'What I seek',
            items: [
              { key: '→', text: 'Forts with history and difficult approaches' },
              { key: '→', text: 'Night treks and endurance routes' },
              { key: '→', text: 'Weekend Sahyadri exploration' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            label: 'Connect',
            items: [
              { key: 'WEB', text: 'sankettambare.in/treks' },
              { key: 'PIC', text: 'Photos & route maps on the live page' },
              { key: 'MAIL', text: 'sanket.tambare01@gmail.com' },
              { key: 'IN', text: 'linkedin.com/in/sankettambare' },
            ],
          },
        ],
      },
    ],
    buttons: ['vCard', 'Trek Log', 'Photos'],
    quote:
      '"Weekends belong to the Sahyadris — forts, ridgelines, and the long historic routes."',
  },
};
