import React from "react";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState();
  const [date, setDate] = useState();
  const [technicien, setTechnicien] = useState();
  const [client, setClient] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [allGroup, setAllGroup] = useState([]);
  const [group, setGroup] = useState();
  const [list, setList] = useState([]);

  ////----------------------Validation Fom---------------------////
  const { register, handleSubmit, formState } = useForm({});

  const { errors } = formState;

  ////---------------------Create task--------------------////

  const makeTask = (data) => {
    const selectedTech = data.technicien || list[0]?.name;
    const selectedClient = data.client || allClients[0]?.name;
    const selectedGroup = data.group || allGroup[0]?.name;

    const findTechnicien = list.find((el) => {
      return el.name == selectedTech;
    });

    const findClient = allClients.find((el) => {
      return el.name == selectedClient;
    });

    const findGroup = allGroup.find((el) => {
      return el.name == selectedGroup;
    });

    const obj = {
      title: data.title,
      description: data.description,
      recurrence: data.recurrence,
      technicien: selectedTech,
      client: selectedClient,
      clientEmail: findClient?.email,
      technicienEmail: findTechnicien?.email,
      groupId: findGroup?.zammadId,
      groupZad: findGroup?.name,

      status: 0,
    };

    axios
      .post("https://localhost:8000/api/tasks", obj, {
        headers: {
          "Content-Type": "application/ld+json",
        },
      })
      .then((res) => {
        console.log("Réponse du serveur :", res.data);
        window.location = "/";
      })
      .catch((err) => {
        console.error("Erreur lors de la requête :", err);
      });
  };

  //--------------------------STATE-------------------------//

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requête pour les techniciens
        const techniciensRes = await axios.get(
          "https://localhost:8000/api/techniciens"
        );
        const techniciensData = techniciensRes.data["hydra:member"];
        setList(techniciensData);

        // Requête pour les clients
        const clientsRes = await axios.get(
          "https://localhost:8000/api/clients"
        );
        const clientsData = clientsRes.data["hydra:member"];
        // console.log(clientsData);
        setAllClients(clientsData);

        const groupRes = await axios.get("https://localhost:8000/api/groups");
        const groupData = groupRes.data["hydra:member"];
        // console.log(clientsData);
        setAllGroup(groupData);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
      }
    };

    fetchData();
  }, []);

  //Initialisation par défaut des champs du formulaire
  const initDefaultValue = () => {
    setTechnicien(list[0]?.name);
    setClient(allClients[0]?.name);
    setGroup(allGroup[0]?.name);
    setRecurrence(0);
  };

  return (
    <>
      <button
        type="button"
        className="btn "
        style={{ background: "#38ad69" }}
        data-toggle="modal"
        data-target="#exampleModal"
        onClick={initDefaultValue}
      >
        Nouveau ticket
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
                Nouveau ticket
              </h5>
              <button
                type="button"
                className="close btn btn-secondary"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">TITRE </label>
                  <input
                    {...register("title", { required: true })}
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput1"
                    // placeholder="ifr..."
                    onChange={(e) => {
                      setTitle(e.target.value);
                    }}
                  />
                  {errors.title && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">TECHNICIEN</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    value={technicien}
                    selected={list.length > 0 ? list[0].name : ""}
                    {...register("technicien", { required: false })}
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
                  {errors.technicien && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">CLIENT</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    value={client}
                    {...register("client", { required: false })}
                    onChange={(e) => {
                      const selectedValue =
                        e.target.value === undefined
                          ? allClients[0].name
                          : e.target.value;
                      setClient(selectedValue);
                    }}
                  >
                    {allClients?.map((item) => {
                      return <option key={item.id}> {item.name} </option>;
                    })}
                  </select>
                  {errors.client && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="exampleFormControlSelect1">GROUPE</label>
                  <select
                    className="form-control"
                    id="exampleFormControlSelect1"
                    {...register("group", { required: false })}
                    onChange={(e) => {
                      const selectedValue =
                        e.target.value === undefined
                          ? allGroup[0]?.name
                          : e.target.value;
                      setGroup(selectedValue);
                    }}
                  >
                    {allGroup?.map((item) => {
                      return <option key={item.id}> {item.name} </option>;
                    })}
                  </select>
                  {errors.group && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">TEXTE</label>
                  <textarea
                    type="email"
                    className="form-control"
                    id="exampleFormControlInput1"
                    {...register("description", { required: true })}
                    // placeholder="maintenance chez ifr...."
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                  {errors.description && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
                </div>
                {/* <div className="form-group">
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
                </div> */}
                <div className="form-group">
                  <label htmlFor="exampleFormControlInput1">RÉCCURRENCE</label>
                  <input
                    type="number"
                    className="form-control form-control-solid"
                    // placeholder="Choisissez le nombre de jours"
                    {...register("recurrence", { required: true })}
                    min="0"
                    max="100"
                    id="recurrence"
                    onChange={(e) => {
                      setRecurrence(e.target.value);
                    }}
                  />
                  {errors.recurrence && (
                    <span style={{ color: "red" }}>
                      Ce champ est obligatoire
                    </span>
                  )}
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
                style={{ background: "#38ad69" }}
                onClick={handleSubmit(makeTask)}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
