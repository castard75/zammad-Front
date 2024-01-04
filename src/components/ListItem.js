import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ListItem() {
  const [list, setList] = useState([]);

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
                        <th scope="col">Task</th>
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
                              <span className="ms-2">{item.title}</span>
                            </th>
                            <td className="align-middle">
                              <span>Ifr</span>
                            </td>
                            <td className="align-middle">
                              <span>Maintenance</span>
                            </td>
                            <td className="align-middle">
                              <h6 className="mb-0">
                                <span className="badge bg-success">
                                  Terminer
                                </span>
                              </h6>
                            </td>
                            <td className="align-middle">
                              <a
                                href="#!"
                                data-mdb-toggle="tooltip"
                                title="Done"
                              >
                                <i className="fas fa-check fa-lg text-success me-3"></i>
                              </a>
                              <a
                                href="#!"
                                data-mdb-toggle="tooltip"
                                title="Remove"
                              >
                                <i className="fas fa-trash-alt fa-lg text-warning"></i>
                              </a>
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
    </>
  );
}
