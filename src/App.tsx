/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { TodoItem } from './components/TodoItem/TodoItem';
import { ErrorMessage } from './components/ErrorMessage/ErrorMesage';
import { FilterStatus } from './types/FilterStatus';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const [isLoadingError, setIsLoadingError] = useState('');
  const [isAddError, setIsAddError] = useState('');
  const [isUpdateError, setIsUpdateError] = useState('');
  const [isDeleteError, setIsDeleteError] = useState('');

  const [status, setStatus] = useState<FilterStatus>(FilterStatus.All);
  const [todo, setTodo] = useState<Todo>();
  const [todosIsLoading, setTodosIsLoading] = useState<number[]>([]);
  const [isInputDisabled, setInputDisabled] = useState(false);
  const [isFocus, setIsFocus] = useState(true);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setIsLoadingError('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case FilterStatus.All:
        return todos;
      case FilterStatus.Active:
        return todos.filter(td => !td.completed);
      case FilterStatus.Completed:
        return todos.filter(td => td.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const clicked = event.currentTarget.textContent?.toLowerCase();

    switch (clicked) {
      case 'all':
        setStatus(FilterStatus.All);
        break;
      case 'active':
        setStatus(FilterStatus.Active);
        break;
      case 'completed':
        setStatus(FilterStatus.Completed);
        break;
      default:
        setStatus(FilterStatus.All);
    }
  };

  const addTodo = ({ userId, title, completed }: Todo) => {
    setTodo({
      id: 0,
      userId: userId,
      title: title.trim(),
      completed: completed,
    });

    setInputDisabled(true);

    return todosService
      .createTodo({ userId, title, completed })
      .then((newTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(e => {
        setIsAddError('Unable to add a todo');
        throw e;
      })
      .finally(() => {
        setInputDisabled(false);
        setTodo(undefined);
      });
  };

  const deleteTodo = (todoId: number[], isInUpdate: boolean) => {
    setIsFocus(false);
    setTodosIsLoading(todoId);

    Promise.allSettled(
      todoId.map(td => todosService.deleteTodos(td).then(() => td)),
    )
      .then(values => {
        const deletedIds = values
          .filter(value1 => value1.status === 'fulfilled')
          .map(value1 => (value1 as PromiseFulfilledResult<number>).value);
        const anyRejected = values.some(value1 => value1.status === 'rejected');

        if (anyRejected) {
          setIsDeleteError('Unable to delete a todo');

          if (isInUpdate) {
            setIsFocus(false);
          }
        } else {
          setIsFocus(true);
        }

        setTodos(prevTodos =>
          prevTodos.filter(todo1 => !deletedIds.includes(todo1.id)),
        );
      })
      .finally(() => {
        setTodosIsLoading([]);
      });
  };

  async function updateStatusTodo(tod: Todo[]) {
    setIsFocus(false);
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
          setIsAddError={setIsAddError}
          setTodo={setTodo}
          onSubmit={addTodo}
          isDisabled={isInputDisabled}
          isAddError={isAddError}
          isFocus={isFocus}
          updateStatusTodo={updateStatusTodo}
        />

        {todos.length > 0 && (
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
            isLoading={true}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            status={status}
            handleClick={handleClick}
            deleteTodos={deleteTodo}
          />
        )}
      </div>

      <ErrorMessage
        isAddError={isAddError}
        setIsAddError={setIsAddError}
        isUpdateError={isUpdateError}
        setIsUpdateError={setIsUpdateError}
        isDeleteError={isDeleteError}
        setIsDeleteError={setIsDeleteError}
        isLoadingError={isLoadingError}
        setIsLoadingError={setIsLoadingError}
      />
    </div>
  );
};
