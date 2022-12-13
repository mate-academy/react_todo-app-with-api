import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { ToDo } from '../ToDo/ToDo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onRemove: (todoId: number) => void
  deletingToDoId: number[];
  onStatusChange: (todoId: number, data: boolean) => void;
  onTitleChange: (todoId: number, title: string) => void;
};

export const ToDoList: React.FC<Props> = ({
  todos,
  onRemove,
  tempTodo,
  deletingToDoId,
  onStatusChange,
  onTitleChange,
}) => {
  const isTodoEditing = (id: number) => {
    return deletingToDoId.includes(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>

        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <ToDo
              key={todo.id}
              todo={todo}
              onRemove={onRemove}
              isEditing={isTodoEditing(todo.id || 0)}
              onStatusChange={onStatusChange}
              onTitleChange={onTitleChange}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            timeout={300}
            classNames="temp-item"
          >
            <ToDo todo={tempTodo} isTemp />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
