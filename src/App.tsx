/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Errors } from './utils/Errors/Errors';
import { Footer } from './utils/Footer/Footer';
import { Header } from './utils/Header/Header';
import { TodoList } from './utils/TodoList/TodoList';
import { deleteTodos, getTodos, patchTodos, postTodos } from './api/todos';
import { Filter, getVisibleTodos } from './helpers';

const USER_ID = 700;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [allCompleted, setAllCompleted] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const completedTodos = todos.filter(todo => todo.completed).length;
  const notCompletedTodos = todos.filter(todo => !todo.completed).length;
  const areAllCompleted =
    todos?.length > 0 && todos?.every(todo => todo.completed);

  // #region get
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError('Unable to load todos'));
  }, []);

  const visibleTodos: Todo[] = useMemo(() => {
    return getVisibleTodos(todos, filter);
  }, [todos, filter]);

  // #endregion

  //#region patchStatus
  const handleToggleAllCompleted = () => {
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: !allCompleted,
    }));

    if (allCompleted) {
      const arrayWithCompletedTodoIds = visibleTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setLoadingTodoIds(arrayWithCompletedTodoIds);
    } else {
      const arrayWithNotCompletedTodoIds = visibleTodos
        .filter(todo => !todo.completed)
        .map(todo => todo.id);

      setLoadingTodoIds(arrayWithNotCompletedTodoIds);
    }

    Promise.all(
      updatedTodos.map(todo =>
        patchTodos(todo).catch(() => setError('Unable to update a todo')),
      ),
    ).finally(() => {
      setTodos(updatedTodos);
      setLoadingTodoIds([]);
    });

    setAllCompleted(!allCompleted);
  };

  const handleTodoStatusChange = (id: number) => {
    setLoadingTodoIds([id]);

    const todoToUpdate = todos.find(todo => todo.id === id);

    if (!todoToUpdate) {
      return;
    }

    const updatedTodoStatus = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    patchTodos(updatedTodoStatus)
      .then(updated =>
        setTodos(todos.map(todo => (todo.id === id ? updated : todo))),
      )
      .catch(() => setError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  };

  //#endregion

  //#region editTodo

  function updateTodo(updatedTodo: Todo) {
    setLoadingTodoIds([updatedTodo.id]);

    patchTodos(updatedTodo)
      .then(todo => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];
          const index = newTodos.findIndex(
            newTodo => newTodo.id === updatedTodo.id,
          );

          newTodos.splice(index, 1, todo);

          return newTodos;
        });
      })
      .catch(() => setError('Unable to update a todo'))
      .finally(() => {
        setLoadingTodoIds([]);
      });
  }

  //#endregion

  //#region delete

  const handleDeleteTodo = (id: number) => {
    setLoadingTodoIds([id]);

    deleteTodos(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(() => setError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoIds([]);
        setTempTodo(null);
      });
  };

  // eslint-disable-next-line max-len, prettier/prettier

  const handleClearCompleted = () => {
    const modifiedTodos = todos.filter(todo => todo.completed);

    const modifiedTodosIds = modifiedTodos.map(todo => todo.id);

    setLoadingTodoIds(modifiedTodosIds);

    modifiedTodosIds.forEach(id => {
      deleteTodos(id)
        .then(() => {
          setTodos(currentTodos =>
            currentTodos.filter(currentTodo => currentTodo.id !== id),
          );
        })
        .catch(() => {
          setError('Unable to delete a todo');
        });
    });
  };

  //#endregion

  //#region input/post

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setError('Title should not be empty');

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    });

    postTodos({
      title: newTodoTitle.trim(),
      userId: USER_ID,
      completed: false,
    })
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setNewTodoTitle('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
      });
  };

  //#endregion

  const handleErrorClose = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          handleToggleAllCompleted={handleToggleAllCompleted}
          areAllCompleted={areAllCompleted}
          handleAddTodo={handleAddTodo}
          handleInputChange={handleInputChange}
          newTodoTitle={newTodoTitle}
          tempTodo={tempTodo}
          todos={todos}
        />

        <TodoList
          visibleTodos={visibleTodos}
          handleDeleteTodo={handleDeleteTodo}
          handleTodoStatusChange={handleTodoStatusChange}
          loadingTodoIds={loadingTodoIds}
          tempTodo={tempTodo}
          updateTodo={updateTodo}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <Footer
            completedTodos={completedTodos}
            notCompletedTodos={notCompletedTodos}
            filter={filter}
            setFilter={setFilter}
            handleClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Errors handleErrorClose={handleErrorClose} error={error} />
    </div>
  );
};
