/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, patchTodos, USER_ID } from './api/todos';
import { ErrorMessage, FilteredStatus, Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import cn from 'classnames';
import { FormAddTodo } from './components/FormAddTodo';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [rrorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT,
  );
  const [count, setCount] = useState<number>(0);
  const [filterValue, setFilterValue] = useState<FilteredStatus>(
    FilteredStatus.ALL,
  );
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | undefined>();
  const [activeToggleButton, setActiveToggleButton] = useState<boolean>(false);
  let quan = 0;

  useEffect(() => {
    for (let i = 0; i < todos.length; i++) {
      if (todos[i].completed) {
        quan++;
      }
    }

    if (quan === todos.length) {
      setActiveToggleButton(true);
    } else {
      setActiveToggleButton(false);
    }
  }, [quan, setActiveToggleButton, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD);
        setTimeout(() => {
          setErrorMessage(ErrorMessage.DEFAULT);
        }, 3000);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const onHandler = () => {
    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage(ErrorMessage.DEFAULT);
  };

  const onInputChange = (
    todoId: number,
    change: string,
    value?: HTMLInputElement['value'],
  ) => {
    const seekTodo = todos.find(todo => todo.id === todoId);

    if (change === 'status') {
      const backStatus = seekTodo?.completed;
      const changArg = { completed: !backStatus };

      patchTodos(todoId, changArg)
        .then(response => {
          const mappedTodos: Todo[] = todos.map(todo => {
            if (todo.id === todoId) {
              return response as Todo;
            }

            return todo;
          });

          setTodos(mappedTodos);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UPDATE);
        })
        .finally(() =>
          setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)),
        );
    }

    if (change === 'title') {
      const changArg = { title: value };

      if (changArg.title === 'no changes') {
        setEditingTodoId(undefined);

        return;
      }

      setDeletedTodoId(prevIds => [...prevIds, todoId]);

      if (changArg.title === '') {
        deleteTodos(todoId)
          .then(() => {
            inputRef.current?.focus();
            const exsistedTodos = todos.filter(todo => todo.id !== todoId);

            setTodos(exsistedTodos);
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.DELETE);
            setTimeout(() => {
              setErrorMessage(ErrorMessage.DEFAULT);
            }, 3000);
          })
          .finally(() =>
            setDeletedTodoId(prevIds => prevIds.filter(id => id !== todoId)),
          );

        return;
      }

      patchTodos(todoId, changArg)
        .then(response => {
          const mappedTodos: Todo[] = todos.map(todo => {
            if (todo.id === todoId) {
              return response as Todo;
            }

            return todo;
          });

          setTodos(mappedTodos);
          setEditingTodoId(undefined);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.UPDATE);

          setTimeout(() => {
            setErrorMessage(ErrorMessage.DEFAULT);
          }, 3000);
        })
        .finally(() => {
          setDeletedTodoId(prevIds => prevIds.filter(item => item !== todoId));
        });
    }
  };

  const toggleHandler = () => {
    const notCompletedTodos = todos.filter(todo => !todo.completed);
    const allCompleted = todos.every(todo => todo.completed);
    const todosToUpdate = allCompleted ? todos : notCompletedTodos;
    const toggleTodosIds: number[] = todosToUpdate.map(todo => todo.id);

    setDeletedTodoId(prev => [...prev, ...toggleTodosIds]);
    Promise.allSettled(
      todosToUpdate.map(todo =>
        patchTodos(todo.id, { completed: !todo.completed }),
      ),
    )
      .then(results => {
        const updatedTodos = todos.map(todo => {
          const index = todosToUpdate.findIndex(t => t.id === todo.id);
          const result = results[index];

          if (result?.status === 'fulfilled') {
            return {
              ...todo,
              completed: !todo.completed,
            };
          }

          return todo;
        });

        setTodos(updatedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UPDATE);
      })
      .finally(() => {
        setDeletedTodoId(prev =>
          prev.filter(id => !toggleTodosIds.includes(id)),
        );
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length !== 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: activeToggleButton,
              })}
              data-cy="ToggleAllButton"
              onClick={() => toggleHandler()}
            />
          )}

          {/* Add a todo on form submit */}
          <FormAddTodo
            onSubmit={handleSubmit}
            setTodos={setTodos}
            todos={todos}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            tempTodo={tempTodo}
            inputRef={inputRef}
          />
        </header>

        <TodoList
          todos={todos}
          setTodos={setTodos}
          setCount={setCount}
          filterValue={filterValue}
          onInputChange={onInputChange}
          tempTodo={tempTodo}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
          deletedTodoId={deletedTodoId}
          setDeletedTodoId={setDeletedTodoId}
          editingTodoId={editingTodoId}
          setEditingTodoId={setEditingTodoId}
        />

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            count={count}
            filterValue={filterValue}
            setFilterValue={setFilterValue}
            todos={todos}
            setTodos={setTodos}
            inputRef={inputRef}
            setErrorMessage={setErrorMessage}
            setDeletedTodoId={setDeletedTodoId}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !rrorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onHandler}
        />
        {/* show only one message at a time */}
        {rrorMessage}
      </div>
    </div>
  );
};
