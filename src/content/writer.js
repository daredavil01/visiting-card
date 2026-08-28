// Writer view — for editors, readers, fellow writers, and the Substack crowd.
//
// Not in the original four personas of design doc section 3, but the General view
// already calls the person "Software Developer · Runner · Writer" and carries the
// book and post counts, so the writing was always there without a lens of its own.
// Every fact here comes from the design doc: the counts from section 3.1, the
// Substack and Dev.to links from 3.1 and 3.2, the NAST fellowship and the two
// published pieces from the Developer view's project list.
export default {
  key: 'writer',
  label: 'Writer',
  sigil: '¶',
  corner: 'Writer',
  role: 'Writer · Reader · Data Journalist',
  tagline: '"Reads past midnight, writes before dawn."',
  stats: [
    { num: '43+', label: 'books' },
    { num: '1.6K', label: 'posts' },
    { num: 'NAST', label: 'fellow' },
  ],
  note: 'Longform: E20 ka Chakravyuha · data journalism',
  back: {
    cols: [
      {
        sections: [
          {
            label: 'Published',
            items: [
              { key: '→', text: 'E20 ka Chakravyuha — data journalism' },
              { key: '→', text: 'Adivasi Survey Dashboard — 281 HH, 28 charts, bilingual' },
              { key: '→', text: 'NAST Fellow · citizen agency in AI governance' },
            ],
          },
          {
            label: 'Writing about',
            items: [
              { key: '→', text: 'Technology and the people it lands on' },
              { key: '→', text: 'Long distances, on foot and on the page' },
              { key: '→', text: 'What 43+ books a year leaves behind' },
            ],
          },
        ],
      },
      {
        sections: [
          {
            label: 'Read me',
            items: [
              { key: 'SUB', text: 'sankettambare.substack.com' },
              { key: 'DEV', text: 'dev.to/daredavil' },
              { key: 'WEB', text: 'sankettambare.in' },
              { key: 'X', text: '@i_daredavil' },
              { key: 'MAIL', text: 'sanket.tambare01@gmail.com' },
            ],
          },
        ],
      },
    ],
    buttons: ['vCard', 'Substack', 'Copy'],
    quote: '"Critically engaging with the world, one commit at a time."',
  },
};
