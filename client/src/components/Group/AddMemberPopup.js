// client/src/components/Group/AddMemberPopup.js
import { useEffect, useState } from "react";
import API from "../../api";

export default function AddMemberPopup({ groupId, existingMembers = [], onClose, onAdded }) {
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    API.get("/user/all").then((res) => setAllUsers(res.data || [])).catch(() => {});
  }, []);

  const filtered = allUsers.filter((u) => !existingMembers.includes(u._id) && (!query || u.name.toLowerCase().includes(query.toLowerCase()) || (u.email || "").toLowerCase().includes(query.toLowerCase())));

  const addMember = async (id) => {
    try {
      setAddingId(id);
      const res = await API.post(`/group/${groupId}/add-member`, { memberId: id });
      onAdded?.(res.data.group || res.data);
      onClose();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div style={modal.overlay}>
      <div style={modal.box}>
        <div style={modal.header}><div style={{fontWeight:700}}>Add Members</div><button onClick={onClose}>✖</button></div>
        <div style={{padding:12}}>
          <input placeholder="Search" value={query} onChange={(e)=>setQuery(e.target.value)} style={modal.search} />
          <div style={{maxHeight:320, overflowY:"auto", marginTop:8}}>
            {filtered.map(u => (
              <div key={u._id} style={modal.row}>
                <img src={u.photo || "/default-avatar.png"} alt="" style={modal.avatar} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:700}}>{u.name}</div>
                  <div style={{fontSize:12, color:"#666"}}>{u.email}</div>
                </div>
                <button disabled={addingId===u._id} onClick={()=>addMember(u._id)} style={modal.addBtn}>{addingId===u._id ? "Adding..." : "Add"}</button>
              </div>
            ))}
            {filtered.length===0 && <div style={{padding:12,color:"#666"}}>No users</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const modal = {
  overlay: { position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:900 },
  box: { width:520, maxWidth:"95%", background:"#fff", borderRadius:8, overflow:"hidden" },
  header: { padding:12, borderBottom:"1px solid #eee", display:"flex", justifyContent:"space-between", alignItems:"center" },
  search: { width:"100%", padding:10, borderRadius:6, border:"1px solid #ddd" },
  row: { display:"flex", alignItems:"center", gap:12, padding:"8px 12px", borderBottom:"1px solid #fafafa" },
  avatar: { width:42, height:42, borderRadius:"50%", objectFit:"cover" },
  addBtn: { background:"#00A884", color:"#fff", border:"none", padding:"6px 10px", borderRadius:6, cursor:"pointer" }
};
