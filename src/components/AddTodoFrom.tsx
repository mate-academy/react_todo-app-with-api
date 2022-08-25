import { FC, memo, useState } from "react";

export const AddTodoFrom: FC = memo(() => {
  const [title, setTitle] = useState('');

  return (
    <form onSubmit={addNewTodoHandler}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
    </form>
  );
});
