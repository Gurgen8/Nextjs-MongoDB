import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Featured from "../components/Featured";
import PizzaList from "../components/PizzaList";
import styles from "../styles/Home.module.css";
import axios from "axios";
import AddButton from "../components/AddButton";
import Add from "../components/Add"

export default function Home({ pizzaList, admin }) {
  const [close, setClose] = useState(true)


  return (
    <div className={styles.container}>
      <Head>
        <title>Pizza Restaurant in Erevan</title>
        <meta name="description" content="Best pizza shop in town" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Featured />
      <PizzaList pizzaList={pizzaList} />
      {admin && <AddButton setClose={setClose} />}
      {!close  &&  <Add setClose={setClose}  /> }
    </div>
  );
}


export const getServerSideProps = async (ctx) => {
  const myCookie = ctx.req?.cookies.token || ""
  let admin = false

  if (myCookie === process.env.TOKEN) {
    admin = true
  };

  const result = await axios.get('http://localhost:3000/api/products');
  return {
    props: {
      pizzaList: result.data,
      admin

    },
  };
}