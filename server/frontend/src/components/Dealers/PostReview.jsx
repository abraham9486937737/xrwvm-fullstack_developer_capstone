import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const params = useParams();
  const id = params.id;

  const curr_url = window.location.href;
  const root_url = curr_url.substring(0, curr_url.indexOf("postreview"));

  const dealer_url = root_url + `djangoapp/dealer/${id}`;
  const review_url = root_url + `djangoapp/add_review`;
  const carmodels_url = root_url + `djangoapp/get_cars`;

  // -----------------------------
  // Submit Review
  // -----------------------------
  const postreview = async () => {
    console.log("Post Review clicked");

    let name =
      sessionStorage.getItem("firstname") +
      " " +
      sessionStorage.getItem("lastname");

    if (name.includes("null")) {
      name = sessionStorage.getItem("username");
    }

    if (!model || !review || !date || !year) {
      alert("All details are mandatory");
      return;
    }

    if (!model.includes(" ")) {
      alert("Invalid car model selected");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const jsoninput = JSON.stringify({
      name: name,
      dealership: id,
      review: review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    });

    const res = await fetch(review_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsoninput,
    });

    const json = await res.json();
    console.log("Review response:", json);

    if (json.status === "Review added" || json.status === 200) {
      window.location.href = root_url + `dealer/${id}`;
    } else {
      alert("Review submission failed. Check console for details.");
    }
  };

  // -----------------------------
  // Fetch Dealer
  // -----------------------------
  const get_dealer = async () => {
    const res = await fetch(dealer_url);
    const retobj = await res.json();
    setDealer(retobj);
  };

  // -----------------------------
  // Fetch Car Models
  // -----------------------------
  const get_cars = async () => {
    const res = await fetch(carmodels_url);
    const retobj = await res.json();
    setCarmodels(retobj.CarModels);
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, []);

  return (
    <div>
      <Header />
      <div style={{ margin: "5%" }}>
        <h1 style={{ color: "darkblue" }}>{dealer.full_name}</h1>

        <textarea
          id="review"
          cols="50"
          rows="7"
          onChange={(e) => setReview(e.target.value)}
        ></textarea>

        <div className="input_field">
          Purchase Date{" "}
          <input type="date" onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input_field">
          Car Make
          <select onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>
              Choose Car Make and Model
            </option>

            {carmodels.map((carmodel) => (
              <option
                key={carmodel.CarMake + carmodel.CarModel}
                value={carmodel.CarMake + " " + carmodel.CarModel}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            onChange={(e) => setYear(e.target.value)}
            max={2023}
            min={2015}
          />
        </div>

        <div>
          <button type="button" className="postreview" onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
