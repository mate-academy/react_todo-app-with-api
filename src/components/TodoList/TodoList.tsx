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
  todosOnChange: number[];
  tempTodo: Todo;
  removeTodoFromServer: (todoId: number) => void;
  changeTodoOnServer: (todoId: number, completed: boolean) => void;
  changeTitleOnServer: (todoId: number, title: string) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  todosOnChange,
  tempTodo,
  removeTodoFromServer,
  changeTodoOnServer,
  changeTitleOnServer,
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
              isAdding={todosOnChange.includes(todo.id)}
              changeTodoOnServer={changeTodoOnServer}
              changeTitleOnServer={changeTitleOnServer}
            />
          </CSSTransition>
        ))}

        {isAdding && (
          <CSSTransition
            key={tempTodo.id}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem
              key={tempTodo.id}
              todo={tempTodo}
              removeTodoFromServer={removeTodoFromServer}
              isAdding={isAdding}
              changeTodoOnServer={changeTodoOnServer}
              changeTitleOnServer={changeTitleOnServer}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
