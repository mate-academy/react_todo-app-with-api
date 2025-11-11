import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todos: Todo[];
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  showError: (message: ErrorMessage) => void;
  tempTodo: Todo | null;
  processings: number[];
  isLoading: boolean;
  onDelete: (todoId: number) => void;
  onUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  setProcessings,
  setTodos,
  showError,
  tempTodo,
  processings,
  isLoading,
  onDelete,
  onUpdate,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            setProcessings={setProcessings}
            setTodos={setTodos}
            showError={showError}
            isProcessed={processings.includes(todo.id)}
            isLoading={isLoading}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition key={0} timeout={300} classNames="temp-item">
          <TodoItem todo={tempTodo} isProcessed isLoading />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
