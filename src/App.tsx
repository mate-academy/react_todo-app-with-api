import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';

import { USER_ID } from './api/todos';
import { todos as todosClient } from './api/todos';
import { ErrorNotification } from './Components/ErrorNotification';
import { TodoHead } from './Components/TodoHead';
import { TodoList } from './Components/TodoList';
import { TodoFilter } from './Components/TodoFilter';
import { Errors } from './types/Errors';
import { Filters } from './types/Filters';

const filterTodos = (todos: Todo[], filterParam: Filters): Todo[] | [] => {
  const filteredArr = [...todos];

  switch (filterParam) {
    case Filters.completed:
      return filteredArr.filter(todo => todo.completed);

    case Filters.active:
      return filteredArr.filter(todo => !todo.completed);

    case Filters.all:
    default:
      return filteredArr;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filter, setFilter] = useState<Filters>(Filters.all);
  const [inputResetFlag, setInputResetFlag] = useState(Math.random());
  const [inputLoadingFlag, setInputLoadingFlag] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<string | null>(null);

  const handleErrors = (error: Errors) => {
    window.setTimeout(() => {
      setErrorMessage(error);
    }, 300);
  };

  const filteredTodos: Todo[] = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  // Initial TODOs loading
  useEffect(() => {
    todosClient
      .get()
      .then(setTodos)
      .catch(() => {
        handleErrors(Errors.load);
      });
  }, []);

  // Error Reset
  useEffect(() => {
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, [errorMessage]);

  const addTodos = useCallback((newTodoTitle: string) => {
    setInputLoadingFlag(true);
    setTempTodo(newTodoTitle);
    todosClient
      .add({
        title: newTodoTitle,
        userId: +USER_ID,
        completed: false,
      })
      .then(res => {
        setTodos(current => [...current, res]);
        setInputResetFlag(Math.random());
      })
      .catch(() => {
        handleErrors(Errors.add);
      })
      .finally(() => {
        setInputLoadingFlag(false);
        setTempTodo(null);
      });
  }, []);

  const editTodo = useCallback(
    (id: number, newTitle: string) => {
      const indx = todos.findIndex(todo => todo.id === id);
      const cleantTitle = newTitle.trim();

      setLoadingTodoIds(cur => [...cur, id]);

      todosClient
        .update(id, { title: cleantTitle })
        .then(() => {
          setTodos(() => {
            todos[indx].title = todos[indx].title;

            return todos;
          });
        })
        .catch(() => handleErrors(Errors.update))
        .finally(() =>
          setLoadingTodoIds(prev => prev.filter(PrevId => PrevId !== id)),
        );
    },
    [todos],
  );

  const deleteTodo = (id: number) => {
    setLoadingTodoIds([...loadingTodoIds, id]);
    todosClient
      .delete(id)
      .then(() => {
        setTodos(cuurent => cuurent.filter(todo => todo.id !== id));
      })
      .catch(() => {
        handleErrors(Errors.delete);
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(curId => curId !== id));
        setInputResetFlag(Math.random());
      });
  };

  const deleteAllCompleted = () => {
    todos.forEach(todo => (todo.completed ? deleteTodo(todo.id) : undefined));
  };

  const toggleTodo = (todoId: number) => {
    const indx = todos.findIndex(todo => todo.id === todoId);

    setLoadingTodoIds(cur => [...cur, todoId]);

    todosClient
      .update(todoId, { completed: !todos[indx].completed })
      .then(() => {
        setTodos(() => {
          todos[indx].completed = !todos[indx].completed;

          return todos;
        });
      })
      .catch(() => handleErrors(Errors.update))
      .finally(() =>
        setLoadingTodoIds(prev => prev.filter(id => id !== todoId)),
      );
  };

  const toggleAll = () => {
    todos.forEach(todo => toggleTodo(todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHead
          todos={filteredTodos}
          onAdd={addTodos}
          setError={setErrorMessage}
          resetFlag={inputResetFlag}
          loadingFlag={inputLoadingFlag}
          onToggleAll={toggleAll}
        />

        <TodoList
          todos={filteredTodos}
          tempTodoTitle={tempTodo}
          loadingIds={loadingTodoIds}
          onDelete={deleteTodo}
          onToggle={toggleTodo}
          onEdit={editTodo}
        />

        <TodoFilter
          todos={todos}
          filter={filter}
          onClick={setFilter}
          onDeleteAllCompleted={deleteAllCompleted}
        />
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
