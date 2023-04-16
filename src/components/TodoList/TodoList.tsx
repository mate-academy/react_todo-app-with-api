import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import './TodoList.scss';

import { TodoItem } from '../TodoItem';

import { TodoRich } from '../../types/TodoRich';
import { TodoRichEditable } from '../../types/TodoRichEditable';

type Props = {
  todos: TodoRich[];
  tempTodo: TodoRich | null;
  onTodoDelete: (todoId: number) => Promise<void>;
  onTodoUpdate: (todoId: number, updatedData: TodoRichEditable)
  => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  onTodoUpdate,
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
            onTodoDelete={onTodoDelete}
            onTodoUpdate={onTodoUpdate}
          />
        </CSSTransition>
      ))}

      {tempTodo && (
        <CSSTransition
          key={tempTodo.id}
          timeout={300}
          classNames="temp-item"
        >
          <TodoItem todo={tempTodo} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
