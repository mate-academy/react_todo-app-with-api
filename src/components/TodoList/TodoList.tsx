import React from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  isRemoving: number;
  tempTodo: Todo;
  removeTodoFromServer: (todoId: number) => void;
  changeTodoOnServer: (todoId: number, completed: boolean) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  isRemoving,
  tempTodo,
  removeTodoFromServer,
  changeTodoOnServer,
}) => {
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
              key={todo.id}
              todo={todo}
              removeTodoFromServer={removeTodoFromServer}
              isAdding={isRemoving === todo.id}
              changeTodoOnServer={changeTodoOnServer}
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
              key={tempTodo.id}
              todo={tempTodo}
              removeTodoFromServer={removeTodoFromServer}
              isAdding={isAdding}
              changeTodoOnServer={changeTodoOnServer}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
