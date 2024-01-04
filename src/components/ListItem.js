import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ListItem() {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState(false); // New state for controlling modal visibility
  const [selectedItem, setSelectedItem] = useState(null); // New state to store the selected item

  useEffect(() => {
    const fetchDatas = axios
      .get("https://localhost:8000/api/tasks")
      .then((res) => {
        const data = res.data["hydra:member"];
        setList(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const viewDetails = (id) => {
    console.log(id);

    const findObjList = list.find((el) => el.id === id);

    console.log(findObjList);

    setSelectedItem(findObjList);
    console.log(findObjList);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <section className="vh-100 gradient-custom-2">
        <div className="container py-5 ">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-12 col-xl-10">
              <div className="card mask-custom">
                <div className="card-body p-4 text-white">
                  <table className="table text-white mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Technicien</th>
                        <th scope="col">Client</th>
                        <th scope="col">Tâche</th>
                        <th scope="col">Status</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list?.map((item) => {
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
                              <span>Ifr</span>
                            </td>
                            <td className="align-middle">
                              <span>{item.title}</span>
                            </td>
                            <td className="align-middle">
                              <h6 className="mb-0">
                                <span className="badge bg-success">
                                  Terminer
                                </span>
                              </h6>
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
                                {/* <a
                                  href="#!"
                                  data-mdb-toggle="tooltip"
                                  title="Done"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </a> */}
                              </button>

                              {/* <a
                                href="#!"
                                data-mdb-toggle="tooltip"
                                title="Remove"
                              >
                                <i className="fas fa-trash-alt fa-lg text-warning"></i>
                              </a> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
              <h5 className="modal-title" id="exampleModalLabel">
                Details
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
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <h6>Objet : </h6> {selectedItem?.title}
                </li>
                <li class="list-group-item">
                  <h6>Technicien : </h6> {selectedItem?.technicien}
                </li>
                <li class="list-group-item">
                  <h6>Description : </h6> {selectedItem?.subject}
                </li>
                <li class="list-group-item">
                  <h6>recurrence : </h6> {selectedItem?.date.split("T")[0]}
                </li>
                <li class="list-group-item">
                  <h6>recurrence : </h6> {selectedItem?.recurrence}
                </li>
              </ul>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
