// client/src/components/Group/MemberList.js
import { gStyles } from "./stylesGroup";

export default function MemberList({ members }) {
  return (
    <>
      <div style={gStyles.sectionTitle}>Members</div>
      {members.map((m) => (
        <div key={m._id} style={gStyles.memberRow}>
          <img src={m.photo || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} style={gStyles.avatar} alt={m.name || ""} />
          <div>
            <div style={{ fontWeight: "600" }}>{m.name}</div>
            <div style={{ color: "#8696A0", fontSize: 12 }}>{m.status || ""}</div>
          </div>
        </div>
      ))}
    </>
  );
}
