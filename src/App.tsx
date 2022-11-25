import { useState } from 'react';
import { TodoContent } from './components/TodoContent';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorContext } from './components/ErrorContext';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isAddingErrorShown, setIsAddingErrorShown] = useState(false);
  const [isTogglingErrorShown, setIsTogglingErrorShown] = useState(false);
  const [isRemoveErrorShown, setIsRemoveErrorShown] = useState(false);

  return (
    <ErrorContext.Provider
      value={{
        hasLoadingError,
        setHasLoadingError,
        isTogglingErrorShown,
        setIsTogglingErrorShown,
        isRemoveErrorShown,
        setIsRemoveErrorShown,
        isAddingErrorShown,
        setIsAddingErrorShown,
      }}
    >
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <TodoContent />

        <ErrorNotification />
      </div>
    </ErrorContext.Provider>
  );
};
