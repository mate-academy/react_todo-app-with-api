import classNames from 'classnames';
import { useState } from 'react';
import { changeTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  temp?: boolean,
  deleteTodo?: (id: number) => void,
  updateTodos?: (type?: string) => void
};

export const Item: React.FC<Props> = ({
  todo, temp, deleteTodo, updateTodos,
}) => {
  const [loader, setLoader] = useState(false);
  const [change, setChange] = useState(false);
  const [title, setTitle] = useState(todo.title);

  const activeLoader = () => {
    if (deleteTodo) {
      deleteTodo(todo.id);
      setLoader(true);
    }
  };

  const changeTodoCompleteHandler = (item: Todo, changeName:boolean) => {
    const result = item;

    setLoader(true);
    if (!changeName) {
      result.completed = !item.completed;
    } else {
      result.title = title;
    }

    if (updateTodos) {
      changeTodo(result.id, result).then(() => {
        const typeFilter = localStorage.getItem('filter');

        if (!typeFilter) {
          updateTodos();
        } else {
          updateTodos(typeFilter);
        }

        setLoader(false);
        setChange(false);
      });
    }
  };

  const changeTitleTodoHandler = (item: Todo, event: any) => {
    if (event.key === 'Escape') {
      setChange(false);
      setTitle(item.title);
    }
  };

  const onChancheHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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
          checked={todo.completed}
          onClick={() => changeTodoCompleteHandler(todo, false)}
        />
      </label>
      {
        change ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            changeTodoCompleteHandler(todo, true);
          }}
          >
            <input
              value={title}
              className="todo__title-field"
              onChange={onChancheHandler}
              onKeyDown={(event) => changeTitleTodoHandler(todo, event)}
              onBlur={() => changeTodoCompleteHandler(todo, true)}
            />
          </form>
        ) : (
          <>
            <span
              className="todo__title"
              onDoubleClick={() => setChange(true)}
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              onClick={activeLoader}
            >
              ×

            </button>
          </>
        )
      }

      <div className={
        classNames('modal overlay', {
          'is-active': temp || loader,
        })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
