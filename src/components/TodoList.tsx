import React, { useContext } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../types/Todo';
import { AuthContext } from './Auth/AuthContext';
import { TitleContext } from './Context/TitleContext';
import { TodoComponent } from './TodoComponent';

interface Props {
  todos: Todo[],
  onRemoveTodo: (todoId: number) => Promise<void>,
  onUpdateTodo: (todoId: number, data: Partial<Todo>) => Promise<void>,
  isAdding: boolean,
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onUpdateTodo,
  onRemoveTodo,
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
            className="item"
          >
            <TodoComponent
              todo={todo}
              key={todo.id}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoComponent
              todo={{
                id: 0,
                userId: user?.id || 0,
                title: todoTitle,
                completed: false,
              }}
              onRemoveTodo={onRemoveTodo}
              onUpdateTodo={onUpdateTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
