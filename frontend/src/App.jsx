import { useEffect, useState } from "react";
import {
  Accessibility,
  Users,
  UserRound,
  ClipboardList
} from "lucide-react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [helpers, setHelpers] = useState([]);
  const [requests, setRequests] = useState([]);

  const [workload, setWorkload] = useState([]);
  const [selectedHelper, setSelectedHelper] = useState(null);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");

  const [newRequest, setNewRequest] = useState({
    userId: "",
    pickupPoint: "",
    tripTime: "",
    assistanceType: "WHEELCHAIR"
  });

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/users").then((response) =>
          response.json()
      ),

      fetch("http://localhost:8080/helpers").then((response) =>
          response.json()
      ),

      fetch("http://localhost:8080/assistance-requests").then((response) =>
          response.json()
      )
    ])
        .then(([usersData, helpersData, requestsData]) => {
          setUsers(usersData);
          setHelpers(helpersData);
          setRequests(requestsData);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
  }, []);

  // ==========================================
  // CREATE REQUEST
  // ==========================================

  const handleCreateRequest = (event) => {
    event.preventDefault();

    const requestData = {
      pickupPoint: newRequest.pickupPoint,
      tripTime: newRequest.tripTime,
      assistanceType: newRequest.assistanceType,
      user: {
        id: Number(newRequest.userId)
      }
    };

    fetch("http://localhost:8080/assistance-requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestData)
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to create request");
          }

          return response.json();
        })
        .then((createdRequest) => {
          setRequests((previousRequests) => [
            ...previousRequests,
            createdRequest
          ]);

          setShowRequestForm(false);

          setNewRequest({
            userId: "",
            pickupPoint: "",
            tripTime: "",
            assistanceType: "WHEELCHAIR"
          });
        })
        .catch((error) => {
          console.error("Error creating request:", error);
        });
  };

  // ==========================================
  // ASSIGN HELPER
  // ==========================================

  const handleAssignHelper = (requestId, helperId) => {
    fetch(
        `http://localhost:8080/assistance-requests/${requestId}/assign/${helperId}`,
        {
          method: "PUT"
        }
    )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to assign helper");
          }

          return response.json();
        })
        .then((updatedRequest) => {
          setRequests((previousRequests) =>
              previousRequests.map((request) =>
                  request.id === updatedRequest.id
                      ? updatedRequest
                      : request
              )
          );
        })
        .catch((error) => {
          console.error("Error assigning helper:", error);
        });
  };

  // ==========================================
  // COMPLETE REQUEST
  // ==========================================

  const handleCompleteRequest = (requestId) => {
    fetch(
        `http://localhost:8080/assistance-requests/${requestId}/complete`,
        {
          method: "PUT"
        }
    )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to complete request");
          }

          return response.json();
        })
        .then((updatedRequest) => {
          setRequests((previousRequests) =>
              previousRequests.map((request) =>
                  request.id === updatedRequest.id
                      ? updatedRequest
                      : request
              )
          );
        })
        .catch((error) => {
          console.error("Error completing request:", error);
        });
  };

  // ==========================================
  // CANCEL REQUEST
  // ==========================================

  const handleCancelRequest = (requestId) => {
    fetch(
        `http://localhost:8080/assistance-requests/${requestId}/cancel`,
        {
          method: "PUT"
        }
    )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to cancel request");
          }

          return response.json();
        })
        .then((updatedRequest) => {
          setRequests((previousRequests) =>
              previousRequests.map((request) =>
                  request.id === updatedRequest.id
                      ? updatedRequest
                      : request
              )
          );
        })
        .catch((error) => {
          console.error("Error cancelling request:", error);
        });
  };

  // ==========================================
  // VIEW HELPER WORKLOAD
  // ==========================================

  const handleViewWorkload = (helperId) => {
    fetch(
        `http://localhost:8080/assistance-requests/helper/${helperId}/workload`
    )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to load helper workload");
          }

          return response.json();
        })
        .then((workloadData) => {
          setWorkload(workloadData);
          setSelectedHelper(helperId);
        })
        .catch((error) => {
          console.error("Error loading helper workload:", error);
        });
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
      <div className="app">

        {/* ==========================================
          SIDEBAR
      ========================================== */}

        <aside className="sidebar">

          <div className="logo">

            <Accessibility size={30} />

            <div>
              <h2>TransitAssist</h2>
              <span>Accessible Transit</span>
            </div>

          </div>

          <nav>

            <button
                className={`nav-item ${
                    activePage === "Dashboard" ? "active" : ""
                }`}
                onClick={() => setActivePage("Dashboard")}
            >
              Dashboard
            </button>

            <button
                className={`nav-item ${
                    activePage === "Users" ? "active" : ""
                }`}
                onClick={() => setActivePage("Users")}
            >
              Users
            </button>

            <button
                className={`nav-item ${
                    activePage === "Helpers" ? "active" : ""
                }`}
                onClick={() => setActivePage("Helpers")}
            >
              Helpers
            </button>

            <button
                className={`nav-item ${
                    activePage === "Requests" ? "active" : ""
                }`}
                onClick={() => setActivePage("Requests")}
            >
              Requests
            </button>

          </nav>

        </aside>

        {/* ==========================================
          MAIN CONTENT
      ========================================== */}

        <main className="main-content">

          {/* ==========================================
            DASHBOARD
        ========================================== */}

          {activePage === "Dashboard" && (
              <>

                <header className="topbar">

                  <div>
                    <h1>Dashboard</h1>

                    <p>
                      Accessible transit assistance at your fingertips.
                    </p>
                  </div>

                </header>

                <section className="stats-grid">

                  <div className="stat-card">

                    <div className="stat-icon">
                      <Users size={24} />
                    </div>

                    <div>
                      <span>Total Users</span>
                      <strong>{users.length}</strong>
                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon">
                      <UserRound size={24} />
                    </div>

                    <div>
                      <span>Helpers</span>
                      <strong>{helpers.length}</strong>
                    </div>

                  </div>

                  <div className="stat-card">

                    <div className="stat-icon">
                      <ClipboardList size={24} />
                    </div>

                    <div>
                      <span>Requests</span>
                      <strong>{requests.length}</strong>
                    </div>

                  </div>

                </section>

                <section className="requests-card">

                  <div className="section-header">

                    <div>

                      <h2>Recent Assistance Requests</h2>

                      <p>
                        Monitor assistance requests and their current status.
                      </p>

                    </div>

                    <button
                        className="primary-button"
                        onClick={() => setShowRequestForm(true)}
                    >
                      + New Request
                    </button>

                  </div>

                  <div className="requests-list">

                    {requests.map((request) => (

                        <div
                            className="request-row"
                            key={request.id}
                        >

                          <div>

                            <strong>
                              #{request.id}
                            </strong>

                            <span>
                        {request.pickupPoint}
                      </span>

                          </div>

                          <div>

                      <span>
                        {request.assistanceType}
                      </span>

                          </div>

                          <div>

                      <span
                          className={`status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>

                          </div>

                          <div>

                      <span>
                        {request.helper
                            ? request.helper.name
                            : "Not assigned"}
                      </span>

                          </div>

                        </div>

                    ))}

                  </div>

                </section>

              </>
          )}

          {/* ==========================================
            USERS
        ========================================== */}

          {activePage === "Users" && (
              <>

                <header className="topbar">

                  <div>

                    <h1>Users</h1>

                    <p>
                      Manage registered transit assistance users.
                    </p>

                  </div>

                </header>

                <section className="requests-card">

                  <div className="section-header">

                    <div>

                      <h2>Registered Users</h2>

                      <p>
                        Users currently registered in TransitAssist.
                      </p>

                    </div>

                  </div>

                  <div className="users-table">

                    <div className="table-header">

                      <span>ID</span>
                      <span>Name</span>
                      <span>Email</span>
                      <span>Phone</span>

                    </div>

                    {users.map((user) => (

                        <div
                            className="table-row"
                            key={user.id}
                        >

                    <span>
                      #{user.id}
                    </span>

                          <span>
                      {user.name}
                    </span>

                          <span>
                      {user.email}
                    </span>

                          <span>
                      {user.phone}
                    </span>

                        </div>

                    ))}

                  </div>

                </section>

              </>
          )}

          {/* ==========================================
            HELPERS
        ========================================== */}

          {activePage === "Helpers" && (
              <>

                <header className="topbar">

                  <div>

                    <h1>Helpers</h1>

                    <p>
                      Manage transit assistance helpers.
                    </p>

                  </div>

                </header>

                <section className="requests-card">

                  <div className="section-header">

                    <div>

                      <h2>Registered Helpers</h2>

                      <p>
                        Helpers currently registered in TransitAssist.
                      </p>

                    </div>

                  </div>

                  <div className="users-table">

                    <div className="table-header">

                      <span>ID</span>
                      <span>Name</span>
                      <span>Phone</span>
                      <span>Availability</span>

                    </div>

                    {helpers.map((helper) => (

                        <div
                            className="table-row"
                            key={helper.id}
                        >

                    <span>
                      #{helper.id}
                    </span>

                          <span>
                      {helper.name}
                    </span>

                          <span>
                      {helper.phone}
                    </span>

                          <div className="helper-actions">

                      <span>
                        {helper.available
                            ? "Available"
                            : "Unavailable"}
                      </span>

                            <button
                                className="small-button"
                                onClick={() =>
                                    handleViewWorkload(helper.id)
                                }
                            >
                              View Workload
                            </button>

                          </div>

                        </div>

                    ))}

                  </div>

                  {/* HELPER WORKLOAD */}

                  {selectedHelper && (

                      <div className="workload-card">

                        <div className="workload-header">

                          <h3>
                            Today's Helper Workload
                          </h3>

                          <button
                              className="close-workload"
                              onClick={() => {
                                setSelectedHelper(null);
                                setWorkload([]);
                              }}
                          >
                            ×
                          </button>

                        </div>

                        {workload.length === 0 ? (

                            <p className="empty-workload">
                              No requests assigned to this helper today.
                            </p>

                        ) : (

                            <div className="workload-list">

                              {workload.map((request) => (

                                  <div
                                      className="workload-item"
                                      key={request.id}
                                  >

                                    <div>

                                      <strong>
                                        Request #{request.id}
                                      </strong>

                                      <span>
                              {request.pickupPoint}
                            </span>

                                    </div>

                                    <span
                                        className={`status ${request.status.toLowerCase()}`}
                                    >
                            {request.status}
                          </span>

                                  </div>

                              ))}

                            </div>

                        )}

                      </div>

                  )}

                </section>

              </>
          )}

          {/* ==========================================
            REQUESTS
        ========================================== */}

          {activePage === "Requests" && (
              <>

                <header className="topbar">

                  <div>

                    <h1>Requests</h1>

                    <p>
                      View and manage assistance requests.
                    </p>

                  </div>

                  <button
                      className="primary-button"
                      onClick={() => setShowRequestForm(true)}
                  >
                    + New Request
                  </button>

                </header>

                <section className="requests-card">

                  <div className="section-header">

                    <div>

                      <h2>All Assistance Requests</h2>

                      <p>
                        View the current status of every assistance request.
                      </p>

                    </div>

                  </div>

                  <div className="requests-list">

                    {requests.map((request) => (

                        <div
                            className="request-row"
                            key={request.id}
                        >

                          <div>

                            <strong>
                              #{request.id}
                            </strong>

                            <span>
                        {request.pickupPoint}
                      </span>

                          </div>

                          <div>

                      <span>
                        {request.assistanceType}
                      </span>

                          </div>

                          <div>

                      <span
                          className={`status ${request.status.toLowerCase()}`}
                      >
                        {request.status}
                      </span>

                          </div>

                          <div className="request-actions">

                            {request.status === "REQUESTED" &&
                            !request.helper ? (

                                <div className="assign-controls">

                                  <select
                                      defaultValue=""
                                      id={`helper-${request.id}`}
                                  >

                                    <option
                                        value=""
                                        disabled
                                    >
                                      Select helper
                                    </option>

                                    {helpers.map((helper) => (

                                        <option
                                            key={helper.id}
                                            value={helper.id}
                                        >
                                          {helper.name} - {helper.phone}
                                        </option>

                                    ))}

                                  </select>

                                  <button
                                      className="small-button"
                                      onClick={() => {

                                        const helperId =
                                            document.getElementById(
                                                `helper-${request.id}`
                                            ).value;

                                        if (!helperId) {
                                          return;
                                        }

                                        handleAssignHelper(
                                            request.id,
                                            Number(helperId)
                                        );

                                      }}
                                  >
                                    Assign
                                  </button>

                                  <button
                                      className="cancel-button"
                                      onClick={() =>
                                          handleCancelRequest(request.id)
                                      }
                                  >
                                    Cancel
                                  </button>

                                </div>

                            ) : request.status === "ASSIGNED" ? (

                                <div className="action-buttons">

                                  <button
                                      className="small-button"
                                      onClick={() =>
                                          handleCompleteRequest(request.id)
                                      }
                                  >
                                    Complete
                                  </button>

                                  <button
                                      className="cancel-button"
                                      onClick={() =>
                                          handleCancelRequest(request.id)
                                      }
                                  >
                                    Cancel
                                  </button>

                                </div>

                            ) : request.helper ? (

                                <span>
                          {request.helper.name}
                        </span>

                            ) : (

                                <span>
                          Not assigned
                        </span>

                            )}

                          </div>

                        </div>

                    ))}

                  </div>

                </section>

              </>
          )}

        </main>

        {/* ==========================================
          NEW REQUEST MODAL
      ========================================== */}

        {showRequestForm && (

            <div className="form-overlay">

              <div className="request-form-card">

                <div className="form-header">

                  <div>

                    <h2>
                      New Assistance Request
                    </h2>

                    <p>
                      Schedule assistance for a passenger.
                    </p>

                  </div>

                  <button
                      className="close-button"
                      onClick={() =>
                          setShowRequestForm(false)
                      }
                  >
                    ×
                  </button>

                </div>

                <form onSubmit={handleCreateRequest}>

                  <label>

                    User

                    <select
                        value={newRequest.userId}
                        onChange={(event) =>
                            setNewRequest({
                              ...newRequest,
                              userId: event.target.value
                            })
                        }
                        required
                    >

                      <option value="">
                        Select user
                      </option>

                      {users.map((user) => (

                          <option
                              key={user.id}
                              value={user.id}
                          >
                            {user.name} - {user.phone}
                          </option>

                      ))}

                    </select>

                  </label>

                  <label>

                    Pickup Point

                    <input
                        type="text"
                        placeholder="Enter pickup point"
                        value={newRequest.pickupPoint}
                        onChange={(event) =>
                            setNewRequest({
                              ...newRequest,
                              pickupPoint: event.target.value
                            })
                        }
                        required
                    />

                  </label>

                  <label>

                    Trip Time

                    <input
                        type="datetime-local"
                        value={newRequest.tripTime}
                        onChange={(event) =>
                            setNewRequest({
                              ...newRequest,
                              tripTime: event.target.value
                            })
                        }
                        required
                    />

                  </label>

                  <label>

                    Assistance Type

                    <select
                        value={newRequest.assistanceType}
                        onChange={(event) =>
                            setNewRequest({
                              ...newRequest,
                              assistanceType: event.target.value
                            })
                        }
                    >

                      <option value="WHEELCHAIR">
                        Wheelchair
                      </option>

                      <option value="ESCORT">
                        Escort
                      </option>

                    </select>

                  </label>

                  <div className="form-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() =>
                            setShowRequestForm(false)
                        }
                    >
                      Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                      Create Request
                    </button>

                  </div>

                </form>

              </div>

            </div>

        )}

      </div>
  );
}

export default App;