import React, { useState } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { OneTodo } from '../OneTodo/OneTodo';

type Props = {
  todos: Todo[];
  loadingTodoId: number[];
  onDeleteTodo: (todoIds: number[]) => void,
  tempTodo: Todo | null,
  onUpdateTodos: (newTodos: Todo[]) => void,
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingTodoId,
  onDeleteTodo,
  tempTodo,
  onUpdateTodos,
}) => {
  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>('');

  const visibleTodos = tempTodo !== null ? [...todos, tempTodo] : todos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <OneTodo
              todo={todo}
              loadingTodoId={loadingTodoId}
              onDeleteTodo={onDeleteTodo}
              onUpdateTodos={onUpdateTodos}
              editedTodoId={editedTodoId}
              onSetEditedTodoId={setEditedTodoId}
              editedTitle={editedTitle}
              onSetEditedTitle={setEditedTitle}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
};
