/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import cn from 'classnames';

import './styles/trasitiongroup.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { getFilteredTodos } from './utils/getFilteredTodos';

import { useTodosContext } from './context/TodosContext';

import { ErrorsContainer } from './components/ErrorsContainer/ErrorsContainer';
import { TodoItem } from './components/TodoItem/TodoItem';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';

import { Status } from './types/Status';
import { deleteTodo } from './api/todos';

export const App = () => {
  const {
    todos,
    errorMessage,
    tempTodo,
    setLoadingIds,
    setTodos,
    setErrorMessage,
  } = useTodosContext();
  const [status, setStatus] = useState<Status>(Status.All);

  const filteredTodos = getFilteredTodos(todos, status);

  function deletingTodo(todoId: number) {
    setLoadingIds(prev => [...prev, todoId]);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todoForDeleting => todoForDeleting.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingIds([]);
      });
  }

  return (
    <div className={cn('todoapp', { 'has-error': errorMessage })}>
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition timeout={300} key={todo.id} classNames="item">
                <TodoItem todo={todo} deletingTodo={deletingTodo} />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={tempTodo} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {!!todos.length && (
          <Footer
            status={status}
            setStatus={setStatus}
            deletingTodo={deletingTodo}
          />
        )}
      </div>

      <ErrorsContainer />
    </div>
  );
};
