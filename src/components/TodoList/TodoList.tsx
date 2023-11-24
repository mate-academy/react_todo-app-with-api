import React from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { RootState } from '../../redux/store';
import { TodoItem } from '../TodoItem';
import { selectFilteredTodos } from '../../redux/selectors';

export const TodoList: React.FC = React.memo(() => {
  const filteredTodos = useSelector(selectFilteredTodos);
  const tempTodo = useSelector((state: RootState) => state.todos.tempTodo);
  const combinedTodos = tempTodo ? [...filteredTodos, tempTodo] : filteredTodos;
  const deletingTodoIds = useSelector(
    (state: RootState) => state.todos.deletingTodoIds,
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {combinedTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="temp-item"
            unmountOnExit={todo === tempTodo}
          >
            <TodoItem
              todo={todo}
              isTemporary={todo === tempTodo}
              isDeleting={deletingTodoIds.includes(todo.id)}
            />
          </CSSTransition>
        ))}
      </TransitionGroup>
    </section>
  );
});
