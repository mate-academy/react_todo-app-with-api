import React from 'react';
import { Todo as TodoType } from '../types/Todo';
import { Todo } from './Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  onDelete: (id: number) => void;
  processingTodos: number[];
  onTodoUpdate: (todo: TodoType) => Promise<void>;
};

const transitionTimeout = 300;

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  processingTodos,
  onTodoUpdate,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={transitionTimeout}
            classNames="item"
          >
            <Todo
              todo={todo}
              onDelete={onDelete}
              isProcessed={processingTodos.includes(todo.id)}
              onTodoUpdate={onTodoUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition key={0} timeout={transitionTimeout} classNames="item">
            <Todo
              todo={tempTodo}
              onDelete={onDelete}
              isProcessed={true}
              onTodoUpdate={onTodoUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
