type Props = {
  name: string,
  data_cy: string
  href: string,
  filter: string,
  onClick: ()=> void,
};

export const FilterButton = ({
  name, data_cy, href, filter, onClick,
}: Props) => (
  <a
    data-cy={data_cy}
    href={href}
    className={filter}
    onClick={onClick}
  >
    {name}
  </a>
);
