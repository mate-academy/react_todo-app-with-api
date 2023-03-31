import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  deleteTodo?: (id: number) => void
  changeTodo: (id: number, completed: boolean) => void
  handleTodoClick: (todo: Todo) => void
  changeTodoTitle: (id: number, title: string) => void
  handleTodoKeyPress: (key: string, id: number, title: string) => void
  handleTodoBlur: (id: number, title: string) => void,
  setSelectedTodo: (todo: Todo) => void
  todo: Todo
  isEditing: boolean
  selectedTodo: Todo | undefined
  isLoading: boolean
};

export const Item: React.FC<Props> = ({
  deleteTodo,
  changeTodo,
  handleTodoClick,
  handleTodoKeyPress,
  handleTodoBlur,
  setSelectedTodo,
  todo,
  isEditing,
  selectedTodo,
  isLoading,
}) => {
  const [inputValue, setInput] = useState(todo.title);

  const changeInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  function handleClick() {
    changeTodo(todo.id, !todo.completed);
  }

  const activeLoader = () => {
    if (deleteTodo) {
      deleteTodo(todo.id);
    }
  };

  return (
    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => {
            handleClick(); setSelectedTodo(todo);
          }}
        />
      </label>

      {isEditing && selectedTodo === todo ? (
        <input
          type="text"
          className="todo__title-field"
          value={inputValue}
          onChange={changeInputValue}
          onKeyUp={(event) => handleTodoKeyPress(
            event.key, todo.id, inputValue,
          )}
          onBlur={() => handleTodoBlur(todo.id, inputValue)}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      ) : (
        <div
          className="todo__title"
          onDoubleClick={() => {
            handleTodoClick(todo);
            setInput(todo.title);
          }}
        >
          {todo.title}
        </div>
      )}

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          activeLoader(); setSelectedTodo(todo);
        }}
      >
        ×
      </button>
      <div className={
        classNames('modal overlay', {
          'is-active': isLoading && selectedTodo === todo,
        })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
