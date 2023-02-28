import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  processingTodos: number[];
  onUpdateTodo: (id: number, title: string, status: boolean,) => void;
}

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  tempTodo,
  onDeleteTodo,
  processingTodos,
  onUpdateTodo,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoItem
            todo={todo}
            onDeleteTodo={onDeleteTodo}
            processingTodos={processingTodos}
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
            onDeleteTodo={onDeleteTodo}
            processingTodos={processingTodos}
            onUpdateTodo={onUpdateTodo}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
