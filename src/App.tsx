/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import {
  addTodo, deleteTodo, getTodos, patchTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { TodoFilter } from './TodoFilter';
import { Todolist } from './TodoList';
import { TodoErrors } from './TodoErrors';

const USER_ID = 11129;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.ALL);
  const [errorText, setErrorText] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processing, setProcessing] = useState(false);

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

  const addTodosHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorText('Title can\'t be empty');

      return;
    }

    setProcessing(true);

    setTempTodo({
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    });

    if (title.trim()) {
      addTodo({
        userId: USER_ID,
        title,
        completed: false,
      })
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
          setTitle('');
        })
        .catch(() => {
          setErrorText('Unable to add a todo');
        })
        .finally(() => {
          setTempTodo(null);
          setProcessing(false);
        });
    }
  };

  const deleteTodoHandler = (todoId: number) => {
    setProcessing(true);
    deleteTodo(todoId).then(() => setTodos(todos
      .filter(todo => todo.id !== todoId)))
      .catch(() => {
        setErrorText('Unable to delete a todo');
      }).finally(() => {
        setProcessing(false);
      });
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const clearCompletedTodos = () => {
    completedTodos.forEach((item) => deleteTodo(item.id));
    setTodos(activeTodos);
  };

  const toggleCompletedTodo = (todoId: number) => {
    setProcessing(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const updatedTodo = todos.find(todo => todo.id === todoId)!;

    const changedTodo = {
      ...updatedTodo,
      completed: !updatedTodo?.completed,
    };

    patchTodo(changedTodo)
      .then(() => {
        setTodos(
          (prevTodos) => prevTodos.map(
            (todo) => (todo.id === todoId ? changedTodo : todo),
          ),
        );
      }).catch(() => {
        setErrorText('Unable to update a todo');
      }).finally(() => {
        setProcessing(false);
      });
  };

  const handleCompleteAll = () => {
    const todosToChange = activeTodos.length
      ? activeTodos
      : visibleTodos;

    todosToChange.forEach(todo => {
      toggleCompletedTodo(todo.id);
    });
  };

  const renameTodo = async (todoUpdate: Todo, newTitle: string) => {
    return patchTodo({ ...todoUpdate, title: newTitle })
      .then((updatedTodo) => {
        setTodos(prevTodos => prevTodos.map(
          todo => (todo.id === updatedTodo.id ? updatedTodo : todo),
        ));
      })
      .catch(() => {
        setErrorText('Unable to update a todo');
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            onClick={handleCompleteAll}
            className={classNames('todoapp__toggle-all', {
              active: activeTodos.length > 0,
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
              disabled={processing}
            />
          </form>
        </header>

        <Todolist
          onRename={renameTodo}
          processing={processing}
          deleteTodoHandler={deleteTodoHandler}
          todos={visibleTodos}
          toggleCompletedTodo={toggleCompletedTodo}
        />

        {tempTodo !== null && (
          <div className="todo">
            <label className="todo__status-label">
              <input type="checkbox" className="todo__status" />
            </label>

            <span className="todo__title">{tempTodo?.title}</span>
            <button type="button" className="todo__remove">×</button>

            <div className={classNames('modal overlay', {
              'is-active': tempTodo !== null,
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter filter={filter} setFilter={setFilter} />

            {completedTodos.length > 0 && (
              <button
                onClick={clearCompletedTodos}
                type="button"
                className="todoapp__clear-completed"
              >
                Clear completed
              </button>
            )}
          </footer>
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
