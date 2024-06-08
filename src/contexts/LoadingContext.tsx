import React, { useState } from 'react';

interface LoadType {
  load: boolean;
  side: boolean;
}

export interface LoadingState {
  loading: LoadType;
  setLoading: (load: boolean, side: boolean) => void;
}

export const LoadingContext = React.createContext<LoadingState>({
  loading: {
    load: false,
    side: false,
  },
  setLoading: () => {},
});

export const LoadingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState<LoadType>({
    load: false,
    side: false,
  });

  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        setLoading: (arg: boolean, side: boolean) =>
          setLoading({
            load: arg,
            side: side,
          }),
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
