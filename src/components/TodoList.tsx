import React, { FormEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { countActiveTodos, countCompletedTodos } from '../utils/helpers';
import { FocusFiled } from '../types';
import { FilterBy } from '../types/FilterBy';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  filteredTodos: Todo[],
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
  setEditedTitle: React.Dispatch<React.SetStateAction<string | undefined>>,
  setFocus: React.Dispatch<React.SetStateAction<FocusFiled>>,
  handleUpdateTodoStatus: (todo: Todo) => void,
  editedTodo: Todo | null,
  handleUpdateTodoTitle: (event: FormEvent<HTMLFormElement>
  | React.FocusEvent<HTMLInputElement, Element>) => void,
  editedTitleTodoRef: React.MutableRefObject<HTMLInputElement | null>,
  editedTitle: string | undefined,
  handleDeleteTodo: (todoId: number) => void
  isLoading: boolean,
  loadingTodos: Todo[] | null,
  filterBy: FilterBy,
  setFilterBy: React.Dispatch<React.SetStateAction<FilterBy>>,
  handleDeleteCompletedTodos: () => Promise<void>,
  tempTodo: Todo | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  filteredTodos,
  setEditedTodo,
  setEditedTitle,
  setFocus,
  handleUpdateTodoStatus,
  editedTodo,
  handleUpdateTodoTitle,
  editedTitleTodoRef,
  editedTitle,
  handleDeleteTodo,
  isLoading,
  loadingTodos,
  filterBy,
  setFilterBy,
  handleDeleteCompletedTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">

      {filteredTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          setEditedTodo={setEditedTodo}
          setEditedTitle={setEditedTitle}
          setFocus={setFocus}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          editedTodo={editedTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          editedTitleTodoRef={editedTitleTodoRef}
          editedTitle={editedTitle}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          loadingTodos={loadingTodos}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          setEditedTodo={setEditedTodo}
          setEditedTitle={setEditedTitle}
          setFocus={setFocus}
          handleUpdateTodoStatus={handleUpdateTodoStatus}
          editedTodo={editedTodo}
          handleUpdateTodoTitle={handleUpdateTodoTitle}
          editedTitleTodoRef={editedTitleTodoRef}
          editedTitle={editedTitle}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          loadingTodos={loadingTodos}
        />
      )}

      {!!todos?.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {`${countActiveTodos(todos)} items left`}
          </span>
          <nav className="filter" data-cy="Filter">
            <a
              href="#/"
              className={cn('filter__link', {
                selected: filterBy === 'All',
              })}
              data-cy="FilterLinkAll"
              onClick={() => setFilterBy('All')}
            >
              All
            </a>

            <a
              href="#/active"
              className={cn('filter__link', {
                selected: filterBy === 'Active',
              })}
              data-cy="FilterLinkActive"
              onClick={() => setFilterBy('Active')}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={cn('filter__link', {
                selected: filterBy === 'Completed',
              })}
              data-cy="FilterLinkCompleted"
              onClick={() => setFilterBy('Completed')}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={cn('todoapp__clear-completed', {
              'is-invisible': countCompletedTodos(todos) === 0,
            })}
            data-cy="ClearCompletedButton"
            onClick={handleDeleteCompletedTodos}
            disabled={countCompletedTodos(todos) === 0}
          >
            Clear completed
          </button>
        </footer>
      )}

    </section>
  );
};
