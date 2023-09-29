import { useMemo, useState } from 'react';
import { useToDoContext } from '../../context/ToDo.context';
import { ToDoRow } from './ToDoRow';
import { Todo } from '../../types/Todo';
import { Filter } from '../ToDoFooter/types';

export const ToDoList = () => {
  const { todos, temporaryTodo, todoFilter } = useToDoContext();
  const [editedTodo, setEditedTodo] = useState<number | null>(null);

  const filteredTodo:Todo[] = useMemo(() => todos
    .filter(({ completed }:Todo) => todoFilter === Filter.All
    || (todoFilter === Filter.Completed && completed)
    || (todoFilter === Filter.Active && !completed)), [todos, todoFilter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo) => (
        <ToDoRow
          key={todo.id}
          todo={todo}
          isEdited={editedTodo === todo.id}
          editTodo={(todoId: number | null) => setEditedTodo(todoId)}
        />
      ))}
      {temporaryTodo && <ToDoRow todo={temporaryTodo as Todo} isDisabled />}
    </section>
  );
};
