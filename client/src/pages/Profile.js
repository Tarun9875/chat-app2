import { useState } from "react";
import API from "../api";

export default function Profile() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [name, setName] = useState(user.name);
  const [nick, setNick] = useState(user.nick || "");

  const save = async () => {
    const res = await API.post("/user/update", {
      id: user._id,
      name,
      nick,
    });

    sessionStorage.setItem("user", JSON.stringify(res.data));
    alert("Updated");
  };

  return (
    <div style={styles.page}>
      <h2>Edit Profile</h2>

      <label>Name</label>
      <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

      <label>Nickname</label>
      <input style={styles.input} value={nick} onChange={(e) => setNick(e.target.value)} />

      <button style={styles.save} onClick={save}>Save</button>
    </div>
  );
}

const styles = {
  page: {
    padding: 20,
    background: "#111B21",
    height: "100vh",
    color: "#E9EDEF",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 6,
    marginBottom: 20,
    background: "#202C33",
    border: "1px solid #2A3942",
    color: "#E9EDEF",
    borderRadius: 6,
  },
  save: {
    padding: "10px 20px",
    background: "#00A884",
    border: "none",
    color: "#111B21",
    fontWeight: "bold",
    borderRadius: 6,
    cursor: "pointer",
  },
};
