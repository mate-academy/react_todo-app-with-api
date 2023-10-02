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
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoErrors } from './components/TodoErrors';
import { Todo } from './types/Todo';
import * as TodoService from './api/todos';
import { FilteredBy } from './types/FilteredBy';
import { getFilteredTodos } from './utils/filter';
import { todosForDelete } from './utils/todosForDelete';
import { USER_ID } from './utils/UserId';
import { findTodoById } from './utils/findTodoById';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState(FilteredBy.ALL);
  const [isLoading, setLoading] = useState(false);
  const [listOfTodosIds, setListOfTodosIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [listOfTodosIdsForChange, setListOfTodosIdsForChange] = useState<number[]>([]);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then((data) => {
        setTodos(data);
      }).catch(() => setError('Wrong URL - could not make a request'));
  }, []);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, filterBy);
  }, [todos, filterBy]);

  const activeTodosLength = useMemo(() => {
    return filteredTodos
      .every(filteredTodo => filteredTodo.completed);
  }, [filteredTodos]);

  const deleteTodo = useCallback((todoId: number) => {
    setLoading(true);
    TodoService.deleteTodo(todoId)
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

    TodoService.createTodo(newTodo)
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
      TodoService.updateTodo({ ...todoForUpdate, title: query })
        .then((updatedTodo) => {
          setTodos((currentTodos: Todo[]) => currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        })
        .catch((error1) => {
          setError('Unable to update a todo');
          throw error1;
        })
        .finally(() => {
          setLoading(false);
          setListOfTodosIdsForChange([]);
        });
    }
  }, [todos]);

  const toggleTodo = useCallback((todoId: number | null) => {
    const todoForUpdate = findTodoById(todos, todoId);

    setLoading(true);

    if (todoForUpdate !== null) {
      TodoService.updateTodo({ ...todoForUpdate, completed: !todoForUpdate.completed })
        .then((updatedTodo) => {
          setTodos((currentTodos: Todo[]) => currentTodos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
        })
        .catch((error1) => {
          setError('Unable to update a todo');
          throw error1;
        })
        .finally(() => {
          setLoading(false);
          setListOfTodosIdsForChange([]);
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

    setListOfTodosIdsForChange(todosIds);

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
          <TodoForm
            loading={isLoading}
            addTodo={(newTodo) => addTodo(newTodo)}
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
                listOfTodosIdsForChange={listOfTodosIdsForChange}
                onChanged={setListOfTodosIdsForChange}
                onDelete={setListOfTodosIds}
              />
              <TodoFooter
                completedTodos={completedTodos}
                uncompletedTodos={uncompletedTodos}
                filterBy={filterBy}
                onFiltered={setFilterBy}
                deleteCompletedTodos={deleteCompletedTodos}
              />
            </>
          )
        }
      </div>

      {error.length !== 0
        && <TodoErrors error={error} />}
    </div>
  );
};
