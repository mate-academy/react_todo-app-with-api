import React, { useCallback, useMemo, useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';

import { TodoInfo } from '../TodoInfo';
import { TodoFilter } from '../TodoFilter';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  isAdding: boolean;
  onDelete: (id: number) => void;
  deletingIds: number[];
  onChangeStatus: (todo: Todo) => void;
  onChangeTitle: (id: number, newTitle: string) => void;
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  isAdding,
  onDelete,
  deletingIds,
  onChangeStatus,
  onChangeTitle,
}) => {
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.ALL);

  const filterTodos = useCallback(() => {
    let filtered;

    switch (status) {
      case TodoStatus.ACTIVE:
      case TodoStatus.COMPLETED:
        filtered = todos.filter(todo => (
          (status === TodoStatus.ACTIVE)
            ? !todo.completed
            : todo.completed
        ));
        break;
      default:
        filtered = todos;
    }

    return filtered;
  }, [todos, status]);

  const filteredTodos = useMemo(() => filterTodos(), [todos, status]);

  const handleChangeStatus = useCallback((todosStatus: TodoStatus) => {
    setStatus(todosStatus);
  }, []);

  const complitedTodos = useMemo(
    () => todos.filter(todo => todo.completed), [todos],
  );
  const activeTodos = useMemo(
    () => todos.filter(todo => !todo.completed), [todos],
  );

  const deleteComplitedTodos = useCallback(() => {
    if (complitedTodos.length !== 0) {
      complitedTodos.forEach(todo => onDelete(todo.id));
    }
  }, [complitedTodos]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {filteredTodos.map(todo => (
            <CSSTransition
              key={todo.id}
              timeout={300}
              classNames="item"
            >
              <TodoInfo
                todo={todo}
                key={todo.id}
                onDelete={onDelete}
                deletingIds={deletingIds}
                onChangeStatus={onChangeStatus}
                onChangeTitle={onChangeTitle}
              />
            </CSSTransition>
          ))}

          {(isAdding && tempTodo) && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <TodoInfo
                todo={tempTodo}
                onDelete={onDelete}
                deletingIds={deletingIds}
                onChangeStatus={onChangeStatus}
                onChangeTitle={onChangeTitle}
              />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>

      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="todosCounter">
          {`${activeTodos.length} items left`}
        </span>

        <TodoFilter
          onChangeFilter={handleChangeStatus}
          status={status}
        />

        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          style={(complitedTodos.length === 0)
            ? { visibility: 'hidden' }
            : {}}
          onClick={deleteComplitedTodos}
        >
          Clear completed
        </button>
      </footer>
    </>
  );
});
