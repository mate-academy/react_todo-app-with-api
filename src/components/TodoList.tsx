import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (id: number) => void;
  processingTodos: number[];
  onUpdate: (todo: TodoType) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  processingTodos,
  onUpdate,
}) => {
  const TIMEOUT = 300;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={300} classNames="item">
            <Todo
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isProcessed={processingTodos.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={TIMEOUT} classNames="item">
            <Todo
              todo={tempTodo}
              onDelete={onDelete}
              isProcessed={true}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
