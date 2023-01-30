/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { NewTodos } from './components/NewTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { todoApi } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import {
  getFilterTodos,
  getCompletedTodosIds,
} from './components/helpers/helpers';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [
    filterType,
    setFilterType,
  ] = useState<FilterType>(FilterType.All);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [removingTodosIds, setRemovingTodosIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodosIds] = useState<number[]>([]);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showErrorMessage('Can\'t load todos!');
        });
    }
  }, [isAddingTodo]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    try {
      setIsAddingTodo(true);
      setTempTodo({
        ...fieldsForCreate,
        id: 0,
      });

      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showErrorMessage('Unable to add a todo');

      throw Error('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [showErrorMessage]);

  const onDeleteTodo = useCallback(async (todoId: number) => {
    try {
      setRemovingTodosIds(prev => [...prev, todoId]);

      await todoApi.removeTodos(todoId);

      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch {
      showErrorMessage('Unable to delete a todo');
    } finally {
      setRemovingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  }, [showErrorMessage]);

  const onDeleteCompleted = useCallback(async () => {
    const completedTodosIds = getCompletedTodosIds(todos);

    completedTodosIds.forEach(id => onDeleteTodo(id));
  }, [onDeleteTodo, todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    updateData: Partial<Pick<Todo, 'title' | 'completed'>>
  ) => {
    setUpdatingTodosIds(prev => {
      if (!prev.includes(todoId)) {
        return [...prev, todoId]
      }

      return prev;
    });
    try {
      await todoApi.updateTodo(todoId, updateData);
      setTodos(prev => prev.map(todo => {
        if (todo.id !== todoId) {
          return todo;
        }

        return Object.assign(todo, updateData)
      }));
    } catch {
      showErrorMessage('Unable to update todo')
    } finally {
      setUpdatingTodosIds(prev => prev.
        filter(id => id !== todoId))
    };
  }, [showErrorMessage]);

  const incompleteTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const amountOfCompletedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filterTodos = useMemo(() => {
    return getFilterTodos(todos, filterType);
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <NewTodos
          newTodoField={newTodoField}
          showErrorMessage={showErrorMessage}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
          userId={user?.id}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={filterTodos}
              tempTodo={tempTodo}
              onRemoveTodo={onDeleteTodo}
              removingTodosIds={removingTodosIds}
              updateTodo={updateTodo}
              updatingTodoIds={updatingTodoIds}
            />

            <Footer
              incompleteTodos={incompleteTodos}
              amountOfCompletedTodos={amountOfCompletedTodos}
              filterType={filterType}
              setFilterType={setFilterType}
              onDeleteCompleted={onDeleteCompleted}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}

      </div>
    </div>
  );
};
