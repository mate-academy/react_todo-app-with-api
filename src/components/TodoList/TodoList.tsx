import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  deleteTodo: (id: number) => void;
  updateTodos: (id: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number;
  toggleLoader: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isLoading,
  selectedId,
  toggleLoader,
  updateTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              onDelete={deleteTodo}
              updateTodos={updateTodos}
              isLoading={isLoading}
              selectedId={selectedId}
              toggleLoader={toggleLoader}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
