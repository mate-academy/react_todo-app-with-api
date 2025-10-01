/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useCallback } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoState } from '../../types/TodoState';

type Props = {
  todos: Todo[];
  loadingTodoIds: TodoState[];
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
          const loadingState: TodoState | null =
            loadingTodoIds.find(elem => elem.id === todo.id) || null;
          const isEditing = todo.id === editingTodoId;

          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                todo={todo}
                loadingState={loadingState}
                isEditing={isEditing}
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
              loadingState={{
                id: 0,
                state: 'loading',
              }}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
