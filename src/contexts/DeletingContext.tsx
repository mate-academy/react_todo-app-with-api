import React, { useState } from 'react';

export interface DeleteType {
  isDeleteActive: boolean;
  setIsDeleteActive: (active: boolean) => void;
}

export const DeletingContext = React.createContext<DeleteType>({
  isDeleteActive: false,
  setIsDeleteActive: () => {},
});

export const DeletingContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDelete, setIsDelete] = useState(false);

  return (
    <DeletingContext.Provider
      value={{
        isDeleteActive: isDelete,
        setIsDeleteActive: setIsDelete,
      }}
    >
      {children}
    </DeletingContext.Provider>
  );
};
