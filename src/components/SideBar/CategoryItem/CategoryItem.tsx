import styles from './categoryItem.module.css';
import { NavLink } from 'react-router-dom';

interface CategoryItemProps {
  category: string;
  path: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, path }) => {
  return (
    <NavLink
      className={({ isActive }) => [styles.categoryItem, isActive && styles.active].join(' ')}
      to={path}
    >
      <div
        className={[styles.categoryItem_icon, styles[`categoryItem_icon_default`]].join(' ')}
      ></div>
      {category}
    </NavLink>
  );
};

export default CategoryItem;
