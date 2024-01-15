import React, { useContext, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { TodoItem } from '../TodoItem/TodoItem';
import { GlobalContext } from '../GlobalContextProvider';
import { Status } from '../../types/Status';

interface Props {
  textField: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = React.memo(({ textField }) => {
  const { todos, filterBy, tempTodo } = useContext(GlobalContext);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

  const visibleTodos = useMemo(() => {
    switch (filterBy) {
      case Status.all:
        return todos;

      case Status.active:
        return todos.filter(todo => !todo.completed);

      case Status.completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [filterBy, todos]);

  return (
    <ul className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => (
          <CSSTransition
            key={todo.id}
            timeout={300}
            classNames="item"
          >
            <TodoItem
              key={todo.id}
              todo={todo}
              editingTodoId={editingTodoId}
              setEditingTodoId={setEditingTodoId}
              titleInput={textField}
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
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </ul>
  );
});
