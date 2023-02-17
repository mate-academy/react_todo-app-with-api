import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[],
  tempTodo: Todo | null,
  todosLoadingState: Todo[],
  onClickRemoveTodo: (todoId: Todo) => void,
  onUpdateTodo: (todo: Todo) => void,
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  todosLoadingState,
  onClickRemoveTodo,
  onUpdateTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              todosLoadingState={todosLoadingState}
              onClickRemoveTodo={onClickRemoveTodo}
              onUpdateTodo={onUpdateTodo}
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
              todosLoadingState={todosLoadingState}
              onClickRemoveTodo={() => { }}
              onUpdateTodo={() => { }}
            />
          </CSSTransition>

        )}
      </TransitionGroup>
    </section>
  );
};
