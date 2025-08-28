/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  loadingTodoIds: number[];
  editLoadingTodoIds: number[];
  tempTodo: Todo | null;
  editingTodoId: number | null;
  onEditTodo?: (title: string, id: number) => void;
  onTodoDelete?: (id: number) => void;
  onOneTodoToggle?: (id: number) => void;
  onSettingEditingTodo?: (id: number) => void;
};

export const Todos: React.FC<Props> = ({
  todos,
  loadingTodoIds,
  tempTodo = null,
  editLoadingTodoIds,
  editingTodoId,
  onEditTodo = () => {},
  onTodoDelete = () => {},
  onOneTodoToggle = () => {},
  onSettingEditingTodo = () => {},
}) => {
  const handleDoubleClick = useCallback(
    (id: number) => {
      onSettingEditingTodo(id);
    },
    [onSettingEditingTodo],
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => {
          const isEditing = todo.id === editingTodoId;
          const isLoading = loadingTodoIds.includes(todo.id);
          const isEditLoading = editLoadingTodoIds.includes(todo.id);

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                isEditing={isEditing}
                isLoading={isLoading}
                isEditLoading={isEditLoading}
                onOneTodoToggle={onOneTodoToggle}
                onEditTodo={onEditTodo}
                onDoubleClick={handleDoubleClick}
                onTodoRemove={onTodoDelete}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isEditing={false}
              isLoading={true}
              isEditLoading={false}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
