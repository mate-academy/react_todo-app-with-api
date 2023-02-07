import React from 'react';

const INITIAL_STATE = {
  isDeleting: false,
  isUpdating: false,
  selectedIdArr: [] as number[],
};

export const ActionStateContext = React.createContext(INITIAL_STATE);
