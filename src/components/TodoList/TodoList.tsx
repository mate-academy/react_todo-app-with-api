import React from 'react';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  hasError: boolean;
  onDelete: (todoId: number) => Promise<void>;
  onToggle: (todo: Todo) => void;
  onRename: (todo: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  hasError,
  onDelete,
  onToggle,
  onRename,
}) => {
  return (
    <section
      className={cn('todoapp__main', { 'has-error': hasError })}
      data-cy="TodoList"
    >
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              isProcessing={processingIds.includes(todo.id)}
              onDelete={onDelete}
              onToggle={onToggle}
              onRename={onRename}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isProcessing
              onDelete={onDelete}
              onToggle={onToggle}
              onRename={onRename}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
