/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodo, postTodo, updateTodo, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Error } from './components/Error';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList/TodoList';

export const App: React.FC = () => {
  const focusRef = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [todosFilter, setTodosFilter] = useState(FilterStatus.All);
  const [selectedTodo, setSelectedTodo] = useState<Todo>();
  const [todoBeingAdded, setTodoBeingAdded] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [clearInput, setClearInput] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);

  const filterTodos = (filter: string) => {
    switch (filter) {
      case FilterStatus.Active:
        return todos.filter(todo => !todo.completed);
      case FilterStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = filterTodos(todosFilter);

  const showError = useCallback((errMessage: string) => {
    if (errMessage) {
      setErrorMessage(errMessage);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, []);

  const getCompletedTodos = useCallback(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);

  const getAndShowTodos = useCallback(() => {
    getTodos()
      .then(toDos => {
        setTodos(toDos);
      })
      .catch(() => {
        showError('Unable to load todos');
      })
      .finally(() => focusRef.current?.focus());
  }, [showError]);

  const postNewTodo = useCallback(
    (todoToPost: Todo | null) => {
      if (todoToPost) {
        setTodoBeingAdded(true);
        setTempTodo({
          id: 0,
          userId: 2400,
          title: todoToPost.title,
          completed: todoToPost.completed,
        });

        postTodo(todoToPost)
          .then(postedTodo => {
            setTodos([...(todos || []), postedTodo]);
            setClearInput(true);
          })
          .catch(() => {
            showError('Unable to add a todo');
          })
          .finally(() => {
            setTodoBeingAdded(false);
            setTempTodo(null);
            focusRef.current?.focus();
          });
      }
    },
    [todos, showError],
  );

  const deleteChosenTodo = useCallback(
    async (currentTodoToDelete: Todo | null) => {
      if (!currentTodoToDelete) {
        return;
      }

      try {
        await deleteTodo(currentTodoToDelete);
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== currentTodoToDelete.id),
        );
        if (currentTodoToDelete === selectedTodo) {
          setSelectedTodo(undefined);
        } else {
          focusRef.current?.focus();
        }
      } catch {
        showError('Unable to delete a todo');
      }
    },
    [showError, selectedTodo],
  );

  const deleteCompletedTodos = useCallback(() => {
    const completedTodos = getCompletedTodos();

    completedTodos.forEach(todo => {
      deleteChosenTodo(todo);
    });

    focusRef.current?.focus();
  }, [getCompletedTodos, deleteChosenTodo]);

  const updateChosenTodo = useCallback(
    (todoSetToUpdate: Todo | null) => {
      if (todoSetToUpdate) {
        updateTodo(todoSetToUpdate)
          .then(() => {
            setTodos(
              todos?.map(todo =>
                todo.id === todoSetToUpdate.id ? todoSetToUpdate : todo,
              ),
            );
          })
          .catch(() => {
            showError('Unable to update a todo');
          })
          .finally(() => {
            if (todoSetToUpdate === selectedTodo) {
              setSelectedTodo(undefined);
            }

            focusRef.current?.focus();
          });
      }
    },
    [todos, showError, selectedTodo],
  );

  const toggleTodoCompletedStatus = useCallback(async () => {
    let completed = false;

    if (getCompletedTodos() && getCompletedTodos().length < todos.length) {
      completed = true;
    }

    const results = await Promise.allSettled(
      todos.map(todo => {
        if (todo.completed !== completed) {
          updateTodo({
            id: todo.id,
            title: todo.title,
            userId: 2400,
            completed: completed,
          });
        }
      }),
    );

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        setTodos(prevTodos =>
          prevTodos.map(t => ({
            ...t,
            completed: completed,
          })),
        );
      } else {
        showError('Unable to update a todo');
      }
    });
    setTimeout(() => {
      setTogglingIds([]);
    }, 100);

    focusRef.current?.focus();
  }, [showError, todos, getCompletedTodos]);

  useEffect(() => {
    if (!todoBeingAdded) {
      focusRef.current?.focus();
    }
  }, [todoBeingAdded]);

  useEffect(() => {
    getAndShowTodos();
  }, [getAndShowTodos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          focusRef={focusRef}
          todos={todos}
          postNewTodo={postNewTodo}
          showError={showError}
          todoBeingAdded={todoBeingAdded}
          clearInput={clearInput}
          setClearInput={setClearInput}
          toggleTodoCompletedStatus={toggleTodoCompletedStatus}
          setTogglingIds={setTogglingIds}
        />

        <TodoList
          filteredTodos={filteredTodos}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          deleteChosenTodo={deleteChosenTodo}
          tempTodo={tempTodo}
          updateChosenTodo={updateChosenTodo}
          deletingIds={deletingIds}
          togglingIds={togglingIds}
        />

        {todos.length !== 0 && (
          <Footer
            todos={todos}
            todosFilter={todosFilter}
            setTodosFilter={setTodosFilter}
            deleteCompletedTodos={deleteCompletedTodos}
            setDeletingIds={setDeletingIds}
          />
        )}
      </div>

      <Error errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
    </div>
  );
};
