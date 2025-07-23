import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  submittingTodoIds?: number[];
  onUpdate: (todo: Todo) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onUpdate,
  onDelete,
  submittingTodoIds,
}) => (
  <TransitionGroup component="ul" className="todo-list">
    {todos.map(todo => (
      <CSSTransition key={todo.id} timeout={300} classNames="item">
        <li>
          <TodoItem
            todo={todo}
            isSubmitting={submittingTodoIds?.includes(todo.id)}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </li>
      </CSSTransition>
    ))}
  </TransitionGroup>
);
