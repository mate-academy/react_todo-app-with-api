/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './component/Header/Header';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { TodoItem } from './component/TodoItem/TodoItem';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('all');
  const [todo, setTodo] = useState<Todo>();
  const [todosIsLoading, setTodosIsLoading] = useState<number[]>([]);
  const [isInputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {});
  }, [todosIsLoading, todos]);

  const filteredTodos = useMemo(() => {
    let fltrdTodos: Todo[] | undefined = todos;

    switch (status) {
      case 'all':
        fltrdTodos = todos;
        break;
      case 'active':
        fltrdTodos = todos?.filter(td => td.completed === false);
        break;
      case 'completed':
        fltrdTodos = todos?.filter(td => td.completed === true);
        break;
    }

    return fltrdTodos;
  }, [status, todos]);

  const handleClick = (event: React.MouseEvent) => {
    setStatus(event.currentTarget.innerHTML.toLowerCase());
  };

  //CHANGE IF
  if (error) {
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  function addTodo({ userId, title, completed }: Todo) {
    setTodo({
      id: 0,
      userId: userId,
      title: title.trim(),
      completed: completed,
    });

    setInputDisabled(true);

    return todosService
      .createTodo({ userId, title, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(e => {
        setError('Unable to add a todo');
        throw e;
      })
      .finally(() => {
        setInputDisabled(false);
        setTodo(undefined);
      });
  }

  function deleteTodo(todoId: number[]) {
    setTodosIsLoading(todoId);

    Promise.allSettled(
      todoId.map(td => todosService.deleteTodos(td).then(() => td)),
    )
      .then(values => {
        values.map(value1 => {
          if (value1.status === 'rejected') {
            setError('Unable to delete a todo');
          } else {
            setTodos(prevTodos => {
              const todoID = value1.value as number;

              return prevTodos.filter(todo1 => todo1.id !== todoID);
            });
          }
        });
      })
      .finally(() => {});
  }

  //update function, add todo.title
  function updateStatusTodo(tod: Todo[]) {
    setTodosIsLoading(tod.map(td => td.id));

    Promise.allSettled(
      tod.map(td => {
        const newTd = { ...td, completed: !td.completed };

        todosService
          .updateTodos(newTd)
          .then(() => td)
          .finally(() => setTodosIsLoading([]));
      }),
    )
      .then(values => {
        values.map(value1 => {
          if (value1.status === 'rejected') {
            setError('Unable to update a todo');
          } else {
            setTodos(prevTodos => {
              return prevTodos.map(todo1 => todo1);
            });
          }
        });
      })
      .finally(() => {});
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          setTodo={setTodo}
          onSubmit={addTodo}
          isDisabled={isInputDisabled}
          error={error}
          updateStatusTodo={updateStatusTodo}
        />

        {todos && todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            removeTodo={deleteTodo}
            todosIsLoading={todosIsLoading}
            updateStatusTodo={updateStatusTodo}
          />
        )}
        {todo && (
          <TodoItem
            todo={todo}
            removeTodo={deleteTodo}
            updateStatusTodo={updateStatusTodo}
            isLoading={todo ? true : false}
          />
        )}

        {todos && todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            handleClick={handleClick}
            deleteTodos={deleteTodo}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {/* move this component to ErrorComponent */}
      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => {
            setError('');
          }}
        />
        {/* show only one message at a time */}
        {error}
        {/* <br />
        <br />
        Unable to update a todo */}
      </div>
    </div>
  );
};
