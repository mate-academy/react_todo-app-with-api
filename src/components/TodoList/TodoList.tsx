import React, { useContext, useRef, useEffect } from 'react';
import { TodosContext } from '../../store/store';
import { TodoItem } from '../TodoItem';
import { Status } from '../../types/enums/Status';
import { Todo } from '../../types/Todo';

const filterTodoByStatus = (
  list: Todo[],
  status: Status = Status.All,
): Todo[] => {
  switch (status) {
    case Status.Active:
      return list.filter(todo => !todo.completed);

    case Status.Completed:
      return list.filter(todo => todo.completed);

    default:
      return list;
  }
};

interface Props {
  filterParam: Status;
}

export const TodoList: React.FC<Props> = ({ filterParam }) => {
  const checkbox = useRef<HTMLInputElement>(null);
  const { todos, tempTodo, activeTodoIds } = useContext(TodosContext);

  const filteredTodos = filterTodoByStatus(todos, filterParam);

  useEffect(() => {
    if (checkbox.current) {
      checkbox.current.checked = todos.every(elem => elem.completed);
    }
  }, [todos]);

  return (
    <>
      {filteredTodos.map(todo => {
        const isActive = Boolean(activeTodoIds.find(num => num === todo.id));

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isActive={isActive}
          />
        );
      })}
      {tempTodo
        && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            isActive={Boolean('isActive')}
          />
        )}
    </>
  );
};
