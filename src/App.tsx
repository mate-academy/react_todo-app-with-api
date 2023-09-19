import classNames from 'classnames';
import React, { useEffect, useMemo, useState } from 'react';
import * as todosService from './api/todos';

import { TodoHeader } from './components/TodoHeader';
import { TodoBody } from './components/TodoBody';
import { TodoFooter } from './components/TodoFooter';
import { FilterBy } from './types/FilterBy';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.NULL);
  const [isProcessing, setIsProcessing] = useState<number[]>([]);

  // Request todos from server on first render
  useEffect(() => {
    todosService.getTodos(todosService.USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Errors.LOAD))
      .finally(() => setTimeout(() => setErrorMessage(Errors.NULL), 3000));
  }, []);

  // Filtering todos by FilteringBy without request on server
  const filteringBy = useMemo(() => {
    switch (filterBy) {
      case FilterBy.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FilterBy.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [filterBy, todos]);

  // Update or Edit todo on server
  const addTodo = (inputValue: string) => {
    const data = {
      id: 0,
      title: inputValue,
      completed: false,
      userId: todosService.USER_ID,
    };

    setTempTodo(data);

    return todosService.createTodo(data)
      .then(createdTodo => (
        setTodos(currentTodos => [...currentTodos, createdTodo])))
      .catch((error) => {
        setErrorMessage(Errors.ADD);
        throw error;
      })
      .finally(() => {
        setTimeout(() => setErrorMessage(Errors.NULL), 3000);
        setTempTodo(null);
      });
  };

  // Update or Edit todo on server
  const updateTodo = (todoToUpdate: Todo) => {
    setIsProcessing(currentIds => [...currentIds, todoToUpdate.id]);

    return todosService.updateTodo(todoToUpdate.id, todoToUpdate)
      .then((updatedTodo: Todo) => {
        setTodos(currentTodos => {
          const newTodos = [...currentTodos];

          const findIndexTodo = [...todos].findIndex(
            todo => todo.id === todoToUpdate.id,
          );

          newTodos.splice(findIndexTodo, 1, updatedTodo);

          return newTodos;
        });
      })
      .catch((error) => {
        setErrorMessage(Errors.UPDATE);
        throw error;
      })
      .finally(() => {
        setIsProcessing([]);
        setTimeout(() => setErrorMessage(Errors.NULL), 3000);
      });
  };

  // Delete todo from server
  const deleteTodo = (todoId: number) => {
    setIsProcessing(currentIds => [...currentIds, todoId]);

    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => setErrorMessage(Errors.DELETE))
      .finally(() => {
        setIsProcessing([]);
        setTimeout(() => setErrorMessage(Errors.NULL), 3000);
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todos={todos}
          addTodo={addTodo}
          setErrorMessage={setErrorMessage}
          updateTodo={updateTodo}
        />
        <TodoBody
          filteringBy={filteringBy}
          isProcessing={isProcessing}
          tempTodo={tempTodo}
          deleteTodo={deleteTodo}
          updateTodo={updateTodo}
        />
        <TodoFooter
          todos={todos}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          deleteTodo={deleteTodo}
        />
      </div>

      {errorMessage && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            aria-label="close-error-message"
            type="button"
            className={classNames('delete', {
              hidden: !errorMessage,
            })}
            onClick={() => {
              setErrorMessage(Errors.NULL);
            }}
          />
          {errorMessage}
        </div>

      )}
    </div>
  );
};
