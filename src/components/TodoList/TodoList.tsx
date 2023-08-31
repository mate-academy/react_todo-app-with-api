import React from 'react';
import '../../styles/transitions.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  tempTodo: Todo | null,
  onRemove: (todoId: number) => void,
  loadingTodos: number[],
  onUpdateTodo: (id: number, data: Partial<Todo>) => void
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onRemove,
  loadingTodos,
  onUpdateTodo,
}) => (
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
            onRemoveTodo={onRemove}
            loadingTodos={loadingTodos}
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
            onRemoveTodo={onRemove}
            loadingTodos={loadingTodos}
            onUpdateTodo={onUpdateTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
