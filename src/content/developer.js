// Developer view — for recruiters, collaborators, open-source people.
// Design doc section 3.2. The only view that uses `stackLines`.
export default {
  key: 'developer',
  label: 'Developer',
  sigil: '‹/›',
  corner: 'Developer',
  role: 'Full-Stack Developer · Data Engineer',
  tagline: '"Pipelines by day, open-source by night."',
  stackLines: [
    'React · Next.js · Python · FastAPI',
    'AWS · Snowflake · Databricks · Terraform',
    'GraphQL · Spring Boot · Kafka',
  ],
  stats: [
    { num: 'RHCSA', label: 'cert' },
    { num: '9 yrs', label: 'build' },
    { num: 'NAST', label: 'fellow' },
  ],
  back: {
    cols: [
      {
        sections: [
          {
            label: 'Connect',
            items: [
              { key: 'GH', text: 'github.com/daredavil01' },
              { key: 'IN', text: 'linkedin.com/in/sankettambare' },
              { key: 'DEV', text: 'dev.to/daredavil' },
              { key: 'MAIL', text: 'sanket.tambare01@gmail.com' },
            ],
          },
          {
            label: 'Current work',
            items: [
              {
                key: '→',
                text: 'Bridgenext · DORA-metric pipelines, GitLab API → Lambda → Databricks → Tableau',
              },
              {
                key: '→',
                text: 'NAST Fellow · Citizen agency in AI governance for public deployments',
              },
            ],
          },
        ],
      },
      {
        sections: [
          {
            label: 'Selected projects',
            items: [
              { key: '→', text: 'RunSmart — marathon plan generator' },
              { key: '→', text: 'E20 ka Chakravyuha — data journalism' },
              { key: '→', text: 'Adivasi Survey Dashboard — 281 HH, 28 charts, bilingual' },
            ],
          },
        ],
      },
    ],
    buttons: ['vCard', 'Resume', 'GitHub'],
    quote: '"Critically engaging with the world, one commit at a time."',
  },
};
