import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../../utils/TodosContext';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
}

export const Main: React.FC<Props> = ({ todos, tempTodo }) => {
  const { processingTodos } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {todos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              title={todo.title}
              completed={todo.completed}
              id={todo.id}
              isLoading={processingTodos.includes(todo.id)}
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
              title={tempTodo.title}
              completed={tempTodo.completed}
              id={tempTodo.id}
              isLoading
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
