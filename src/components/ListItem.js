import React from "react";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useContext } from "react";
import { AppContext } from "../App";
import ReactPaginate from "react-paginate"; // for pagination

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function ListItem() {
  ////-----------------USE CONTEXT -------------------------////
  const { allTechnicienContext, setAllTechnienContext } =
    useContext(AppContext);

  // console.log(allTechnicienContext);
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false); // New state for controlling modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // New state to store the selected item
  const [showUpdate, setShowUpdate] = useState(false);

  ////----------STATE UPDATE----------////
  const [technicien, setTechnicien] = useState("");
  const [client, setClient] = useState("");
  const [allClients, setAllClients] = useState([]);
  const [allTechniciens, setAllTechniens] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState();
  const [allGroup, setAllGroup] = useState([]);
  const [group, setGroup] = useState([]);
  const [itemToUpdate, setItemToUpdate] = useState({
    title: "",
    description: "",
    recurrence: "",
    technicien: "",
    client: "",
    status: 0,
  });

  ///-------------Search------------///
  const [search, setSearch] = useState("");

  ////-------------------------REF----------------------////

  const titleInputRef = useRef(null);
  const recurrenceInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const clientInputRef = useRef(null);
  const technicienInputRef = useRef(null);
  const groupInputRef = useRef(null);

  ////----------------------VALIDATION FORM------------------------////

  const { register, handleSubmit, formState } = useForm({});

  const { errors } = formState;

  ////-------------------TACHE-------------------------////
  useEffect(() => {
    const fetchDatas = axios
      .get("https://localhost:8000/api/tasks")
      .then((res) => {
        const data = res.data["hydra:member"];

        const taskActiv = data.filter((elements) => {
          return elements.deletedAt == null;
        });

        setList(taskActiv);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  ////-----------------TECHNICIENS------------------////

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Requête pour les techniciens
        const techniciensRes = await axios.get(
          "https://localhost:8000/api/techniciens"
        );
        const techniciensData = techniciensRes.data["hydra:member"];
        setAllTechniens(techniciensData);

        // Requête pour les clients
        const clientsRes = await axios.get(
          "https://localhost:8000/api/clients"
        );
        const clientsData = clientsRes.data["hydra:member"];

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

  ////------------------DETAILS---------------------////

  const viewDetails = (id) => {
    const findObjList = list.find((el) => el.id === id);

    setSelectedItem(findObjList);

    setShowModal(true);
    setTechnicien(findObjList.technicien);
    setClient(findObjList.client);
    setGroup(findObjList.groupZad);
  };

  ////-------------UPDATE-----------------////
  const handleUpdate = () => {
    setShowUpdate(true);
  };

  ////-------------close modal------------////
  const closeModal = () => {
    // setShowModal(false);
    setShowUpdate(false);
  };

  ////---------------HANDLE CHANGE----------------------////

  const handleChange = (data) => {
    const title = data.title;
    const description = data.description;

    const recurrence = recurrenceInputRef.current.value;
    const selectedTech = technicienInputRef.current.value;
    const selectedClient = clientInputRef.current.value;
    const selectedGroup = groupInputRef.current.value;

    const findTechnicien = allTechniciens.find((el) => {
      return el.name == selectedTech;
    });

    const findClient = allClients.find((el) => {
      return el.name == selectedClient;
    });

    const findGroup = allGroup.find((el) => {
      return el.name == selectedGroup;
    });

    const obj = {
      title: title,
      description: description,
      recurrence: recurrence,
      technicien: technicien,
      client: client,
      clientEmail: findClient?.email,
      technicienEmail: findTechnicien?.email,
      groupId: findGroup.zammadId,
      group: selectedGroup,
    };
    console.log(obj);

    axios
      .put(`https://localhost:8000/api/tasks/${selectedItem.id}`, obj, {
        headers: {
          "Content-Type": "application/ld+json",
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  ////----------------------DELETE-----------------------////

  const handleDelete = (e, id) => {
    e.preventDefault();

    const idToDelete = id;

    let findItem = list.find((item) => {
      return item.id == id;
    });
    console.log(findItem);
    let dates = new Date();
    const iso = dates.toISOString();
    const hours = iso.split("T")[1].split(".")[0];

    const date = iso.split("T")[0];
    const finalDate = date + " " + hours;

    const objToPut = {
      title: findItem.title,
      description: findItem.description,
      recurrence: findItem.recurrence,
      ponctuel: findItem.ponctuel,
      technicien: findItem.technicien,
      client: findItem.client,
      subject: findItem.subject,
      groupZad: findItem.groupZad,
      createdAt: findItem.createdAt,
      deletedAt: finalDate,
      updatedAt: finalDate,
      status: findItem.status,
      transfert: 0,
      clientEmail: findItem.clientEmail,
      technicienEmail: findItem.technicienEmail,
      groupId: findItem.groupId,
    };

    axios
      .put(`https://localhost:8000/api/tasks/${idToDelete}`, objToPut, {
        headers: {
          "Content-Type": "application/ld+json",
        },
      })
      .then((response) => {
        console.log(response.data);
        const newList = list.filter((element) => {
          return element.id !== idToDelete;
        });

        setList(newList);
        // window.location = "/";
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [page, setPage] = useState(0);
  const [filterData, setFilterData] = useState([]);
  const n = 3;

  useEffect(() => {
    setFilterData(
      list.filter((item, index) => {
        return (index >= page * n) & (index < (page + 1) * n);
      })
    );
  }, [page]);

  // const active = {
  //   backgroundColor: "#1e50ff",
  //   borderRadius: "50%",
  // };

  // const CustomStyles = {
  //   listStyle: "none",
  //   padding: "2px 12px",
  //   height: "31.5px",
  //   width: "31.5px",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: "2px",
  // };

  // const pagination = {
  //   listStyle: "none",
  //   height: "31.5px",
  //   width: "31.5px",
  //   display: "flex",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: "2px",
  //   cursor: "pointer",
  // };

  return (
    <>
      <section className="vh-100 gradient-custom-2 test">
        <div className="container py-5 ">
          {" "}
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-10">
              <div className="card mask-custom">
                <div className="card-body p-4 text-white">
                  <div
                    className=" mb-2"
                    style={{ paddingRight: "1rem", width: "300px" }}
                  >
                    <i className="ki-outline ki-magnifier fs-3 text-primary position-absolute top-50 translate-middle ms-9"></i>

                    <input
                      style={{ paddingRight: "1rem", width: "200px" }}
                      type="text"
                      className="form-control form-control-sm form-control-lg form-control-solid ps-14"
                      name="search"
                      id="ZoneRechercheTableTiers"
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Recherche"
                    />
                  </div>
                  <table className="table text-white mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Technicien</th>
                        <th scope="col">Client</th>
                        <th scope="col">Tâche</th>
                        <th scope="col">Actions</th>
                        <th scope="col">Désactivé</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterData
                        ?.filter((item) => {
                          return search.toLowerCase() === ""
                            ? item
                            : item.client.toLowerCase().includes(search);
                        })
                        .map((item) => {
                          return (
                            <tr className="fw-normal" key={item.id}>
                              <th>
                                <img
                                  src="./assets/images/logo.png"
                                  alt="avatar 1"
                                  style={{ width: "45px", height: "auto" }}
                                />
                                <span className="ms-2">{item.technicien}</span>
                              </th>
                              <td className="align-middle">
                                <span>{item.client}</span>
                              </td>
                              <td className="align-middle">
                                <span>{item.title}</span>
                              </td>

                              <td
                                className="align-middle"
                                onClick={() => viewDetails(item.id)}
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  data-toggle="modal"
                                  data-target="#detail"
                                >
                                  details
                                </button>
                              </td>
                              <td className="align-middle">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={(e) => handleDelete(e, item.id)}
                                >
                                  <i class="bi bi-trash3-fill"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <ReactPaginate
                      containerClassName={"pagination"}
                      pageClassName={"CustomStyles"}
                      activeClassName={"active"}
                      onPageChange={(event) => setPage(event.selected)}
                      pageCount={Math.ceil(list.length / n)}
                      breakLabel="..."
                      previousLabel={"précédent"}
                      nextLabel={"suivant"}
                      marginPagesDisplayed={2}
                      nextClassName={"item  "}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        id="detail"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="details"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  aria-label="edit"
                  onClick={handleUpdate}
                >
                  <span> Modifié</span>
                </button>
              </div>

              <button
                type="button"
                className="close btn btn-secondary"
                data-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {!showUpdate ? (
                <>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <h6>Object : </h6> {selectedItem?.title}
                    </li>
                    <li className="list-group-item">
                      <h6>Client : </h6> {selectedItem?.client}
                    </li>
                    <li className="list-group-item">
                      <h6>Technicien : </h6> {selectedItem?.technicien}
                    </li>

                    <li className="list-group-item">
                      <h6>Description : </h6> {selectedItem?.description}
                    </li>

                    <li className="list-group-item">
                      <h6>GROUPE : </h6> {selectedItem?.groupZad}
                    </li>

                    <li className="list-group-item">
                      <h6>recurrence : </h6> {selectedItem?.recurrence}
                    </li>
                  </ul>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                    <button type="button" className="btn btn-primary">
                      Valider
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlSelect1">Titre</h6>
                      <input
                        {...register("title", { required: true })}
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput1"
                        // ref={titleInputRef}
                        defaultValue={selectedItem?.title}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.title
                              : e.target.value;
                          setTitle(selectedValue);
                        }}
                      />
                      {errors.title && (
                        <span style={{ color: "red" }}>
                          Ce champ est obligatoire
                        </span>
                      )}
                    </li>

                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlSelect1">Technicien</h6>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        value={technicien}
                        ref={technicienInputRef}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.technicien
                              : e.target.value;
                          setTechnicien(selectedValue);
                        }}
                      >
                        {allTechniciens?.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </li>
                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlSelect1">Client</h6>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        ref={clientInputRef}
                        value={client}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.client
                              : e.target.value;
                          setClient(selectedValue);
                        }}
                      >
                        {allClients?.map((item) => {
                          return (
                            <option key={item.id} value={item.name}>
                              {item.name}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </li>
                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlSelect1">Groupe</h6>
                      <select
                        className="form-control"
                        id="exampleFormControlSelect1"
                        ref={groupInputRef}
                        value={group}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.groupId
                              : e.target.value;
                          setGroup(selectedValue);
                        }}
                      >
                        {allGroup?.map((item) => {
                          return (
                            <option key={item.id} value={item.name}>
                              {item.name}{" "}
                            </option>
                          );
                        })}
                      </select>
                    </li>
                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlInput1">Texte</h6>
                      <textarea
                        type="email"
                        className="form-control"
                        id="exampleFormControlInput1"
                        {...register("description", { required: true })}
                        // ref={descriptionInputRef}
                        defaultValue={selectedItem?.description}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.description
                              : e.target.value;
                          setDescription(selectedValue);
                        }}
                      />
                      {errors.description && (
                        <span style={{ color: "red" }}>
                          Ce champ est obligatoire
                        </span>
                      )}
                    </li>

                    <li className="list-group-item">
                      <h6 htmlFor="exampleFormControlInput1">Récurrence</h6>
                      <input
                        type="number"
                        className="form-control form-control-solid"
                        placeholder="Choisissez le nombre de jours"
                        min="0"
                        max="100"
                        ref={recurrenceInputRef}
                        id="recurrence"
                        defaultValue={selectedItem?.recurrence}
                        onChange={(e) => {
                          const selectedValue =
                            e.target.value === undefined
                              ? selectedItem?.recurrence
                              : e.target.value;
                          setRecurrence(selectedValue);
                        }}
                      />
                    </li>
                  </ul>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="btn "
                      style={{ background: "#38ad69" }}
                      onClick={handleSubmit(handleChange)}
                    >
                      Valider
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
