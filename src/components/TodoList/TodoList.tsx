import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  improveTodo: (id: number, data: Partial<Todo>) => void;
  isLoading: boolean;
  selectedId: number;
  toggleLoader: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  improveTodo,
  isLoading,
  selectedId,
  toggleLoader,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              removeTodo={removeTodo}
              improveTodo={improveTodo}
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
