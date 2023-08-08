import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  handleRemoveTodo: (id: number) => void;
  handleTodoStatusUpdate: (todo: Todo) => void;
  handleTodoTitleUpdate: (todo: Todo, title: string) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  loadingTodos,
  handleRemoveTodo,
  handleTodoStatusUpdate,
  handleTodoTitleUpdate,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              loadingTodos={loadingTodos}
              handleRemoveTodo={handleRemoveTodo}
              handleTodoStatusUpdate={handleTodoStatusUpdate}
              handleTodoTitleUpdate={handleTodoTitleUpdate}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              loadingTodos={loadingTodos}
              handleRemoveTodo={handleRemoveTodo}
              handleTodoStatusUpdate={handleTodoStatusUpdate}
              handleTodoTitleUpdate={handleTodoTitleUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
