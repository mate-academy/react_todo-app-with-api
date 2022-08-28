/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import cn from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos,
  createNewTodo,
  removeTodo,
  updateTodo,
} from './api/todos';
import { TodoElement } from './components/TodoElement';
import { TodosFooter } from './components/TodosFooter';
import { TodoForm } from './components/TodoForm';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errMsg, setErrMsg] = useState('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [isLoadingTodos, setIsLoadingTodos] = useState<number[]>([]);

  const qtyNotCompletedTodos = useMemo(
    () => todos.filter(({ completed }) => !completed).length,
    [todos],
  );

  const visibleTodos = useMemo(
    () => todos.filter(todo => filterBy === 'all'
      || todo.completed === (filterBy === 'completed')),
    [filterBy, todos],
  );

  useEffect(() => {
    if (user) {
      setErrMsg('');
      getTodos(user.id)
        .then(setTodos)
        .catch(setErrMsg);
    }
  }, []);

  const handleErrMsg = useCallback((titileErr: string) => {
    setErrMsg(titileErr);

    setTimeout(() => setErrMsg(''), 3000);
  }, []);

  const handleCreateNewTodo = useCallback(() => {
    if (!newTodoTitle) {
      handleErrMsg('Title can\'t be empty');

      return;
    }

    const newTodo = {
      title: newTodoTitle,
      userId: user?.id as number,
      completed: false,
    };

    setErrMsg('');
    setIsLoadingTodos(prev => [...prev, -1]);
    setTodos(prevTodos => [...prevTodos, { ...newTodo, id: -1 }]);
    createNewTodo(newTodo)
      .then(res => {
        setNewTodoTitle('');
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === -1) {
            return { ...res as Todo };
          }

          return todo;
        }));
      })
      .catch(() => {
        handleErrMsg('Unable to add a todo');
        setTodos(prevTodos => prevTodos.slice(0, -1));
      })
      .finally(() => setIsLoadingTodos(prev => prev.filter(n => n !== -1)));
  }, [newTodoTitle, user]);

  const handleRemoveTodo = useCallback((id: number) => {
    setErrMsg('');
    setIsLoadingTodos(prev => [...prev, id]);
    removeTodo(id)
      .then((res) => {
        if (!res) {
          throw new Error();
        }

        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => handleErrMsg('Unable to delete a todo'))
      .finally(() => setIsLoadingTodos(prev => prev.filter(n => n !== id)));
  }, []);

  const handleChangeTodo = useCallback((id: number, data:{}) => {
    setErrMsg('');
    setIsLoadingTodos(prev => [...prev, id]);
    updateTodo(id, data)
      .then(res => {
        setIsLoadingTodos(prev => [...prev, id]);
        setTodos(prevTodos => prevTodos.map(todo => {
          if (todo.id === id) {
            return { ...res as Todo };
          }

          return todo;
        }));
      })
      .catch(() => handleErrMsg('Unable to update a todo'))
      .finally(() => setIsLoadingTodos(prev => prev.filter(n => n !== id)));
  }, []);

  const completeAll = useCallback(() => {
    if (todos.every(({ completed }) => completed)) {
      todos.forEach(
        ({ id }) => handleChangeTodo(id, { completed: false }),
      );
    } else {
      todos.forEach(({ completed, id }) => {
        if (!completed) {
          handleChangeTodo(id, { completed: true });
        }
      });
    }
  }, [todos]);

  const clearCompleted = useCallback(() => {
    todos.forEach(({ completed, id }) => {
      if (completed) {
        handleRemoveTodo(id);
      }
    });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all',
                {
                  active: !isLoadingTodos.length
                  && qtyNotCompletedTodos === 0,
                })}
              onClick={completeAll}
              disabled={!!isLoadingTodos.length}
            />
          )}

          <TodoForm
            isLoadingSomeTodo={!!isLoadingTodos.length}
            handleCreateNewTodo={handleCreateNewTodo}
            newTodoTitle={newTodoTitle}
            setNewTodoTitle={setNewTodoTitle}
          />
        </header>

        { todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoElement
                key={todo.id}
                todo={todo}
                isLoading={isLoadingTodos.includes(todo.id)}
                handleRemoveTodo={handleRemoveTodo}
                handleChangeTodo={handleChangeTodo}
                isLoadingSomeTodo={!!isLoadingTodos.length}
              />
            ))}
          </section>
        )}

        {todos.length > 0 && (
          <TodosFooter
            itemsLeft={qtyNotCompletedTodos}
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            clearCompleted={clearCompleted}
            isSomeCompleted={qtyNotCompletedTodos === todos.length}
          />
        )}
      </div>

      {!!errMsg && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrMsg('')}
          />
          {errMsg}
        </div>
      )}
    </div>
  );
};
