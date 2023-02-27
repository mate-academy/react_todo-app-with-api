import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todo: Todo) => void;
  tempTodo: Todo | null;
  onEditStatus: (todoToEdit: Todo, status: boolean) => void;
  onEditTitle: (todoToEdit: Todo, title: string) => void;
  processedTodos: Todo[];
};

export const TodoList: React.FC<Props> = React.memo(({
  todos,
  onDelete,
  tempTodo,
  onEditStatus,
  onEditTitle,
  processedTodos,
}) => (
  <section className="todoapp__main">
    <TransitionGroup>
      {todos.map(todo => (
        <CSSTransition
          key={todo.id}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            onEditStatus={onEditStatus}
            onEditTitle={onEditTitle}
            processedTodos={processedTodos}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={0}
          timeout={300}
          classNames="item"
        >
          <TodoInfo
            todo={tempTodo}
            onDelete={onDelete}
            onEditStatus={onEditStatus}
            onEditTitle={onEditTitle}
            processedTodos={processedTodos}
          />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
));
