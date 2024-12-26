import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deleteTodoHandler: (todoId: number) => Promise<void>;
  todoIdsToDel: number[];
  todoIdsToUpdate: number[];
  updateTodoHandler: (todo: Todo) => Promise<void>;
};

export const TodoList: FC<Props> = props => {
  const {
    todos,
    tempTodo,
    deleteTodoHandler,
    todoIdsToDel,
    todoIdsToUpdate,
    updateTodoHandler,
  } = props;

  const [editedTodoId, setEditedTodoId] = useState<number | null>(null);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleteTodoHandler={deleteTodoHandler}
          isLoading={
            todoIdsToDel.includes(todo.id) || todoIdsToUpdate.includes(todo.id)
          }
          updateTodoHandler={updateTodoHandler}
          isEditMode={editedTodoId === todo.id}
          setEditedTodoId={setEditedTodoId}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isLoading
          deleteTodoHandler={deleteTodoHandler}
          updateTodoHandler={updateTodoHandler}
          setEditedTodoId={setEditedTodoId}
        />
      )}
    </section>
  );
};
