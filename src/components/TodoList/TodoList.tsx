import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { Error } from '../../types/Error';

interface Props {
  todos: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  TodoUpdate: (todo: Todo) => void;
  setErrorText: (error: Error) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  tempTodo,
  TodoUpdate,
  setErrorText,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition key={todo.id} timeout={250} classNames="item">
            <TodoItem
              todo={todo}
              TodoUpdate={TodoUpdate}
              setErrorText={setErrorText}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        ))}
        {tempTodo && (
          <CSSTransition key={tempTodo.id} timeout={250} classNames="item">
            <TodoItem
              todo={tempTodo}
              TodoUpdate={TodoUpdate}
              setErrorText={setErrorText}
              deleteTodo={deleteTodo}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
