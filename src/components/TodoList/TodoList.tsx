import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoInfo } from '../TodoInfo';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  loadingTodos: number[];
  tempTodo: Todo | null;
  removeTodo: (todoId: number) => void;
  editTodo: (todoId: number, data: Partial<Todo>) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  loadingTodos,
  tempTodo,
  removeTodo,
  editTodo,
}) => {
  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map((todo) => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoInfo
              todo={todo}
              loadingTodos={loadingTodos}
              removeTodo={removeTodo}
              editTodo={editTodo}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoInfo
              todo={tempTodo}
              loadingTodos={loadingTodos}
              removeTodo={removeTodo}
              editTodo={editTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
