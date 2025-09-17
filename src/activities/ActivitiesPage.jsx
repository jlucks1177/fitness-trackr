import useQuery from "../api/useQuery.js";
import { useAuth } from "../auth/AuthContext.jsx";
import useMutation from "../api/useMutation.js";
import { useState } from "react";

export default function ActivitiesPage() {
  const { data, loading, error } = useQuery("/activities", "activities");
  const { token } = useAuth();
  const activities = Array.isArray(data) ? data : [];

  // handling the delete button functionality
  // const { mutate: deleteActivity, error: deleteError } = useMutation(
  //   "DELETE",
  //   "/activities",
  //   ["activities"]
  // );

  // const [deletingId, setDeletingId] = useState(null);

  // async function handleDelete(activityId) {
  //   setDeletingId(activityId);

  //   try {
  //     await deleteActivity("", `/activities/${activityId}`);
  //   } catch (e) {
  //     console.error("Delete Failed:", e);
  //   } finally {
  //     setDeletingId(null);
  //   }
  // }

  // ^ this is saved so that I might know my sins and so that god may forgive me for my transgressions, this tooks hours to turn into that below

  // handling the delete button functionality
  function ActivityItem({ activity, token }) {
    const {
      mutate: deleteActivity,
      loading: deleting,
      error: deleteError,
    } = useMutation("DELETE", `/activities/${activity.id}`, ["activities"]);

    return (
      <li>
        <strong>{activity.name}</strong>: {activity.description}
        {token && (
          <>
            <button onClick={() => deleteActivity()}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
            {deleteError && <output className="error">{deleteError}</output>}
          </>
        )}
      </li>
    );
  }

  // handling creating a new activity through form
  const {
    mutate: createActivity,
    loading: creating,
    error: createError,
  } = useMutation("POST", "/activities", ["activities"]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function handleCreate(e) {
    e.preventDefault();

    try {
      await createActivity({ name, description });
      setName("");
      setDescription("");
    } catch (createError) {
      console.error("Create Failed:", createError);
    }
  }

  return (
    <>
      <h1>Activities</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <output>{error}</output>
      ) : (
        <>
          {token ? (
            <form onSubmit={handleCreate}>
              <label>
                Name:
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Description:
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <button type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create Activity"}
              </button>
              {createError ? (
                <output className="error">{createError}</output>
              ) : null}
            </form>
          ) : null}
          <ul>
            {activities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                token={token}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
}
