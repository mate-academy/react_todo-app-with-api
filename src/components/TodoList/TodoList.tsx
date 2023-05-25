import React, { useContext } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoListContext } from '../../context/TodoListContext';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: React.FC = React.memo(() => {
  const {
    visibleTodos,
    tempTodo,
    completedTodoIdList,
  } = useContext(TodoListContext);

  return (
    <section className="todoapp__main">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              todo={todo}
              isProcessing={completedTodoIdList.includes(todo.id)}
            />
          </CSSTransition>
        ))}

        {tempTodo && (
          <CSSTransition
            key={0}
            timeout={300}
            classNames="temp-item"
          >
            <TodoItem todo={tempTodo} isProcessing />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
});
