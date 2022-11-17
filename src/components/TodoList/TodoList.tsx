import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import '../../styles/transitiongroup.scss';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  filteredTodo: Todo[];
  removeTodo: (TodoId: number) => void;
  selectedIds: number[];
  handleChange: (updateId: number, data: Partial<Todo>) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  removeTodo,
  selectedIds,
  handleChange,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {filteredTodo.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              key={todo.id}
              removeTodo={removeTodo}
              selectedId={selectedIds}
              handleChange={handleChange}
              todos={filteredTodo}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
