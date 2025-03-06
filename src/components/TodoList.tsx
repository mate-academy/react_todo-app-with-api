/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
// import classNames from 'classnames';
// import { TodoLoader } from './TodoLoader';
import { TodoItem } from './TodoItem';
import { TempTodo } from './TempTodo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => void;
  loadingTodoIds: Set<number>;
  onToggle: (todo: Todo) => void;
  editTodo: (todo: Todo, newTodoTitle: string) => void;
  titleEditingId: number | null;
  setTitleEditingId: (id: number | null) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  loadingTodoIds,
  onToggle,
  editTodo,
  titleEditingId,
  setTitleEditingId,
}) => {
  // const [newTodoTitle, setNewTodoTitle] = useState('');
  // const titleInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   if (titleInputRef.current) {
  //     titleInputRef.current.focus();
  //   }
  // }, [titleEditingId]);

  // const handleDoubleClick = (todo: Todo) => {
  //   setTitleEditingId(todo.id);
  //   setNewTodoTitle(todo.title);
  // };

  // const handleSubmit = (
  //   event: React.FormEvent<HTMLFormElement>,
  //   todo: Todo,
  // ) => {
  //   event.preventDefault();
  //   editTodo(todo, newTodoTitle.trim());
  // };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        // const { id, title, completed } = todo;

        return (
          // <div
          //   data-cy="Todo"
          //   className={classNames('todo', {
          //     completed: completed,
          //   })}
          //   key={id}
          // >
          //   <label className="todo__status-label" htmlFor={`todoStatus-${id}`}>
          //     <input
          //       id={`todoStatus-${id}`}
          //       data-cy="TodoStatus"
          //       type="checkbox"
          //       className="todo__status"
          //       checked={completed}
          //       onChange={() => onToggle(todo)}
          //     />
          //   </label>
          //   {titleEditingId === id ? (
          //     <form
          //       onSubmit={event => handleSubmit(event, todo)}
          //       onBlur={event => handleSubmit(event, todo)}
          //       onKeyUp={event => {
          //         if (event.key === 'Escape') {
          //           setTitleEditingId(null);
          //         }
          //       }}
          //     >
          //       <input
          //         data-cy="TodoTitleField"
          //         type="text"
          //         className="todo__title-field"
          //         placeholder="Empty todo will be deleted"
          //         value={newTodoTitle}
          //         onChange={event => setNewTodoTitle(event.target.value)}
          //         ref={titleInputRef}
          //       />
          //     </form>
          //   ) : (
          //     <>
          //       <span
          //         data-cy="TodoTitle"
          //         className="todo__title"
          //         onDoubleClick={() => handleDoubleClick(todo)}
          //       >
          //         {title}
          //       </span>
          //       <button
          //         type="button"
          //         className="todo__remove"
          //         data-cy="TodoDelete"
          //         onClick={() => onDeleteTodo(id)}
          //       >
          //         ×
          //       </button>
          //     </>
          //   )}
          //   <TodoLoader loadingTodoIds={loadingTodoIds} todoId={id} />
          // </div>
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            titleEditingId={titleEditingId}
            setTitleEditingId={setTitleEditingId}
            onDeleteTodo={onDeleteTodo}
            loadingTodoIds={loadingTodoIds}
            editTodo={editTodo}
          />
        );
      })}

      {tempTodo && (
        // <div
        //   data-cy="Todo"
        //   className={classNames('todo', {
        //     completed: tempTodo.completed,
        //   })}
        // >
        //   <label
        //     className="todo__status-label"
        //     htmlFor={`todoStatus-${tempTodo.id}`}
        //   >
        //     <input
        //       id={`todoStatus-${tempTodo.id}`}
        //       data-cy="TodoStatus"
        //       type="checkbox"
        //       className="todo__status"
        //     />
        //   </label>
        //   <span data-cy="TodoTitle" className="todo__title">
        //     {tempTodo.title}
        //   </span>
        //   <button type="button" className="todo__remove" data-cy="TodoDelete">
        //     ×
        //   </button>
        //   <TodoLoader loadingTodoIds={loadingTodoIds} todoId={0} />
        // </div>
        <TempTodo tempTodo={tempTodo} loadingTodoIds={loadingTodoIds} />
      )}
    </section>
  );
};
