/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo, deleteTodo, getTodo, getTodos, patchTodo,
} from './api/todos';

import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

// const USER_ID = 11569;
const USER_ID = 11569;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] >([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState<number[] | []>([]);

  const [statusFilter, setStatusFilter] = useState('all');

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState('');

  const [addTodoForm, setAddTodoForm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const todoCounter: number = todos
    .filter(todo => todo.completed === false).length;

  const completedTodosCounter = todos
    .filter(todo => todo.completed === true).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        const todosData = data as Todo[];

        setTodos(todosData);
        setTodos(data);
      })
      .catch(() => {
        setError('Unable to load todos');
        setTimeout(() => {
          setError('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, isLoading]);

  useEffect(() => {

  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const displayTodos = useMemo(() => {
    return todos.filter(todo => {
      if (statusFilter === 'active' && todo.completed) {
        return false;
      }

      if (statusFilter === 'completed' && !todo.completed) {
        return false;
      }

      return true;
    });
  }, [statusFilter, todos, todoCounter, isLoading]);

  // const focusInput = () => {
  //   inputRef.current.focus();
  // };

  const addTodoSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    const title = addTodoForm.trim();

    if (!title) {
      setError('Title should not be empty');
      setTimeout(() => {
        setError('');
      }, 3000);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });
    setIsSubmitting(true);

    addTodo(newTodo)
      .then(response => {
        setTodos([...todos, response] as Todo[]);
        setAddTodoForm('');
        setIsSubmitting(false);
      })
      .catch(() => {
        setError('Unable to add a todo');
        setTimeout(() => {
          setError('');
        }, 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const deleteTodoHandler = async (todoId: number) => {
    setIsLoading([...isLoading, todoId]);

    try {
      await getTodo(todoId);
      await deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch (e) {
      setError('Unable to delete a todo');
    } finally {
      setTimeout(() => {
        setIsLoading(todos.filter(todo => todo.id !== todoId) as number[] | []);
      }, 0);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodoSubmitHandler(event);
    }
  };

  const updateStatusHandler = (todo: Todo, data: {}) => {
    const changedTodo = todos.find(t => t.id === todo.id);

    setIsLoading([...isLoading, changedTodo.id]);

    patchTodo(todo, data);

    setTimeout(() => {
      setIsLoading([]);
    }, [300]);

    const updatedTodos = todos.map(prev => {
      if (prev.id === todo.id) {
        return {
          ...prev,
          completed: !prev.completed,
        };
      }

      return prev;
    });

    setTodos(updatedTodos);
  };

  const toggleAllHandler = async () => {
    if (todoCounter) {
      const uncompletedTodos = todos
        .filter(todo => todo.completed === false);

      const todosToLoading = uncompletedTodos.map(item => item.id);

      setIsLoading((prev) => [...prev, ...todosToLoading]);

      setTimeout(() => {
        Promise.allSettled(
          uncompletedTodos.map((v) => patchTodo(v, { completed: true })),
        );
        setIsLoading([]);

        const updatedTodos = todos.map(prev => {
          if (todosToLoading.includes(prev.id)) {
            return {
              ...prev,
              completed: !prev.completed,
            };
          }

          return prev;
        });

        setTodos(updatedTodos);
      }, [500]);

      // uncompletedTodos.map(item => updateStatusHandler(item, { completed: !item.completed }))
    } else {
      const uncompletedTodos = todos
        .filter(todo => todo.completed === true);

      const todosToLoading = uncompletedTodos.map(item => item.id);

      setIsLoading((prev) => [...prev, ...todosToLoading]);

      setTimeout(() => {
        Promise.allSettled(
          uncompletedTodos.map((v) => patchTodo(v, { completed: false })),
        );
        setIsLoading([]);

        const updatedTodos = todos.map(prev => {
          if (todosToLoading.includes(prev.id)) {
            return {
              ...prev,
              completed: !prev.completed,
            };
          }

          return prev;
        });

        setTodos(updatedTodos);
      }, [500]);
    }
  };

  const clearCompletedHandler = () => {
    const todosToDelete = todos.filter(todo => todo.completed);
    const deleteId = todosToDelete.map(item => item.id);

    setIsLoading((loading) => [...loading, ...deleteId]);

    setTimeout(() => {
      Promise.allSettled(
        deleteId.map((id) => deleteTodo(id)),
      );
      setIsLoading([]);

      const updatedTodos = todos.filter(todo => !todo.completed);

      setTodos(updatedTodos);
    }, [500]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
            onClick={toggleAllHandler}
          />

          {/* Add a todo on form submit */}
          <form>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={addTodoForm}
              onChange={(e) => setAddTodoForm(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}

            />
          </form>

        </header>

        <TodoList
          displayTodos={displayTodos}
          tempTodo={tempTodo}
          deleteTodoHandler={deleteTodoHandler}
          isLoading={isLoading}
          updateStatusHandler={updateStatusHandler}
          setTodos={setTodos}
          todos={todos}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length > 0
         && (
           <footer className="todoapp__footer" data-cy="Footer">
             <span className="todo-count" data-cy="TodosCounter">
               {todoCounter}
               {' '}
               items left
             </span>

             {/* Active filter should have a 'selected' class */}
             <nav className="filter" data-cy="Filter">
               <a
                 href="#/"
                 className={`filter__link ${statusFilter === 'all' ? 'selected' : ''}`}
                 data-cy="FilterLinkAll"
                 onClick={() => setStatusFilter('all')}
               >
                 All
               </a>

               <a
                 href="#/active"
                 className={`filter__link ${statusFilter === 'active' ? 'selected' : ''}`}
                 data-cy="FilterLinkActive"
                 onClick={() => setStatusFilter('active')}
               >
                 Active
               </a>

               <a
                 href="#/completed"
                 className={`filter__link ${statusFilter === 'completed' ? 'selected' : ''}`}
                 data-cy="FilterLinkCompleted"
                 onClick={() => setStatusFilter('completed')}
               >
                 Completed
               </a>
             </nav>

             {/* don't show this button if there are no completed todos */}

             <button
               type="button"
               className="todoapp__clear-completed "
               data-cy="ClearCompletedButton"
               style={
                 {
                   visibility: completedTodosCounter > 0
                     ? 'visible'
                     : 'hidden',
                 }
               }
               onClick={clearCompletedHandler}

             >
               Clear completed
             </button>

           </footer>
         )}

      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!error && 'hidden'}`}
      >

        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>

      {/* show only one message at a time */}
      {/* {errorUnableToLoad && <p>Unable to load todos</p>}
        {errorUnableToLoad && <p>Title should not be empty</p>}
        {errorUnableToLoad && <p>Unable to add a todo</p>}
        {errorUnableToLoad && <p>Unable to delete a todo</p>}
        {errorUnableToLoad && <p>Unable to update a todo</p>} */}

    </div>
  );
};
