import React from 'react';

import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import { TempTodo } from '../TempTodo';
import { TodoInfo } from '../TodoInfo';

import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  isAdding: boolean;
  todoTitle: string;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
  onToggleTodo: (todoId: number, isCompleted: boolean) => void;
  selectedTodoId: number[];
  onChangeTodoTitle: (todoId: number, title: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  todoTitle,
  onDeleteTodo,
  deletedTodoIds,
  onToggleTodo,
  selectedTodoId,
  onChangeTodoTitle,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
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
            onDeleteTodo={onDeleteTodo}
            deletedTodoIds={deletedTodoIds}
            onToggleTodo={onToggleTodo}
            selectedTodoId={selectedTodoId}
            onChangeTodoTitle={onChangeTodoTitle}
          />
        </CSSTransition>
      ))}

      {isAdding && (
        <CSSTransition timeout={300} classNames="item">
          <TempTodo todoTitle={todoTitle} />
        </CSSTransition>
      )}
    </TransitionGroup>
  </section>
);
