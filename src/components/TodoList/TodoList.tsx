import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (id: number) => void;
  onTodoUpdate: (todo: Todo) => Promise<void>;
  processingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoUpdate,
  processingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
            appear={true}
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              onTodoRemove={onTodoDelete}
              onTodoUpdate={onTodoUpdate}
              isLoading={processingIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
            appear={true}
          >
            <TodoItem
              todo={tempTodo}
              isLoading={true}
              onTodoUpdate={onTodoUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
