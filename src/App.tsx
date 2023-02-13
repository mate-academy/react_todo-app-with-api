/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';

import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { ErrorPanel } from './components/ErrorPanel';

import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { Errors } from './types/Errors';

import {
  getTodos,
  addTodo,
  removeTodo,
  updateTodoStatus,
  updateTodoTitle,
} from './api/todos';

const USER_ID = 6160;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors>(Errors.NoError);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);
  const [selectedFilter, setSelectedFilter] = useState<Filters>(Filters.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [isNewTodoLoading, setIsNewTodoLoading] = useState(false);

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const saveEditedTitle = (
    todoId: number,
    todoTitle: string,
    setEditingTodoId: (value: number) => void,
  ) => {
    setLoadingTodoIds([...loadingTodoIds, todoId]);
    updateTodoTitle(todoId, todoTitle)
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds([]);
            setEditingTodoId(0);
          })
          .catch(() => {
            setError(Errors.CantUpdate);
          });
      });
  };

  const toggleTodoStatus = (todoId: number, completed: boolean) => {
    updateTodoStatus(todoId, !completed)
      .then(() => {
        setLoadingTodoIds([...loadingTodoIds, todoId]);
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds([]);
          })
          .catch(() => {
            setError(Errors.CantUpdate);
          });
      });
  };

  const getUpdatedTodos = (
    todosToUpdate: Todo[] = [],
    everyTodoCompleted: boolean,
    noTodoCompleted: boolean,
    someTodosCompleted: boolean,
  ) => {
    const updatedTodos: Todo[] = [];

    todosToUpdate.forEach(todo => {
      let updatedTodo = { ...todo };

      if (someTodosCompleted && !todo.completed) {
        updatedTodo = { ...todo, completed: !todo.completed };
      }

      if (everyTodoCompleted || noTodoCompleted) {
        updatedTodo = { ...todo, completed: !todo.completed };
      }

      updatedTodos.push(updatedTodo);
    });

    return updatedTodos;
  };

  const getLoadingTodoIds = (
    todosToLoad: Todo[] = [],
    everyTodoCompleted: boolean,
    noTodoCompleted: boolean,
    someTodosCompleted: boolean,
  ) => {
    const loadingTodoIdsToAdd: number[] = [];

    todosToLoad.forEach(todo => {
      if ((someTodosCompleted && !todo.completed)
        || (everyTodoCompleted || noTodoCompleted)) {
        loadingTodoIdsToAdd.push(todo.id);
      }
    });

    return loadingTodoIdsToAdd;
  };

  const updateTodosStatus = (todosToUpdate: Todo[]) => {
    return Promise.all(
      todosToUpdate
        .map(todo => updateTodoStatus(todo.id, todo.completed)),
    );
  };

  const toggleAllTodoStatus = () => {
    const everyTodoCompleted = todos.every(todo => todo.completed);
    const noTodoCompleted = todos.every(todo => !todo.completed);
    const someTodosCompleted = todos.some(todo => todo.completed)
      && !everyTodoCompleted;

    const updatedTodos = getUpdatedTodos(
      todos,
      everyTodoCompleted,
      noTodoCompleted,
      someTodosCompleted,
    );
    const loadingTodoIdsToAdd = getLoadingTodoIds(
      todos,
      everyTodoCompleted,
      noTodoCompleted,
      someTodosCompleted,
    );

    setLoadingTodoIds(loadingTodoIdsToAdd);

    updateTodosStatus(updatedTodos)
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds([]);
          });
      })
      .catch(() => {
        setError(Errors.CantUpdate);
      });
  };

  const addNewTodoTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const createNewTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.length) {
      setError(Errors.TitleIsEmpty);

      return;
    }

    setIsNewTodoLoading(true);

    const todoToAdd: Todo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    setTempTodo(todoToAdd);

    addTodo(todoToAdd)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
        setFilteredTodos([...todos, newTodo]);
        setTempTodo(null);
        setIsNewTodoLoading(false);
      })
      .catch(() => {
        setError(Errors.CantAdd);
      });

    setNewTodoTitle('');
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds([...loadingTodoIds, todoId]);
    removeTodo(todoId)
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds([]);
          })
          .catch(() => {
            setError(Errors.CantRemove);
          });
      });
  };

  const clearCompletedTodos = () => {
    setLoadingTodoIds(
      [...loadingTodoIds, ...completedTodos.map(todo => todo.id)],
    );

    Promise.all(completedTodos.map(todo => removeTodo(todo.id)))
      .then(() => {
        getTodos(USER_ID)
          .then(todosFromServer => {
            setTodos(todosFromServer);
            setFilteredTodos(todosFromServer);
            setLoadingTodoIds([]);
          })
          .catch(() => {
            setError(Errors.CantRemove);
          });
      });
  };

  const filterByAll = () => {
    setSelectedFilter(Filters.All);
    setFilteredTodos(todos);
  };

  const filterByActive = () => {
    setSelectedFilter(Filters.Active);
    setFilteredTodos(activeTodos);
  };

  const filterByCompleted = () => {
    setSelectedFilter(Filters.Completed);
    setFilteredTodos(completedTodos);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        setFilteredTodos(todosFromServer);
        setError(Errors.NoError);
      })
      .catch(() => {
        setError(Errors.CantLoad);
      });
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(Errors.NoError);
      }, 3000);
    }
  }, [error]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoTitle={newTodoTitle}
          addNewTodoTitle={addNewTodoTitle}
          createNewTodo={createNewTodo}
          activeTodos={activeTodos}
          isNewTodoLoading={isNewTodoLoading}
          toggleAllTodoStatus={toggleAllTodoStatus}
        />
        <>
          <Main
            filteredTodos={filteredTodos}
            deleteTodo={deleteTodo}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            toggleTodoStatus={toggleTodoStatus}
            saveEditedTitle={saveEditedTitle}
          />
          <Footer
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            filterByActive={filterByActive}
            filterByAll={filterByAll}
            filterByCompleted={filterByCompleted}
            selectedFilter={selectedFilter}
            clearCompletedTodos={clearCompletedTodos}
          />
        </>

      </div>
      {error && (
        <ErrorPanel
          errorMessage={error}
          clearError={() => setError(Errors.NoError)}
        />
      )}

    </div>
  );
};
