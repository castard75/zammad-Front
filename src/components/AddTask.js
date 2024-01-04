import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddTask() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [recurrence, setrecurrence] = useState();
  const [ponctuel, setPonctuel] = useState();
  const [technicien, setTechnicien] = useState();
  const [client, setClient] = useState();

  ////---------------------Create task--------------------////
  const handleTask = () => {
    console.log("add Task");
    // {
    //   "title": "string",
    //   "description": "string",
    //   "recurrence": "string",
    //   "ponctuel": "string",
    //   "technicien": "string",
    //   "client": "string"
    // }
  };

  //--------------------------STATE-------------------------//
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchDatas = axios
      .get("https://localhost:8000/api/techniciens")
      .then((res) => {
        const data = res.data["hydra:member"];
        setList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (list !== null) {
    console.log(list);
  }

  console.log(technicien);

  return (
    <>
      <button
        type="button"
        class="btn btn-light"
        data-toggle="modal"
        data-target="#exampleModal"
        onClick={handleTask}
      >
        Nouvelle tâche
      </button>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Nouvelle Tâche
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Technicien</label>
                  <select
                    class="form-control"
                    id="exampleFormControlSelect1"
                    onChange={(e) => {
                      setTechnicien(e.target.value);
                    }}
                  >
                    {list?.map((item) => {
                      return <option> {item.name} </option>;
                    })}
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Client</label>
                  <select class="form-control" id="exampleFormControlSelect1">
                    <option>Ifr</option>
                    <option>Garage</option>
                    <option>orange</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="exampleFormControlSelect1">Appareil</label>
                  <select class="form-control" id="exampleFormControlSelect1">
                    <option>Ifr</option>
                    <option>Garage</option>
                    <option>orange</option>
                  </select>
                </div>
                <div class="form-group">
                  <label Htmlfor="exampleFormControlInput1">Titre</label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="ifr..."
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                <div class="form-group">
                  <label Htmlfor="exampleFormControlInput1">Description</label>
                  <textarea
                    type="email"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="maintenance chez ifr...."
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div class="form-group">
                  <label Htmlfor="exampleFormControlInput1">date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="ifr..."
                  />
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Annuler
              </button>
              <button type="button" class="btn btn-primary">
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
