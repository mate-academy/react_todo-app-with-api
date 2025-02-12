/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[] | null;
  toggleTodo: (id: number) => void;
  updatingTodoIds: number[];
  handleDelete: (id: number) => void;
  deletingTodoIds: number[];
  editingId: number | null;
  setEditingId: Dispatch<SetStateAction<number | null>>;
  setTitle: Dispatch<SetStateAction<string>>;
  title: string;
  renameTodo: (id: number, title: string) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  toggleTodo,
  updatingTodoIds,
  handleDelete,
  deletingTodoIds,
  editingId,
  setEditingId,
  renameTodo,
  tempTodo,
}) => {
  const [changingTitle, setChangingTitle] = useState<string>('');
  const handleTitleChange = (todoId: number) => {
    if (changingTitle.trim() === '') {
      handleDelete(todoId);
    } else if (
      changingTitle !== todos?.find(todo => todo.id === todoId)?.title
    ) {
      renameTodo(todoId, changingTitle.trim());
    } else {
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setChangingTitle('');
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleBlur = () => {
    handleTitleChange(editingId as number);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            editingId={editingId}
            changingTitle={changingTitle}
            updatingTodoIds={updatingTodoIds}
            deletingTodoIds={deletingTodoIds}
            setEditingId={setEditingId}
            setChangingTitle={setChangingTitle}
            toggleTodo={toggleTodo}
            handleTitleChange={handleTitleChange}
            handleBlur={handleBlur}
            handleKeyUp={handleKeyUp}
            handleDelete={handleDelete}
            isTempTodo={false}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          editingId={editingId}
          changingTitle={changingTitle}
          updatingTodoIds={updatingTodoIds}
          deletingTodoIds={deletingTodoIds}
          setEditingId={setEditingId}
          setChangingTitle={setChangingTitle}
          toggleTodo={toggleTodo}
          handleTitleChange={handleTitleChange}
          handleBlur={handleBlur}
          handleKeyUp={handleKeyUp}
          handleDelete={handleDelete}
          isTempTodo={true}
        />
      )}
    </section>
  );
};
