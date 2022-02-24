import styles from "../styles/Cart.module.css";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useRouter } from "next/dist/client/router";
import { reset } from "../redux/CartSlice";
import axios from "axios"
import OrderDetails from "../components/OrderDetalis";
import PizzaCard from "../components/PizzaCard";

const Cart = () => {
  const cart = useSelector(state => state.cart);
  const [open, setOpen] = useState(false)
  const amount = cart.total;
  const currency = "USD";
  const dispatch = useDispatch();
  const style = { layout: "vertical" };
  const [cash, setCash] = useState(false);
  const router = useRouter()

  const createOrder = async (data) => {
    try {

      const res = await axios.post('http://localhost:3000/api/order', data);
      res.status === 201 && router.push("/orders/" + res.data._id)
      dispatch(reset())

    } catch (error) {

      console.log(error)

    }
  }


  const ButtonWrapper = ({ currency, showSpinner }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    useEffect(() => {
      dispatch({
        type: "resetOptions",
        value: {
          ...options,
          currency: currency,
        },
      });
    }, [currency, showSpinner]);

    return (
      <>
        {/* {showSpinner && isPending && <div className="spinner" />} */}
        <PayPalButtons
          style={style}
          disabled={false}
          forceReRender={[amount, currency, style]}
          fundingSource={undefined}
          createOrder={(data, actions) => {
            return actions.order
              .create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: currency,
                      value: amount,
                    },
                  },
                ],
              })
              .then((orderId) => {
                // Your code here after create the order
                return orderId;
              });
          }}
          onApprove={function (data, actions) {
            return actions.order.capture().then(function (details) {
              const shipping = details.purchase_units[0].shipping;
              createOrder({
                customer: shipping.name.full_name,
                address: shipping.address.address_line_1,
                total: cart.total,
                method: 1,
              });
            });
          }}
        />
      </>
    );
  };


  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <table className={styles.table}>
          <tr className={styles.trTitle}>
            <th>Product</th>
            <th>Name</th>
            <th>Extras</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
          </tr>
          {cart.products.map(p => {
            return (
              <tr className={styles.tr} key={p._id}>
                <td>
                  <div className={styles.imgContainer}>
                    <Image
                      src={p.img}
                      layout="fill"
                      objectFit="cover"
                      alt=""
                    />
                  </div>
                </td>
                <td>
                  <span className={styles.name}>{p.title}</span>
                </td>
                <td>
                  <span className={styles.extras}>
                    {p.extraOptions.map(e => {
                      return <spann key={e._id}>{e.text}</spann>
                    })}
                  </span>
                </td>
                <td>
                  <span className={styles.price}>{p.price}</span>
                </td>
                <td>
                  <span className={styles.quantity}>{p.quantity}</span>
                </td>
                <td>
                  <span className={styles.total}>{p.price * p.quantity}</span>
                </td>
              </tr>

            )

          })}

        </table>
      </div>
      <div className={styles.right}>
        <div className={styles.wrapper}>
          <h2 className={styles.title}>CART TOTAL</h2>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Subtotal:</b>{cart.total} $
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Discount:</b>{cart.total / 100 * 5} $
          </div>
          <div className={styles.totalText}>
            <b className={styles.totalTextTitle}>Total:</b>{cart.total - cart.total / 100 * 5} $
          </div>
          {open ? (
            <div className={styles.paymentMethods}>
              <button
                className={styles.payButton}
                onClick={() => setCash(true)}
              >
                CASH ON DELIVERY
              </button>
              <PayPalScriptProvider
                options={{
                  "client-id": "AbMYCJUIJrgD1w51MaRo4FKGSp8afMIZQlIUZF__aU4lsbiVpWFEM9mlMUxyiYGK5uIpqkMrbSQKBeQS",
                  components: "buttons",
                  currency: "USD",
                  "disable-funding": "credit,card,p24",
                }}
              >
                <ButtonWrapper currency={currency} showSpinner={false} />
              </PayPalScriptProvider>
            </div>
            // sb-ltq47814086919@business.example.com
            // hCOksH/7
          ) : (
            <button onClick={() => setOpen(true)} className={styles.button}>
              CHECKOUT NOW!
            </button>

          )}
        </div>
      </div>
      {cash && <OrderDetails total ={cart.total} createOrder={createOrder}/> }
    </div>
  );
};

export default Cart;
