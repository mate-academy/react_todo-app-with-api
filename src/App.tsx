import React, {
  useCallback,
  useContext,
  useMemo,
} from 'react';

import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  patchTodo,
  postTodo,
} from './api/todos';
import { ErrorInfo } from './components/Errorinfo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { ErrorType } from './types/ErrorType';
import { FilterType } from './types/FilterType';
import { NoIdTodo, Todo } from './types/Todo';
import { AppContext, USER_ID } from './AppContext';
import { ContextKey } from './types/Context';

export const App: React.FC = () => {
  const {
    state,
    changeState,
    errorFound,
    todosFromServer,
    setTodosFromServer,
  } = useContext(AppContext);

  const createNewTodo = (title: string): Promise<void> => {
    const newTodo: NoIdTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    changeState(ContextKey.TempTodo, {
      id: 0,
      ...newTodo,
    });

    return postTodo(newTodo)
      .then(
        (response) => setTodosFromServer(
          currentTodos => [...currentTodos, response],
        ),
      )
      .catch(() => {
        errorFound(ErrorType.NotAddable);

        throw new Error(ErrorType.NotAddable);
      })
      .finally(() => changeState(ContextKey.TempTodo, null));
  };

  const updateTodo = (todoToUpdate: Todo): Promise<void> => {
    return patchTodo(todoToUpdate)
      .then((updatedTodo: Todo) => {
        const todosArr = todosFromServer;
        const indexOfTodo = todosArr
          .findIndex(todo => todo.id === updatedTodo.id);

        todosArr[indexOfTodo] = updatedTodo;

        return setTodosFromServer([...todosArr]);
      })
      .catch(() => {
        errorFound(ErrorType.NotUpdatable);

        throw new Error(ErrorType.NotUpdatable);
      });
  };

  const removeTodo = (todoToDelete: Todo) => {
    return deleteTodo(todoToDelete.id)
      .then(() => setTodosFromServer(currentTodos => currentTodos.filter(
        todo => todo !== todoToDelete,
      )))
      .catch(() => errorFound(ErrorType.NotDeletable));
  };

  const clearCompleted = () => {
    const completedTodos = todosFromServer.filter(todo => todo.completed);

    completedTodos.forEach(completedTodo => {
      deleteTodo(completedTodo.id)
        .then(() => setTodosFromServer(
          currentTodos => currentTodos.filter(todo => todo !== completedTodo),
        ))
        .catch(() => errorFound(ErrorType.NotDeletable));
    });
  };

  const filterTodos = useCallback(
    (todos: Todo[]) => {
      switch (state.selectedFilter) {
        case FilterType.All:
          return todos;

        case FilterType.Active:
          return todos.filter(todo => !todo.completed);

        case FilterType.Completed:
          return todos.filter(todo => todo.completed);

        default:
          return todos;
      }
    },
    [state.selectedFilter],
  );

  const todosToView = useMemo(
    () => filterTodos(todosFromServer),
    [filterTodos, todosFromServer],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          createNewTodo={createNewTodo}
          errorFound={errorFound}
          updateTodo={updateTodo}
        />

        <TodoList
          todosToView={todosToView}
          deleteTodo={removeTodo}
          updateTodo={updateTodo}
        />

        {todosFromServer.length > 0 && (
          <Footer
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorInfo />
    </div>
  );
};
