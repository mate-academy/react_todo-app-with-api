import React, { useEffect } from 'react';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';
import { useAuthorize } from '../context/AutorizationProvider';
import { getTodos } from '../api/todos';
import { useTodos } from '../context/TodosProvider';
import { TodoFooter } from './TodoFooter';
import { ErrorMessage } from '../types/Errors';
import { SingleTodo } from './Todo';
import { Todo } from '../types/Todo';

export const TodoList: React.FC = () => {
  const {
    todos,
    filteredTodos,
    setTodos,
    setErrorMessage,
    tempTodo,
  } = useTodos();

  const USER_ID = useAuthorize();

  useEffect(() => {
    if (USER_ID) {
      getTodos(USER_ID)
        .then(setTodos)
        .catch(() => setErrorMessage(ErrorMessage.Load));
    }
  }, [USER_ID, setTodos, setErrorMessage]);

  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        <TransitionGroup>
          {filteredTodos.length > 0 && (
            filteredTodos.map((todo: Todo) => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <SingleTodo todo={todo} />
              </CSSTransition>
            ))
          )}
          {tempTodo && (
            <CSSTransition
              key={0}
              timeout={300}
              classNames="temp-item"
            >
              <SingleTodo todo={tempTodo} />
            </CSSTransition>
          )}
        </TransitionGroup>
      </section>
      {todos.length > 0 && (<TodoFooter />)}
    </>
  );
};
