/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';

import * as fetchMethods from './api/todos';
import { FilteredBy, Todo } from './types/types';
import { getFilteredTodos } from './utils/Filter';
import { findTodoById } from './utils/FilterTodoById';
import { TodoList } from './components/TodoList';
import { todosForDelete } from './utils/TodoForDelete';
import { AddTodoForm } from './components/AddTodoForm';
import { Footer } from './components/Footer';
import { Errors } from './components/Errors';
import { USER_ID } from './constants/constants';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilteredBy.ALL);
  const [isLoading, setLoading] = useState(false);
  const [listOfTodosIds, setListOfTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todosIdsForChange, setTodosIdsForChange] = useState<number[]>([]);

  useEffect(() => {
    fetchMethods.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      }).catch(() => setError('Wrong URL - could not make a request'));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterStatus);
  }, [todos, filterStatus]);

  const activeTodosLength = useMemo(() => {
    return filteredTodos
      .every(filteredTodo => filteredTodo.completed);
  }, [filteredTodos]);

  const deleteTodo = useCallback((todoId: number) => {
    setLoading(true);
    fetchMethods.deleteTodo(todoId)
      .then(() => {
        setTodos((currentTodos: Todo[]) => {
          return currentTodos.filter(todo => todo.id !== todoId);
        });
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(false);
        setListOfTodosIds([]);
      });
  }, [todos]);

  const deleteCompletedTodos = useCallback(() => {
    setLoading(true);

    const completedTodos = todosForDelete(todos);
    const completedTodoIds = completedTodos.map(todo => todo.id);

    setListOfTodosIds(completedTodoIds);

    if (!completedTodos || completedTodos.length === 0) {
      setError('There are no completed todos');
      setLoading(false);

      return;
    }

    completedTodos.map(todo => deleteTodo(todo.id));
  }, [todos]);

  const addTodo = useCallback((newTodo: Todo) => {
    setLoading(true);
    setTempTodo(newTodo);

    fetchMethods.createTodo(newTodo)
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
      })
      .catch(() => {
        setError('Unable to add a post');
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }, [todos]);

  const renameTodo = useCallback((todoId: number | null, query: string) => {
    const todoForUpdate = findTodoById(todos, todoId);

    setLoading(true);

    if (todoForUpdate !== null) {
      fetchMethods.updateTodo({ ...todoForUpdate, title: query })
        .then((updatedTodo) => {
          setTodos((currentTodos: Todo[]) => currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        })
        .catch((error1) => {
          setError('Unable to update a todo');
          throw error1;
        })
        .finally(() => {
          setLoading(false);
          setTodosIdsForChange([]);
        });
    }
  }, [todos]);

  const toggleTodo = useCallback((todoId: number | null) => {
    const todoForUpdate = findTodoById(todos, todoId);

    setLoading(true);

    if (todoForUpdate !== null) {
      fetchMethods.updateTodo({ ...todoForUpdate, completed: !todoForUpdate.completed })
        .then((updatedTodo) => {
          setTodos((currentTodos: Todo[]) => currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        })
        .catch((error1) => {
          setError('Unable to update a todo');
          throw error1;
        })
        .finally(() => {
          setLoading(false);
          setTodosIdsForChange([]);
        });
    }
  }, [todos]);

  const reverseTodos = useCallback((todosForRevert: Todo[]) => {
    let todosForUpdate = todosForRevert;
    let todosIds = todosForUpdate.map(todo => todo.id);

    if (todosForUpdate.some(todo => !todo.completed)) {
      todosForUpdate = todosForUpdate.filter(todo => !todo.completed);
      todosIds = todosForUpdate.map(todo => todo.id);
    }

    setTodosIdsForChange(todosIds);

    todosForUpdate.map(todo => toggleTodo(todo.id));
  }, [todos]);

  const uncompletedTodos = useMemo(() => {
    return todos
      .filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodos = useMemo(() => todosForDelete(todos), [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={
              classNames('todoapp__toggle-all', {
                active: activeTodosLength,
              })
            }
            onClick={() => reverseTodos(todos)}
          />
          <AddTodoForm
            loading={isLoading}
            addTodo={addTodo}
            onFail={setError}
          />
        </header>

        {
          todos.length !== 0
          && (
            <>
              <TodoList
                deleteTodo={deleteTodo}
                todos={filteredTodos}
                isLoading={isLoading}
                listOfTodosIds={listOfTodosIds}
                tempTodo={tempTodo}
                renameTodo={renameTodo}
                toggleTodo={toggleTodo}
                listOfTodosIdsForChange={todosIdsForChange}
                onChanged={setTodosIdsForChange}
                onDelete={setListOfTodosIds}
              />
              <Footer
                completedTodos={completedTodos}
                uncompletedTodos={uncompletedTodos}
                filterBy={filterStatus}
                onFiltered={setFilterStatus}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            </>
          )
        }
      </div>

      {error
        && <Errors error={error} />}
    </div>
  );
};
