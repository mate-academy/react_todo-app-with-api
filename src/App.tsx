/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodos,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { TodoItem } from './components/TodoItem/TodoItem';

const USER_ID = 10522;

enum ErorrType {
  NONE,
  ADDERORR,
  DELETEERORR,
  UPDATEERORR,
}

enum Filter {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [erorr, setErorr] = useState<ErorrType>(ErorrType.NONE);
  const [filterTodos, setFilterTodos] = useState(Filter.ALL);
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  let timeErorr:number;

  const funcVisibleTodos = (arrItems:Todo[], typeFilter:Filter) => {
    const items = [...arrItems];

    return items.filter(item => {
      switch (typeFilter) {
        case Filter.ALL:
          return item;

        case Filter.ACTIVE:
          return item.completed === false;

        case Filter.COMPLETED:
          return item.completed === true;

        default:
          return item;
      }
    });
  };

  const visibleTodos = useMemo(() => {
    return funcVisibleTodos(todos, filterTodos);
  }, [todos, filterTodos]);

  const ativeTodos = todos.filter(todo => todo.completed === false);
  const completedTodos = todos.filter(todo => todo.completed === true);

  const clearErorr = () => {
    setErorr(ErorrType.NONE);
    window.clearTimeout(timeErorr);
  };

  const funcVisibleErorr = () => {
    timeErorr = window.setTimeout(clearErorr, 3000);
  };

  const addNewTodos = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title) {
      const newItemTodo = {
        userId: 10522,
        title,
        completed: false,
      };

      setIsDisabled(true);
      addTodos('/todos', newItemTodo).then((newTodo) => {
        setTodos([...todos, newTodo]);
        setIsDisabled(false);
      });
    } else {
      setErorr(ErorrType.ADDERORR);
    }

    setTitle('');
  };

  const onDelete = (id:number) => {
    setTodos(todos.filter(todoItem => todoItem.id !== id));
    deleteTodo(id);
  };

  const onUpdate = (id: number, completed: boolean) => {
    const todoCompleted = { completed: !completed };

    updateTodo(id, todoCompleted);
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !completed };
      }

      return todo;
    }));
  };

  const todoToggle = () => {
    setTodos(todos.map(todo => {
      if (completedTodos.length !== todos.length) {
        updateTodo(todo.id, { completed: true });

        return { ...todo, completed: true };
      }

      updateTodo(
        todo.id,
        { completed: !(completedTodos.length === todos.length) },
      );

      return { ...todo, completed: !(completedTodos.length === todos.length) };
    }));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => {
      if (todo.completed !== false) {
        deleteTodo(todo.id);

        return false;
      }

      return true;
    }));
  };

  const todoEdit = (id:number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(allTodos => setTodos(allTodos))
      .catch(() => setErorr(ErorrType.UPDATEERORR));
  }, []);

  useEffect(() => {
    funcVisibleErorr();
  }, [erorr]);

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
            className={classNames(
              'todoapp__toggle-all',
              { active: completedTodos.length === todos.length },
            )}
            onClick={() => todoToggle()}
          />

          <form onSubmit={addNewTodos}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isDisabled}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  updateTodo={updateTodo}
                  todoEdit={todoEdit}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </section>

        {todos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${ativeTodos.length} items left`}
            </span>
            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.ALL },
                )}
                onClick={() => setFilterTodos(Filter.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.ACTIVE },
                )}
                onClick={() => setFilterTodos(Filter.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterTodos === Filter.COMPLETED },
                )}
                onClick={() => setFilterTodos(Filter.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={() => clearCompleted()}
              disabled={completedTodos.length <= 0}
            >
              Clear completed
            </button>

          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: erorr === ErorrType.NONE },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => clearErorr()}
        />
        {erorr === ErorrType.ADDERORR && (
          <div>Unable to add a todo</div>
        )}
        {erorr === ErorrType.DELETEERORR && (
          <div>Unable to delete a todo</div>
        )}
        {erorr === ErorrType.UPDATEERORR && (
          <div>Unable to update a todo</div>
        )}
      </div>
    </div>
  );
};
