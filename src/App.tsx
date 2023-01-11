import { useState } from 'react';
import { TodoContent } from './components/TodoContent';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorContext } from './components/ErrorContext';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isEmptyTitleErrorShown, setIsEmptyTitleErrorShown] = useState(false);
  const [isTogglingErrorShown, setIsTogglingErrorShown] = useState(false);
  const [isRemoveErrorShown, setIsRemoveErrorShown] = useState(false);
  const [isAddingErrorShown, setIsAddingErrorShown] = useState(false);

  const errorObject = {
    hasLoadingError,
    setHasLoadingError,
    isTogglingErrorShown,
    setIsTogglingErrorShown,
    isRemoveErrorShown,
    setIsRemoveErrorShown,
    isEmptyTitleErrorShown,
    setIsEmptyTitleErrorShown,
    isAddingErrorShown,
    setIsAddingErrorShown,
  };

  return (
    <ErrorContext.Provider
      value={errorObject}
    >
      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>
        <TodoContent />
        <ErrorNotification />
      </div>
    </ErrorContext.Provider>
  );
};
