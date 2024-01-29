/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { Todolist } from './TodoList';
import { TodoErrors } from './TodoErrors';
import { TodoFooter } from './TodoFooter';

const USER_ID = 11129;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorText, setErrorText] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const hasError = !!errorText;

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((error: Error) => {
        setErrorText(error.message);
      });
  }, []);

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case FilterType.COMPLETED:
        return todos.filter((todo) => todo.completed);
      case FilterType.ACTIVE:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const addTodosHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim()) {
        setErrorText('Title can\'t be empty');

        return;
      }

      setTempTodo({
        id: 0,
        title,
        completed: false,
        userId: USER_ID,
      });

      addTodo({
        userId: USER_ID,
        title,
        completed: false,
      })
        .then((newTodo) => {
          setProcessingIds(ids => [...ids, newTodo.id]);
          setTodos([...todos, newTodo]);
          setTitle('');
        })
        .catch(() => {
          setErrorText('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setProcessingIds(ids => ids.filter(id => !id));
        });
    }, [todos, title],
  );

  const deleteTodoHandler = useCallback((todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);

    deleteTodo(todoId).then(() => setTodos(todos
      .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorText('Unable to delete a todo');
      }).finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
      });
  }, [todos]);

  const activeTodos = useMemo(() => todos
    .filter(todo => !todo.completed),
  [todos]);

  const completedTodos = useMemo(() => todos
    .filter(todo => todo.completed),
  [todos]);

  const clearCompletedTodos = useCallback(() => {
    completedTodos.forEach(todo => {
      setProcessingIds(ids => [...ids, todo.id]);
      deleteTodo(todo.id).then(() => {
        setTodos(activeTodos);
      }).catch(() => {
        setErrorText('Unable to clear todos');
      }).finally(() => setProcessingIds(ids => ids.filter(id => !id)));
    });
  }, [todos]);

  const toggleCompletedTodo = useCallback((todoId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updatedTodo = todos.find(todo => todo.id === todoId)!;

    const changedTodo = {
      ...updatedTodo,
      completed: !updatedTodo?.completed,
    };

    setProcessingIds(ids => [...ids, todoId]);

    return patchTodo(changedTodo)
      .then(() => {
        setTodos(
          (prevTodos) => prevTodos.map(
            (todo) => (todo.id === todoId ? changedTodo : todo),
          ),
        );
      }).catch(() => {
        setErrorText('Unable to update a todo');
      }).finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoId));
      });
  }, [todos]);

  const handleCompleteAll = useCallback(() => {
    const todosToChange = activeTodos.length
      ? activeTodos
      : visibleTodos;

    todosToChange.forEach(todo => {
      toggleCompletedTodo(todo.id);
    });
  }, [todos]);

  const renameTodo = useCallback((todoUpdate: Todo, newTitle: string) => {
    setProcessingIds(ids => [...ids, todoUpdate.id]);

    return patchTodo({ ...todoUpdate, title: newTitle })
      .then((updatedTodo) => {
        setTodos(prevTodos => prevTodos.map(
          todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
        ));
      })
      .catch(() => {
        setErrorText('Unable to update a todo');
      }).finally(() => {
        setProcessingIds(ids => ids.filter(id => id !== todoUpdate.id));
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            onClick={handleCompleteAll}
            className={classNames('todoapp__toggle-all', {
              active: activeTodos.length === visibleTodos.length,
            })}
          />

          <form onSubmit={(event) => {
            addTodosHandler(event);
          }}
          >
            <input
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setErrorText('');
              }}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={!!tempTodo}
            />
          </form>
        </header>

        <Todolist
          onRename={renameTodo}
          processingIds={processingIds}
          deleteTodoHandler={deleteTodoHandler}
          todos={visibleTodos}
          toggleCompletedTodo={toggleCompletedTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            setFilter={setFilter}
            activeTodos={activeTodos}
            completedTodos={completedTodos}
            clearCompletedTodos={clearCompletedTodos}
          />
        )}

      </div>

      {hasError && (
        <TodoErrors
          hasError={hasError}
          errorText={errorText}
          setErrorText={setErrorText}
        />
      )}
    </div>
  );
};
