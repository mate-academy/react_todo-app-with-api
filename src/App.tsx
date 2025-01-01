/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos'
import * as todosServices from '../src/api/todos';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import Error from './components/Error/Error';
import { FilterType } from './types/FilterType';
import cn from 'classnames';


enum ErrorMessages {
  loadTodos = 'Unable to load todos',
  emptyTitle = 'Title should not be empty',
  addTodo = 'Unable to add a todo',
  deleteTodo = 'Unable to delete a todo',
  updateTodo = 'Unable to update a todo',
}

const getFilteredTodos = (todos: Todo[], filterBy: FilterType): Todo[] => {
  switch (filterBy) {
    case FilterType.active:
      return todos.filter(todo => !todo.completed);
    case FilterType.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<ErrorMessages | null>(null);
  const [filterBy, setFilterBy] = useState<FilterType>(FilterType.all);
  const [todosCounter, setTodosCounter] = useState(0);
  const [toBeDone, setToBeDone] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);
  const [toggleId, setToggleId] = useState<number | null>(null);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    todosServices
      .getTodos().then(setTodos)
      .catch(() => {
        setError(ErrorMessages.loadTodos);

        window.setTimeout(() => setError(null), 3000);
      });
  }, []);


  useEffect(() => {
    const notCompletedTodos = todos.filter(todo => !todo.completed).length;
    setTodosCounter(notCompletedTodos);
  }, [todos]);


  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!toBeDone.trim()) {
      setError(ErrorMessages.emptyTitle);

      window.setTimeout(() => setError(null), 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: toBeDone.trim(),
      completed: false,
    };


    setTempTodo(newTempTodo);
    setLoading(true);

    todosServices
      .addTodo(newTempTodo)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
        setTempTodo(null);
        setToBeDone('');

        window.setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

      })
      .catch(() => {
        setError(ErrorMessages.addTodo);
        setTempTodo(null);

        window.setTimeout(() => {
          inputRef.current?.focus();
        }, 0);

        window.setTimeout(() => setError(null), 3000);

      }).finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }, [toBeDone, setTodos, setError]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );


  const handleDeleteTodo = useCallback(
    (todoId: number,  onFail: () => void) => {

      setLoadingTodoId(todoId);

      todosServices
        .deleteTodo(todoId.toString())
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
          window.setTimeout(() => {
            inputRef.current?.focus();
          }, 0);
        })
        .catch(() => {
          setError(ErrorMessages.deleteTodo);
          onFail();

          window.setTimeout(() => setError(null), 3000);
        })

        .finally(() => {
          setLoadingTodoId(null);
        });
    },
    [setTodos],
  );


  const handleDeleteCompletedTodos = useCallback(() => {
    const completedTodos = todos.filter((todo) => todo.completed);

    Promise.all(
      completedTodos.map((todo) =>
        todosServices
          .deleteTodo(todo.id.toString())
          .then(() => {
            setTodos((currentTodos) =>
              currentTodos.filter((currentTodo) => currentTodo.id !== todo.id));
            window.setTimeout(() => {
              inputRef.current?.focus();
            }, 0);
          })
          .catch(() => {
            setError(ErrorMessages.deleteTodo);
            window.setTimeout(() => setError(null), 3000);
          })
      )
    )
  }, [todos, setTodos]);



  const handleUpdateTodo = useCallback((updatedTodo: Todo, onFail: () => void) => {

    setLoadingTodoId(updatedTodo.id);

    todosServices
      .patchTodo(updatedTodo.id.toString(), updatedTodo)
      .then(() => {
        setTodos(currentTodos => currentTodos.map(todo => todo.id === updatedTodo.id ? updatedTodo : todo));
        setLoadingTodoId(null);
      })
      .catch(() => {
        setError(ErrorMessages.updateTodo);
        onFail();

        window.setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setLoadingTodoId(null)
      });
  }, []);


  const handleToggleTodo = useCallback((idToBeToggled: number, todoToBeToggled: Todo) => {
    setToggleId(idToBeToggled);
    setLoading(true);

    const updatedTodo = {
      ...todoToBeToggled,
      completed: !todoToBeToggled.completed,
    };

    todosServices
      .patchTodo(idToBeToggled.toString(), updatedTodo)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === idToBeToggled ? updatedTodo : todo
          )
        );

        setToggleId(null);
      })
      .catch(() => {
        setError(ErrorMessages.updateTodo);

        window.setTimeout(() => setError(null), 3000);
      })
      .finally(() => {
        setToggleId(null);
        setLoading(false);
      });
  }, []);


  const handleToggleAllTodosCompletion = useCallback(() => {
    setLoading(true);

    const allCompleted = todos.every((todo) => todo.completed);
    const todosToUpdate = todos.filter(
      (todo) => todo.completed !== (allCompleted ? false : true)
    );

    setUpdatingTodos(todosToUpdate.map(todo => todo.id));

    Promise.all(
      todosToUpdate.map((todo) =>
        todosServices
          .patchTodo(todo.id.toString(), { completed: !allCompleted })
          .then(() => {
            setTodos((currentTodos) =>
              currentTodos.map((currentTodo) =>
                currentTodo.id === todo.id
                  ? { ...currentTodo, completed: !allCompleted }
                  : currentTodo
              )
            );
          })
          .catch(() => {
            setError(ErrorMessages.updateTodo);
            window.setTimeout(() => setError(null), 3000);
          })
          .finally(() => {
            setUpdatingTodos((currentUpdatingTodos) =>
              currentUpdatingTodos.filter(id => id !== todo.id)
            );
          })
      )
    ).finally(() => {
      setLoading(false);
    });
  }, [todos, setTodos]);


  const handleSetFilter = useCallback((filter: FilterType) => {
    setFilterBy(filter);
  }, []);


  const handleCloseErrorMsg = useCallback(() => {
    setError(null);
  }, []);


  if (!USER_ID) {
    return (
      <div className="todoapp">
        <UserWarning />
      </div>
    );
  }


  const filteredTodos = getFilteredTodos(todos, filterBy);


  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={cn("todoapp__toggle-all", {
                "active": todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAllTodosCompletion}
            />
          )}

          <form onSubmit={handleSubmit} onKeyDown={handleKeyPress}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={toBeDone}
              onChange={(e) => setToBeDone(e.target.value)}
              disabled={loading}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          handleDeleteTodo={handleDeleteTodo}
          loading={loading}
          tempTodo={tempTodo}
          handleUpdateTodo={handleUpdateTodo}
          loadingTodoId={loadingTodoId}
          handleToggleTodo={handleToggleTodo}
          toggleId={toggleId}
          updatingTodos={updatingTodos}
        />
        {!!todos.length && (
          <Footer
            filterBy={filterBy}
            todosCounter={todosCounter}
            handleSetFilter={handleSetFilter}
            todos={filteredTodos}
            handleDeleteCompletedTodos={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Error error={error} handleCloseErrorMsg={handleCloseErrorMsg} />
    </div>
  );
};
