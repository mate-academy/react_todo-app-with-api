import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  todosAreUpdated: number[];
  onDeleteTodo: (id: number) => Promise<void>;
  onChangeTodo: (t: Todo) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  todosAreUpdated,
  onDeleteTodo,
  onChangeTodo,
}) => {
  const [activeTodo, setActiveTodo] = useState<null | Todo>(null);

  return (
    <TransitionGroup>
      {visibleTodos.map(todo => (
        <CSSTransition key={todo.id} timeout={300} classNames="item">
          <TodoItem
            todo={todo}
            activeTodo={activeTodo}
            isProcessed={todosAreUpdated.includes(todo.id)}
            onChangeActiveTodo={t => setActiveTodo(t)}
            onChangeTodo={onChangeTodo}
            onDeleteTodo={onDeleteTodo}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
