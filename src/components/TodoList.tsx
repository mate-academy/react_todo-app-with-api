import { useState } from 'react';
import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { TodoItem } from './TodoItem';

type Props = {
  visibleTodos: Todo[];
  removeTodo: (todoId: number) => void;
  tempTodo: string;
  updatingAndDeletingCompletedTodos: Todo[] | [];
  setUpdatingAndDeletingCompletedTodos: (
    deletingCompletedTodos: Todo[] | [],
  ) => void;
  changeTodo: (todo: Todo) => void;
  editingTitle: number;
  setEditingTitle: (editingTitle: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  removeTodo,
  tempTodo,
  updatingAndDeletingCompletedTodos,
  setUpdatingAndDeletingCompletedTodos,
  changeTodo,
  editingTitle,
  setEditingTitle,
}) => {
  const [titleEdit, setTitleEdit] = useState<string>('');

  function deleteTodo(todo: Todo) {
    removeTodo(todo.id);
    setUpdatingAndDeletingCompletedTodos([todo]);
  }

  function handleChangeSubmit(todo: Todo) {
    if (todo.title === titleEdit) {
      setEditingTitle(0);

      return;
    }

    if (!titleEdit) {
      deleteTodo(todo);

      return;
    }

    changeTodo({ ...todo, title: titleEdit.trim() });
    setUpdatingAndDeletingCompletedTodos([todo]);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            changeTodo={changeTodo}
            updatingAndDeletingCompletedTodos={
              updatingAndDeletingCompletedTodos
            }
            setUpdatingAndDeletingCompletedTodos={
              setUpdatingAndDeletingCompletedTodos
            }
            editingTitle={editingTitle}
            setEditingTitle={setEditingTitle}
            titleEdit={titleEdit}
            setTitleEdit={setTitleEdit}
            handleChangeSubmit={handleChangeSubmit}
            deleteTodo={deleteTodo}
          />
        );
      })}

      {tempTodo && <TempTodoItem tempTodo={tempTodo} />}
    </section>
  );
};
