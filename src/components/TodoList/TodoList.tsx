import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleChangeTodo: (updatingTodo: Todo) => void;
  deleteTodo: (deletingTodo: Todo) => void;
  setErrorMessage: (errorMessage: string) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleChangeTodo,
  deleteTodo,
  setErrorMessage,
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
            <TodoItem
              key={todo.id}
              todo={todo}
              handleChangeTodo={handleChangeTodo}
              deleteTodo={deleteTodo}
              setErrorMessage={setErrorMessage}
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
              tempTodoId={tempTodo.id}
              handleChangeTodo={handleChangeTodo}
              setErrorMessage={setErrorMessage}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
