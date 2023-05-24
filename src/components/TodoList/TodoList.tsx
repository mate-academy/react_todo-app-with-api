import { FC, useContext } from 'react';
import { AppTodoContext } from '../../contexts/AppTodoContext';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoList: FC = () => {
  const {
    visibleTodos,
    tempTodo,
  } = useContext(AppTodoContext);

  return (
    <section className="todoapp__main">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isTempTodo
        />
      )}
    </section>
  );
};
