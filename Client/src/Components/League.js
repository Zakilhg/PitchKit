import React, {useState, useEffect} from 'react'
import axios from "axios";
import { Link } from "react-router-dom";
import "./League.css"

const League = () => {
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        axios
          .get("http://127.0.0.1:8000/api/league")
          .then((response) => {
            setLeagues(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

  return (
    <>
        <section id="league" class="league-p1">
        {leagues.map((league) => (
          <div class="le-box" key={league.id}>
          <Link to={`/league`}>
            <img src={`http://127.0.0.1:8000/images/${league.image}`} alt="" />
            </Link>
          </div>
        ))}
      </section>
    </>
  )
}

export default League