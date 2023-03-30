import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  processedTodos: number[],
  onDelete: (id: number) => void,
  onUpdateTodo: (todo: Todo) => void,
  onUpdateTitle: (todo: Todo, newTitle: string) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processedTodos,
  onDelete,
  onUpdateTodo,
  onUpdateTitle,
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
              processedTodos={processedTodos}
              onDelete={onDelete}
              onUpdateTodo={onUpdateTodo}
              onUpdateTitle={onUpdateTitle}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={tempTodo}
              processedTodos={processedTodos}
              onDelete={onDelete}
              onUpdateTodo={onUpdateTodo}
              onUpdateTitle={onUpdateTitle}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
