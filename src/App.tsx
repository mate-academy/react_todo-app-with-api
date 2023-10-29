/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, {
  FormEvent,
  useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';

import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';

const USER_ID = 11569;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | [] >([]);
  const [isLoading, setIsLoading] = useState<number[] | []>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');
  const [addTodoForm, setAddTodoForm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const allTodosCompleted = todos.every((v) => v.completed);
  const todoCounter: number = todos
    .filter(todo => todo.completed === false).length;

  const completedTodosCounter = todos
    .filter(todo => todo.completed === true).length;

  useEffect(() => {
    getTodos(USER_ID)
      .then((data) => {
        const todosData = data;

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

  const deleteTodoHandler = (todoId: number) => {
    setIsLoading([...isLoading, todoId]);

    deleteTodo(todoId).then(() => {
      setTodos(todos.filter(todo => todo.id !== todoId));
    }).catch(() => {
      setError('Unable to delete a todo');
    }).finally(() => {
      setIsLoading(isLoading.filter(id => id !== todoId));
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTodoSubmitHandler(event);
    }
  };

  const updateStatusHandler = (todo: Todo): void => {
    const newTodo: Todo = { ...todo };

    const changedTodo: Todo | undefined = todos.find(t => t.id === todo.id);

    if (changedTodo) {
      setIsLoading([...isLoading, changedTodo.id]);
    }

    patchTodo(newTodo, { completed: !newTodo.completed }).then(() => {
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
    }).catch(() => {
      setError('Unable to update a todo');
    }).finally(() => {
      setIsLoading(isLoading.filter(id => id !== changedTodo?.id));
    });
  };

  const toggleToCompleted = () => {
    const uncompletedTodos = todos
      .filter(todo => todo.completed === false);

    const uncompletedTodosId = uncompletedTodos.map(t => t.id);

    const succesToggle: Todo[] = [];
    const successId: number[] = succesToggle.map(t => t.id);

    const todosToLoading = uncompletedTodos.map(item => item.id);

    setIsLoading((prev) => [...prev, ...todosToLoading]);

    Promise.allSettled(
      uncompletedTodos.map((v) => patchTodo(v, { completed: true })),
    ).then(result => {
      result.forEach((v, index) => {
        if (v.status === 'fulfilled') {
          successId.push(uncompletedTodosId[index]);
        } else {
          setError('Unable to update a Todo');
        }
      });
    }).then(() => {
      const updatedTodos = todos.map(t => {
        if (successId.includes(t.id)) {
          return { ...t, completed: true };
        }

        return t;
      });

      setTodos(updatedTodos);
    }).finally(() => {
      setIsLoading([]);
    });
  };

  const toggleToUncompleted = () => {
    const uncompletedTodos = todos
      .filter(todo => todo.completed === true);

    const uncompletedTodosId = uncompletedTodos.map(t => t.id);

    const succesToggle: Todo[] = [];
    const successId: number[] = succesToggle.map(t => t.id);

    const todosToLoading = uncompletedTodos.map(item => item.id);

    setIsLoading((prev) => [...prev, ...todosToLoading]);

    Promise.allSettled(
      uncompletedTodos.map((v) => patchTodo(v, { completed: false })),
    ).then(result => {
      result.forEach((v, index) => {
        if (v.status === 'fulfilled') {
          successId.push(uncompletedTodosId[index]);
        } else {
          setError('Unable to update a Todo');
        }
      });
    }).then(() => {
      const updatedTodos = todos.map(t => {
        if (successId.includes(t.id)) {
          return { ...t, completed: false };
        }

        return t;
      });

      setTodos(updatedTodos);
    }).finally(() => {
      setIsLoading([]);
    });
  };

  const clearCompletedHandler = () => {
    const todosToDelete = todos.filter(todo => todo.completed);
    const deleteId = todosToDelete.map(item => item.id);
    const sucessDeleteId: number[] = [];

    setIsLoading((loading) => [...loading, ...deleteId]);

    Promise.allSettled(
      deleteId.map((id) => deleteTodo(id)),
    ).then(result => {
      result.forEach((v, index) => {
        if (v.status === 'fulfilled') {
          sucessDeleteId.push(deleteId[index]);
        } else {
          setError('Unable to delete a todo');
        }
      });
    }).then(() => {
      setTodos(todos.filter(t => !sucessDeleteId.includes(t.id)));
    }).finally(() => {
      setIsLoading([]);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              data-cy="ToggleAllButton"
              onClick={todoCounter === 0
                ? toggleToUncompleted
                : toggleToCompleted}
              className={cn('todoapp__toggle-all', {
                active: allTodosCompleted,
              })}
            />
          )}

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
          toggleToCompleted={toggleToCompleted}
          setError={setError}
        />

        {todos.length > 0
         && (
           <footer className="todoapp__footer" data-cy="Footer">
             <span className="todo-count" data-cy="TodosCounter">
               {todoCounter}
               {' '}
               items left
             </span>

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

             <button
               type="button"
               className="todoapp__clear-completed "
               data-cy="ClearCompletedButton"
               disabled={completedTodosCounter === 0}
               onClick={clearCompletedHandler}

             >
               Clear completed
             </button>

           </footer>
         )}

      </div>

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
    </div>
  );
};
