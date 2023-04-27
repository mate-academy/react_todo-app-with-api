import React from 'react';
import '../../styles/animation.scss';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => void;
  processedTodoIds: number[];
  updateTodo: (id: number, data: Partial<Todo>) => Promise<void>;
};

export const TodosList: React.FC<Props> = ({
  todos,
  removeTodo,
  processedTodoIds,
  updateTodo,
}) => {
  return (
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
            removeTodo={removeTodo}
            procesedTodoIds={processedTodoIds}
            updateTodo={updateTodo}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
