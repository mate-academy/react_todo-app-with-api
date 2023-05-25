import React, { FC } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoComponent } from '../TodoComponent/TodoComponent';

interface Props {
  todos: Todo[];
  onRemove: (todoData: Todo) => void;
  tempTodo: Todo | null;
  onChangeTodo: (todo: Todo, value: boolean | string) => void;
  loadingTodosId: number[];
}

export const MainTodoApp: FC<Props> = React.memo(({
  todos,
  onRemove,
  tempTodo,
  onChangeTodo,
  loadingTodosId,
}) => {
  const isNewTodo = todos.every(({ id }) => id !== tempTodo?.id);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoComponent
              todo={todo}
              onRemove={onRemove}
              onChangeTodo={onChangeTodo}
              isTempTodo={loadingTodosId.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {isNewTodo && tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoComponent todo={tempTodo} isTempTodo={!!tempTodo} />
          </CSSTransition>
        )}

      </TransitionGroup>
    </section>
  );
});
