import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  creatingTodo: Todo | null;
  onRemoveTodo: (todo: Todo) => void;
  onToogleTodo: (todo: Todo) => void;
  onHandleUpdate: (todo: Todo) => void;
  todosLoadingState: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  creatingTodo,
  onRemoveTodo,
  onToogleTodo,
  onHandleUpdate,
  todosLoadingState,
}) => {
  return (
    <ul className="todoapp__main">
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
              todosLoadingState={todosLoadingState}
              onRemoveTodo={onRemoveTodo}
              onToogleTodo={onToogleTodo}
              onHandleUpdate={onHandleUpdate}
            />
          </CSSTransition>
        ))}

        {creatingTodo !== null && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={creatingTodo}
              todosLoadingState={todosLoadingState}
              onRemoveTodo={() => { }}
              onToogleTodo={onToogleTodo}
              onHandleUpdate={onHandleUpdate}
            />
          </CSSTransition>

        )}
      </TransitionGroup>
    </ul>
  );
});
