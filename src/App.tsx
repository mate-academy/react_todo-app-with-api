/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useContext, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Filter } from './components/Filter/Filter';
import { TodoList } from './components/TodoList/TodoList';
import { InputForm } from './components/InputForm/InputForm';
import { Status } from './types/Status';
import { Error } from './components/Error/Error';

import {
  ErrorsContext,
  TodoUpdateContext,
  TodosContext,
  TodosProvider,
} from './TodosContext/TodosContext';

export const USER_ID = 105;

export const AppContent: React.FC = () => {
  const { addTodo, changeTodo } = useContext(TodoUpdateContext);
  const { todos } = useContext(TodosContext);
  const [status, setStatus] = useState<Status>(Status.All);
  const { setShowError } = useContext(ErrorsContext);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleStatusChange = (newStatus: Status) => {
    setStatus(newStatus);
  };

  const handleSetIsClicked = () => {
    setShowError(false);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <InputForm
          onSubmit={addTodo}
          onCompleted={changeTodo}
          inputRef={inputRef}
        />

        {!!todos.length && (
          <TodoList status={status} inputRef={inputRef} />
        )}

        {!!todos.length && (
          <Filter
            onChangeStatus={handleStatusChange}
            status={status}
            inputRef={inputRef}
          />
        )}
      </div>
      <Error onIsClicked={handleSetIsClicked} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <AppContent />
    </TodosProvider>
  );
};
