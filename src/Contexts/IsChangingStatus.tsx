import { createContext, useState } from 'react';

type SetIsChangingStatus = React.Dispatch<React.SetStateAction<boolean>>;

export const IsChangingStatusContext = createContext(false);
export const SetIsChangingStatusContext = createContext<SetIsChangingStatus>(
  () => [],
);

type Props = {
  children: React.ReactNode;
};

export const IsChangingStatusContextProvider: React.FC<Props> = ({
  children,
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  return (
    <IsChangingStatusContext.Provider value={isChangingStatus}>
      <SetIsChangingStatusContext.Provider value={setIsChangingStatus}>
        {children}
      </SetIsChangingStatusContext.Provider>
    </IsChangingStatusContext.Provider>
  );
};
