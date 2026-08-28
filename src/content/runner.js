// Runner view — for running clubs, race organisers, pacers, the Strava crowd.
// Design doc section 3.3.
export default {
  key: 'runner',
  label: 'Runner',
  sigil: '⟿',
  corner: 'Runner',
  role: 'Ultra Runner · 5×/week',
  tagline: '"From a first nervous 5K to a 50K ultra."',
  stats: [
    { num: '50K', label: 'ultra' },
    { num: '20+', label: 'races' },
    { num: 'FM', label: '42.2K' },
    { num: 'HM', label: '21.1K' },
  ],
  note: 'Next: Khadakwasla Ultra 55K · 22 Nov 2026',
  back: {
    cols: [
      {
        sections: [
          {
            label: 'Race log (selected)',
            items: [
              { key: '50K', text: 'Tata Ultra Marathon · Lonavala' },
              { key: 'FM', text: 'Full Marathon 42.2K' },
              { key: 'HM', text: 'Half Marathons (×many) 21.1K' },
              { key: '10/5', text: '10K & 5K series' },
            ],
          },
          {
            label: 'Training',
            items: [
              { key: '→', text: '5 runs/week, dawn sessions' },
              { key: '→', text: '10-week block for KU 55K' },
              { key: '→', text: 'River route, Pune' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            label: 'Connect',
            items: [
              { key: 'STRV', text: 'strava.com/athlete/sanket' },
              { key: 'WEB', text: 'sankettambare.in/sports' },
              { key: 'RUN', text: 'runfolio.sankettambare.in' },
              { key: 'MAIL', text: 'sanket.tambare01@gmail.com' },
            ],
          },
        ],
      },
    ],
    buttons: ['vCard', 'RunFolio', 'Race Log'],
    quote:
      '"Running five days a week isn’t training for a number — it’s how the day gets its shape."',
  },
};
