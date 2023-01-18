type Props = {

};

export const TodoTitleField: React.FC<Props> = () => {
  return (
    <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        defaultValue="JS"
      />
    </form>
  );
};
