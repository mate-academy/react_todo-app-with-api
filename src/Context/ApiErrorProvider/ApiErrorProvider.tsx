import React, { createContext, useState } from 'react';

import { ApiErrorType } from '../../types/apiErrorsType';

type ApiErrorContextType = {
  apiError: ApiErrorType,
  setApiError: React.Dispatch<React.SetStateAction<ApiErrorType>>
};

type Props = {
  children: React.ReactNode,
};

export const ApiErrorContext = createContext<ApiErrorContextType>({
  apiError: null,
  setApiError: () => { },
});

export const ApiErrorProvider: React.FC<Props> = ({ children }) => {
  const [apiError, setApiError] = useState<ApiErrorType>(null);

  return (
    <ApiErrorContext.Provider value={{ apiError, setApiError }}>
      {children}
    </ApiErrorContext.Provider>
  );
};
