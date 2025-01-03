import React, { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import cn from 'classnames';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => Promise<void>;
  loadingTodoIds: number[];
  tempTodo: Todo | null;
  deleteCompleted: () => Promise<void>;
  clearDisabled: boolean;
  handleChangeCompleted: (todo: Todo) => Promise<void>;
  showError: (message: string) => void;
}

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const TodoList: React.FC<Props> = ({
  todos: todosData,
  deleteTodo,
  loadingTodoIds,
  tempTodo,
  deleteCompleted,
  clearDisabled,
  handleChangeCompleted,
  showError,
}) => {
  const [todos, setTodos] = useState<Todo[]>(todosData);
  const [filterBy, setFilterBy] = useState<Filter>(Filter.All);

  useEffect(() => {
    switch (filterBy) {
      case Filter.Active:
        setTodos(todosData.filter(todo => !todo.completed));
        break;
      case Filter.Completed:
        setTodos(todosData.filter(todo => todo.completed));
        break;
      case Filter.All:
      default:
        setTodos(todosData);
        break;
    }
  }, [filterBy, todosData]);

  const filters = [
    { label: 'All', value: Filter.All, href: '#/' },
    { label: 'Active', value: Filter.Active, href: '#/active' },
    { label: 'Completed', value: Filter.Completed, href: '#/completed' },
  ];

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            showError={showError}
            deleteTodo={deleteTodo}
            loadingTodoIds={loadingTodoIds}
            handleChangeCompleted={handleChangeCompleted}
            todo={todo}
            setTodos={setTodos}
          />
        ))}
        {tempTodo && (
          <div key={tempTodo.id} data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={tempTodo.completed}
              />{' '}
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>

            <button
              onClick={() => deleteTodo(tempTodo.id)}
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              disabled={loadingTodoIds.includes(tempTodo.id)}
            >
              ×
            </button>

            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}
      </section>

      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {todosData.filter(todo => !todo.completed).length} items left
        </span>

        <nav className="filter" data-cy="Filter">
          {filters.map(filter => (
            <a
              key={filter.value}
              href={filter.href}
              className={cn('filter__link', {
                selected: filterBy === filter.value,
              })}
              data-cy={`FilterLink${filter.label}`}
              onClick={e => {
                e.preventDefault();
                setFilterBy(filter.value);
              }}
            >
              {filter.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          disabled={clearDisabled}
          onClick={deleteCompleted}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
};
