import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddTask() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [recurrence, setRecurrence] = useState();
  const [date, setDate] = useState();
  const [technicien, setTechnicien] = useState();
  const [client, setClient] = useState();

  ////---------------------Create task--------------------////

  const makeTask = () => {
    console.log("add Task");
    console.log(date);

    const obj = {
      title: title,
      description: description,
      recurrence: recurrence,
      date: date,
      technicien: technicien,
      client: client,
    };

    // console.log(obj);

    axios
      .post("https://localhost:8000/api/tasks", obj, {
        headers: {
          "Content-Type": "application/ld+json",
        },
      })
      .then((res) => {
        console.log("Réponse du serveur :", res.data);
      })
      .catch((err) => {
        console.error("Erreur lors de la requête :", err);
      });

    // crée ticket POST-Request sent: /api/v1/tickets
    //     {
    //       "title": "Help me!",
    //       "group": "2nd Level",
    //       "customer": "david@example.com",
    //       "article": {
    //          "subject": "My subject",
    //          "body": "I am a message!",
    //          "type": "note",
    //          "internal": false
    //       }
    //    }
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

  // if (list !== null) {
  //   console.log(list);
  // }
  const initDefaultValue = () => {
    setTechnicien(list[0].name);
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-light"
        data-toggle="modal"
        data-target="#exampleModal"
        onClick={initDefaultValue}
      >
        Nouvelle tâche
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Nouvelle Tâche
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">Technicien</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    selected={list.length > 0 ? list[0].name : ""}
                    onChange={(e) => {
                      const selectedValue =
                        e.target.value === undefined
                          ? list[0].name
                          : e.target.value;
                      setTechnicien(selectedValue);
                    }}
                  >
                    {list?.map((item) => {
                      return <option key={item.id}> {item.name} </option>;
                    })}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">Client</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    onChange={(e) => {
                      setClient(e.target.value);
                    }}
                  >
                    <option>Ifr</option>
                    <option>Garage</option>
                    <option>orange</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">Titre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="ifr..."
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">Description</label>
                  <textarea
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput1"
                    placeholder="maintenance chez ifr...."
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">récurrence</label>
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    placeholder="Choisissez le nombre de jours"
                    min="0"
                    max="100"
                    id="recurrence"
                    onChange={(e) => {
                      setDate(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">récurrence</label>
                  <input
                    type="number"
                    className="form-control form-control-solid"
                    placeholder="Choisissez le nombre de jours"
                    min="0"
                    max="100"
                    id="recurrence"
                    onChange={(e) => {
                      setRecurrence(e.target.value);
                    }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={makeTask}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
