import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './TodoListAnimations.scss';

import { useEffect } from 'react';
import { TodoItem } from '../TodoItem';

import { UseTodosContext } from '../../utils/TodosContext';

export const TodoList = () => {
  const context = UseTodosContext();

  const {
    filteredTodos,
    tempTodo,
    isCompletedTodosCleared,
    setIsCompletedTodosCleared,
  } = context;

  useEffect(() => {
    if (isCompletedTodosCleared) {
      setIsCompletedTodosCleared(false);
    }
  });

  return (
    <section data-cy="TodoList" className="todoapp__main">
      <TransitionGroup>
        {filteredTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
            />

          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem key={tempTodo.id} todo={tempTodo} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
