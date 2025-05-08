/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './component/Header/Header';
import { TodoList } from './component/TodoList/TodoList';
import { Footer } from './component/Footer/Footer';
import { TodoItem } from './component/TodoItem/TodoItem';
import { ErrorComponent } from './component/Error/ErrorComponent';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [isUpdateError, setIsUpdateError] = useState('');
  const [isDeleteError, setIsDeleteError] = useState('');
  const [status, setStatus] = useState('all');
  const [todo, setTodo] = useState<Todo>();
  const [todosIsLoading, setTodosIsLoading] = useState<number[]>([]);
  const [isInputDisabled, setInputDisabled] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {});
  }, []);

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
    setIsDeleted(true);

    Promise.allSettled(
      todoId.map(td => todosService.deleteTodos(td).then(() => td)),
    )
      .then(values => {
        const deletedIds = values
          .filter(value1 => value1.status === 'fulfilled')
          .map(value1 => (value1 as PromiseFulfilledResult<number>).value);
        const anyRejected = values.some(value1 => value1.status === 'rejected');

        if (anyRejected) {
          setError('Unable to delete a todo');
          setIsDeleteError('Unable to delete a todo');
        }

        setTodos(prevTodos => {
          return prevTodos.filter(todo1 => !deletedIds.includes(todo1.id));
        });
      })
      .finally(() => {
        setTodosIsLoading([]);
        setIsDeleted(false);
      });
  }

  async function updateStatusTodo(tod: Todo[]) {
    setTodosIsLoading(tod.map(td => td.id));
    const results = await Promise.allSettled(
      tod.map(td => {
        const newTd = { ...td, completed: !td.completed };

        return todosService.updateTodos(newTd).then(() => newTd);
      }),
    );

    setTodosIsLoading([]);
    const errors = results.filter(r => r.status === 'rejected');

    if (errors.length > 0) {
      setIsUpdateError('Unable to update a todo');
      throw new Error('Unable to update a todo');
    }

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const updatedTodo = result.value as Todo;

        setTodos(prevTodos =>
          prevTodos.map(todo1 =>
            todo1.id === updatedTodo.id ? { ...updatedTodo } : todo1,
          ),
        );
      }
    });
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
          isDeleted={isDeleted}
          error={error}
          updateStatusTodo={updateStatusTodo}
        />

        {todos && todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            removeTodo={deleteTodo}
            todosIsLoading={todosIsLoading}
            updateStatusTodo={updateStatusTodo}
            // isDeleted={isDeleted}
          />
        )}
        {todo && (
          <TodoItem
            todo={todo}
            removeTodo={deleteTodo}
            updateStatusTodo={updateStatusTodo}
            isLoading={todo ? true : false}
            // isDeleted={isDeleted}
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
      <ErrorComponent
        isError={error}
        setError={setError}
        isUpdateError={isUpdateError}
        setIsUpdateError={setIsUpdateError}
        isDeleteError={isDeleteError}
        setIsDeleteError={setIsDeleteError}
      />
    </div>
  );
};
