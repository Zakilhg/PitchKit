import { FiRefreshCw, FiShield, FiTruck } from "react-icons/fi";
import features from "../css/features.module.css";

const ITEMS = [
  {
    icon: FiTruck,
    title: "Free shipping",
    text: "On every order over $100, tracked to your door.",
  },
  {
    icon: FiShield,
    title: "Secure checkout",
    text: "Card details are handled by the payment provider, never stored by us.",
  },
  {
    icon: FiRefreshCw,
    title: "30-day returns",
    text: "Wrong size? Send it back unworn within 30 days.",
  },
];

const Features = () => {
  return (
    <section className={features.band} aria-label="Why shop with us">
      <ul className={`container ${features.list}`}>
        {ITEMS.map(({ icon: Icon, title, text }) => (
          <li className={features.item} key={title}>
            <span className={features.icon} aria-hidden="true">
              <Icon />
            </span>
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Features;
