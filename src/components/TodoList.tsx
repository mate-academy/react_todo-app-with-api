import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { TitleContext } from './Context/TitleContext';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[],
  onRemove: (todoId: number) => Promise<void>,
  onUpdate: (todoId: number, data: Partial<Todo>) => Promise<void>,
  isAdding: boolean,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onUpdate,
  onRemove,
  isAdding,
}) => {
  const user = useContext(AuthContext);
  const { todoTitle } = useContext(TitleContext);

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
              key={todo.id}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              todo={{
                id: 0,
                userId: user?.id || 0,
                title: todoTitle,
                completed: false,
              }}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
