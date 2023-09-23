/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { FilterChoise } from '../types/FilterChoise';
import { TodosContext } from '../context/TodoContext';
import { TodoList } from './TodoList';
import { TodoFilter } from './TodoFilter';
import { ErrorNotification } from './ErrorNotification';
import { addTodo, deleteTodo, updateTodo } from '../api/todos';
import { USER_ID } from '../utils/constans';
import { Todo } from '../types/Todo';

export const TodoApp: React.FC = () => {
  const [filterChoise, setFilterChoise] = useState(FilterChoise.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [toHideError, setToHideError] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);

  const [todos, setTodos, errorMsg, setErrorMsg] = useContext(TodosContext);

  // eslint-disable-next-line no-lone-blocks
  { // for next tasks, i have problem with linter without it
  }

  const filteredTodos = useMemo(() => todos.filter((todo) => {
    switch (filterChoise) {
      case FilterChoise.Active:
        return !todo.completed;
      case FilterChoise.Completed:
        return todo.completed;
      default:
        return true;
    }
  }), [todos, filterChoise]);

  const uncompleatedTodos = useMemo(() => {
    return todos.filter((todo) => !todo.completed);
  }, [todos]);

  const completedTodos = useMemo(() => {
    return todos.filter((todo) => todo.completed);
  }, [todos]);

  const uncompleatedTodosText = useMemo(() => {
    return uncompleatedTodos.length === 1 ? 'item' : 'items';
  }, [uncompleatedTodos]);

  const allCompleated = useMemo(() => uncompleatedTodos.length === 0,
    [uncompleatedTodos.length]);

  const hideError = () => {
    setToHideError(true);

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  useEffect(() => {
    if (errorMsg === '') {
      return;
    }

    setToHideError(false);

    setTimeout(() => {
      hideError();
    }, 3000);
  }, [errorMsg]);

  const handleTodoAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (todoTitle.trim() === '') {
      setErrorMsg('Title can\'t be empty');

      return;
    }

    if (errorMsg !== '') {
      hideError();
    }

    const todoToAdd = { // Renamed from newTodo to todoToAdd
      userId: USER_ID,
      title: todoTitle.trim(),
      completed: false,
    };

    setTempTodo({ ...todoToAdd, id: 0 });

    addTodo(todoToAdd)
      .then((newTodo) => {
        setTodos([...todos, newTodo]);
      })
      .catch(() => {
        setErrorMsg('Cant create a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });

    setTodoTitle('');
  };

  const handleClearCompleted = async () => {
    const idsToDelete: number[] = [];

    setProcessedTodoIds(completedTodos.map(({ id }) => id));

    if (errorMsg !== '') {
      hideError();
    }

    await Promise.all(completedTodos.map(({ id }) => {
      return deleteTodo(id)
        .then(() => {
          idsToDelete.push(id);
        })
        .catch(() => {
          setErrorMsg('Unable to delete a todo');
        });
    }));

    setTodos(todos.filter((todo) => !idsToDelete.includes(todo.id)));
  };

  const handleCompeteAll = async () => {
    const idsToUpdate: number[] = [];
    const todosToMap = allCompleated ? completedTodos : uncompleatedTodos;

    setProcessedTodoIds(todosToMap.map(({ id }) => id));

    if (errorMsg !== '') {
      hideError();
    }

    await Promise.all(todosToMap.map((todo) => {
      const updatedTodo = {
        ...todo,
        completed: !allCompleated,
      };

      return updateTodo(updatedTodo)
        .then(() => {
          idsToUpdate.push(todo.id);
        })
        .catch(() => {
          setErrorMsg('Unable to update a todo');
        });
    }));

    setTodos(todos.map((todo) => {
      if (idsToUpdate.includes(todo.id)) {
        return {
          ...todo,
          completed: !allCompleated,
        };
      }

      return todo;
    }));
    setProcessedTodoIds([]);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {todos.length !== 0 && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleated,
              })}
              onClick={handleCompeteAll}
            />
          )}
          {/* Add a todo on form submit */}
          <form
            onSubmit={handleTodoAdd}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={!!tempTodo}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList
                todos={filteredTodos}
                hideError={hideError}
                proccessedTodoIds={processedTodoIds}
                tempTodo={tempTodo}
              />
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${uncompleatedTodos.length} ${uncompleatedTodosText} left`}
              </span>

              {/* Active filter should have a 'selected' class */}
              <TodoFilter
                filterChoise={filterChoise}
                setFilterChoise={setFilterChoise}
              />

              {/* don't show this button if there are no completed todos */}
              {completedTodos.length > 0 && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        toHideError={toHideError}
        hideError={hideError}
      />

    </div>
  );
};
