import React, { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  modifyIds: number[];
  onRemoveTodo: (todoId: number) => void;
  onUpdateStatus: (todo: Todo) => void;
  updatingTodoId: number | null;
  setUpdatingId: (id: number | null) => void;
  onChangeTitle: (todo: Todo) => Promise<void>;
}

export const TodoList: FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  modifyIds,
  onRemoveTodo,
  onUpdateStatus,
  updatingTodoId,
  onChangeTitle,
  setUpdatingId,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition timeout={300} classNames="item" key={todo.id}>
            <TodoItem
              todo={todo}
              onRemove={onRemoveTodo}
              isLoading={modifyIds.includes(todo.id)}
              onUpdateStatus={onUpdateStatus}
              editingTodoId={updatingTodoId}
              onChangeTitle={onChangeTitle}
              setEditId={setUpdatingId}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isLoading />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
