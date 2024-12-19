import React, { useState } from 'react';
import Loader from './Loader';
import { Todo, TodoTitleOrCompleted } from '../types/Todo';
import classNames from 'classnames';
import { SelectedBy } from '../types/SelectedBy';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  selectedBy: SelectedBy;
  tempTodo: Todo | null;
  onDelete: (todo: Todo) => void;
  isLoading: boolean;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  onEdit: (data: TodoTitleOrCompleted, id: number) => void;
  editCheckbox: (data: TodoTitleOrCompleted, id: number) => void;
  loadingTodos: Record<number, boolean>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  selectedBy,
  isLoading,
  tempTodo,
  setTempTodo,
  onDelete,
  onEdit,
  editCheckbox,
  loadingTodos,
}) => {
  const [isOpenInput, setIsOpenInput] = useState(false);
  const filteredTodos = todos.filter(todo =>
    selectedBy === SelectedBy.completed ? todo.completed : !todo.completed,
  );

  const  handleDubleClick = (currTodo: Todo) => {
    setIsOpenInput(true);
    setTempTodo(currTodo);
  }

  const  editTitle = (title: string, currTodo: Todo) =>{
    if (!title.trim()) {
      onDelete(currTodo);

      return;
    }

    if (title.trim() === currTodo.title) {
      setTempTodo(null);
      setIsOpenInput(false);

      return;
    }

    onEdit({ title: title.trim() }, currTodo.id);
  }

  const handleKeyUp = () => {
    setIsOpenInput(false);
    setTempTodo(null);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {(selectedBy === SelectedBy.all ? todos : filteredTodos).map(todo => {
        const isActiveLoader =
          loadingTodos[todo.id] ||
          (tempTodo?.id === todo.id && isLoading) ||
          (isLoading && !tempTodo);

        return (
          <div
            data-cy="Todo"
            key={todo.id}
            className={classNames('todo', {
              completed: todo.completed,
            })}
          >
            <TodoItem
              todo={todo}
              editCheckbox={editCheckbox}
              deleteTodo={onDelete}
              onDubleClick={handleDubleClick}
              onTitle={editTitle}
              onEsc={handleKeyUp}
              isCompleted={tempTodo?.completed || todo.completed}
              isOpenForm={tempTodo?.id === todo.id && isOpenInput}
            />

            <Loader isActive={isActiveLoader} />
          </div>
        );
      })}

      {tempTodo?.id === 0 && (
        <div
          data-cy="Todo"
          key={tempTodo.id}
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
        >
          <TodoItem todo={tempTodo} />
          <Loader />
        </div>
      )}
    </section>
  );
};
