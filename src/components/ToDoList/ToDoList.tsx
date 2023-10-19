import { useToDoContext } from '../../context/ToDo.context';
import { ToDoRow } from './ToDoRow';
import { Todo } from '../../types/Todo';
import { useTodoList } from './useTodoList';

export const ToDoList = () => {
  const { todos, temporaryTodo } = useToDoContext();
  const { editedTodo, setEditedTodo } = useTodoList();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.selected.map((todo) => (
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
