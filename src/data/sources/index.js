const SOURCES = {
  LACOMBE_JOURNALS: {
    quote: 'The prairie burned every afternoon... the oxen grew restless in the smoke.',
    author: 'Father Albert Lacombe',
    work: 'Missionary Journals',
    year: 1878,
    url: 'https://github.com/Bayarddevries/metis-research-wiki',
  },
  HBC_JOURNALS: {
    quote: 'Pemmican stores declining. The Company feels the pressure of the free traders.',
    author: 'HBC Fort Edmonton Post Journal',
    work: 'Archives of Manitoba',
    year: 1878,
    url: 'https://archive.org/stream/P000279/P000279_djvu.txt',
  },
  SAWYER_TRIAL: {
    quote: 'The trial of Pierre Guillaume Sayer marked the beginning of free trade in the West.',
    author: 'MMF Historical Research',
    work: 'metis-research-vault',
    url: 'https://github.com/Bayarddevries/metis-research-wiki',
  },
  DUMONT_ACCOUNTS: {
    quote: 'Gabriel Dumont... ferryman, guide, and later military leader of the Métis forces.',
    author: 'Dumont Family Accounts',
    work: 'MMF Research Vault',
    url: 'https://github.com/Bayarddevries/metis-research-wiki',
  },
  MCCONNELL_NW: {
    quote: "Fort Garry, the centre of the Hudson's Bay Company's operations in the Red River.",
    author: 'R. G. McConnell',
    work: 'The North-West of Canada',
    year: 1885,
    url: 'https://archive.org/stream/toredriverbeyond00marb/toredriverbeyond00marb_djvu.txt',
  },
  CARLTON_TRAIL: {
    quote: 'The Carlton Trail... the great highway of the prairies.',
    author: 'Antoine Blanc',
    work: 'The Carlton Trail (Manitoba History)',
    year: 1959,
    url: 'https://archive.org/stream/P000411/P000411_djvu.txt',
  },
  NWMP_HISTORY: {
    quote: 'The mounted police established posts along the trail to enforce Ottawa\'s regulations.',
    author: 'R. C. Macleod',
    work: 'The North-West Mounted Police and Law Enforcement, 1873-1905',
    year: 1976,
  },
  BUFFALO_HUNT: {
    quote: 'The buffalo hunt... the very foundation of Métis economy and culture.',
    author: 'Terry Goulet & George Goulet',
    work: 'The Métis: Memorable Events and Memorable People',
    year: 2005,
    url: 'https://github.com/Bayarddevries/metis-research-wiki',
  },
};

export function getSource(key) {
  return SOURCES[key];
}

export function listSources() {
  return Object.values(SOURCES);
}
