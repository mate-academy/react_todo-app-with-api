/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { FilteredBy } from './types/FilteredBy';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoMain } from './components/TodoMain/TodoMain';
import { TodoError } from './components/TodoError/TodoError';
import { TodoErrorType } from './types/TodoErrorType';
import {
  addTodos,
  deleteTodos, getTodos,
  updateTodoStatus,
} from './api/todos';

const USER_ID = 11136;

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filteredBy, setFilteredBy] = useState(FilteredBy.All);
  const [hasError, setHasError] = useState(TodoErrorType.noError);
  const [inputValue, setInputValue] = useState('');
  const [inputDisable, setInputDisable] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!inputValue.trim()) {
      setHasError(TodoErrorType.addEmptyTodoError);

      return;
    }

    setInputDisable(true);

    const newTempToDo: Todo = {
      id: 0,
      userId: USER_ID,
      title: inputValue.trim(),
      completed: false,
    };

    setTempTodo(newTempToDo);

    setHasError(TodoErrorType.noError);

    addTodos(newTempToDo)
      .then((createdTodo) => {
        setTodosFromServer((prevTodos: Todo[]): Todo[] => [...prevTodos, createdTodo]);

        setInputValue('');
      })
      .catch(() => {
        setHasError(TodoErrorType.addTodoError);
      })
      .finally(() => {
        setInputDisable(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingIds((ids) => [...ids, todoId]);
    setHasError(TodoErrorType.noError);

    deleteTodos(todoId)
      .then(() => {
        setTodosFromServer(currentTodos => currentTodos.filter(
          todo => todo.id !== todoId,
        ));
      })

      .catch(() => {
        setHasError(TodoErrorType.deleteTodoError);
      })
      .finally(() => {
        setLoadingIds((ids) => ids.filter(id => id !== todoId));
      });
  };

  useEffect(() => {
    setHasError(TodoErrorType.noError);

    getTodos(USER_ID)
      .then(setTodosFromServer)
      .catch(() => {
        setHasError(TodoErrorType.loadTodoError);
      });
  }, []);
  const preparedTodos = useMemo(() => {
    const copyTodos = [...todosFromServer];

    switch (filteredBy) {
      case FilteredBy.Active:
        return copyTodos.filter(todo => !todo.completed);

      case FilteredBy.Completed:
        return copyTodos.filter(todo => todo.completed);

      default:
        return copyTodos;
    }
  }, [todosFromServer, filteredBy]);

  const handleToggleAll = () => {
    const areAllCompleted = preparedTodos.every((todo) => todo.completed);

    const updatedTodos = preparedTodos.map((todo) => ({
      ...todo,
      completed: !areAllCompleted,
    }));

    Promise.all(
      updatedTodos.map((updatedTodo) => updateTodoStatus(updatedTodo.id, updatedTodo.completed)),
    )
      .then(() => {
        setTodosFromServer(updatedTodos);
        setHasError(TodoErrorType.noError);
      })
      .catch(() => {
        setHasError(TodoErrorType.updateTodoError);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={preparedTodos}
          handleFormSubmit={handleFormSubmit}
          setInputValue={setInputValue}
          inputValue={inputValue}
          inputDisabled={inputDisable}
          handleToggleAll={handleToggleAll}
        />

        <TodoMain
          todos={preparedTodos}
          setHasError={setHasError}
          setTodosFromServer={setTodosFromServer}
          handleDeleteTodo={handleDeleteTodo}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
        />
        {
          todosFromServer.length > 0 && (
            <TodoFooter
              todos={todosFromServer}
              filteredBy={filteredBy}
              setFilteredBy={setFilteredBy}
              handleDeleteTodo={handleDeleteTodo}
            />
          )
        }
      </div>
      <TodoError
        hasError={hasError}
        setHasError={setHasError}
      />
    </div>
  );
};
