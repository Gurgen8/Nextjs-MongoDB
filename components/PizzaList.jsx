import styles from "../styles/PizzaList.module.css";
import PizzaCard from "./PizzaCard"

const PizzaList = ({ pizzaList }) => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>THE BEST PIZZA IN TOWN</h1>
      <p className={styles.desc}>
        Combine the best with the convenience we love our customers and look forward to seeing us
      </p>
      <div className={styles.wrapper}>
        {pizzaList.map(pizza => {
          return  <PizzaCard key={pizza._id} pizza={pizza}  />
        })}
      </div>
    </div>
  );
};

export default PizzaList;
