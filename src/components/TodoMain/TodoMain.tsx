import React from 'react';
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
  onCheck: (todoId: number) => void;
  onUpdate: (todoId: number, newTitle: string) => Promise<void>;
};

export const TodoMain: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete,
  loadingTodoIds,
  onCheck,
  onUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <TodoItem
              todo={todo}
              handleDelete={handleDelete}
              isProcessed={loadingTodoIds.includes(todo.id)}
              onCheck={onCheck}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem
              todo={tempTodo}
              isProcessed
              handleDelete={handleDelete}
              onCheck={onCheck}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
