/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';
import { Notification } from './components/Notification';
import { Todo } from './types/Todo';
import { ErrorType } from './types/Error';
import { FilterTypes } from './types/Filter';
import * as TodoServices from './api/todos';

const USER_ID = 11133;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState(ErrorType.None);
  const [updatingTodos, setUpdatingTodos] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterTypes>(FilterTypes.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    TodoServices.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setError(ErrorType.Load));
  }, []);

  const filteredTodos = useMemo(() => (() => {
    const visibleTodos = [...todos];

    switch (filter) {
      case FilterTypes.Active:
        return visibleTodos.filter((todo) => !todo.completed);

      case FilterTypes.Completed:
        return visibleTodos.filter((todo) => todo.completed);

      default:
        return visibleTodos;
    }
  })(), [filter, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (title: string) => {
    const temporaryTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(temporaryTodo);

    return TodoServices.addOnServer(title, USER_ID)
      .then(addedTodo => {
        setTodos(currentTodos => [...currentTodos, addedTodo]);
      })
      .catch((err) => {
        setError(ErrorType.Add);
        throw err;
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId:number) => {
    setUpdatingTodos(curId => [todoId, ...curId]);

    return TodoServices.deleteOnServer(todoId)
      .then(() => {
        setTodos(currentTodo => currentTodo.filter(todo => todo.id !== todoId));
      })
      .catch((newError) => {
        setError(ErrorType.Delete);
        throw newError;
      })
      .finally(() => {
        setUpdatingTodos([]);
      });
  };

  const updateTodo = (todoId: number, data: Partial<Todo>) => {
    setUpdatingTodos(curId => [todoId, ...curId]);

    return TodoServices.updateOnServer(todoId, data)
      .then((updatedTodo) => {
        setTodos(currentTodos => currentTodos.map(
          todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
        ));
      })
      .catch((newError) => {
        setError(ErrorType.Update);
        throw newError;
      })
      .finally(() => setUpdatingTodos([]));
  };

  const handleTodosStatus = (status: boolean) => {
    let updatedTodos = [...todos];
    const updatedTodoIds = updatedTodos.map(todo => todo.id);

    setUpdatingTodos(updatedTodoIds);

    updatedTodos = updatedTodos.map((todo) => ({ ...todo, completed: status }));

    updatedTodos.forEach(todo => TodoServices.updateOnServer(
      todo.id,
      { completed: status },
    )
      .then(() => setTodos(updatedTodos))
      .catch(() => setError(ErrorType.Update))
      .finally(() => setUpdatingTodos([])));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodo
          todos={todos}
          onAddTodo={addTodo}
          setError={setError}
          onStatusChange={handleTodosStatus}
        />

        {todos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            updatingTodos={updatingTodos}
            tempTodo={tempTodo}
            onDeleteTodo={deleteTodo}
            onUpdateTodo={updateTodo}
          />
        )}

        {todos.length > 0 && (
          <Filter
            visibletodos={todos}
            filter={filter}
            setFilter={setFilter}
            onDeleteTodo={deleteTodo}
          />
        )}
      </div>

      <Notification error={error} closeError={setError} />
    </div>
  );
};
