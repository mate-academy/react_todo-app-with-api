export const filterLinkKeys = {
  all: 'FilterLinkAll',
  active: 'FilterLinkActive',
  completed: 'FilterLinkCompleted',
};

export const normalizeFilterName = (filterName: string) =>
  filterName[0].toUpperCase() + filterName.slice(1);
