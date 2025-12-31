import { useState, useRef } from "react";
import EmojiPicker from "emoji-picker-react";

import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PhotoIcon from "@mui/icons-material/Photo";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";

import { IconButton, Popover } from "@mui/material";
import { styles } from "./styles";

export default function InputBar({ message, setMessage, sendMsg }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fileRef = useRef();

  /* ===============================
     FILE SELECT
  =============================== */
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    setFile(f);

    if (f.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(f));
    }
  };

  /* ===============================
     SEND MESSAGE
  =============================== */
  const handleSend = () => {
    if (!message.trim() && !file) return;

    sendMsg({ text: message, file });

    // 🔥 RESET EVERYTHING (WhatsApp behavior)
    setMessage("");
    setFile(null);
    setPreview(null);
    setShowEmoji(false);
    setAnchorEl(null);
  };

  return (
    <div style={styles.inputBarWrapper}>
      {/* IMAGE PREVIEW */}
      {preview && (
        <div style={styles.previewBox}>
          <img src={preview} style={styles.previewImg} />
          <IconButton
            size="small"
            style={styles.previewClose}
            onClick={() => {
              setFile(null);
              setPreview(null);
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}

      {/* INPUT BAR */}
      <div style={styles.inputBar}>
        {/* ATTACH */}
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AttachFileIcon />
        </IconButton>

        {/* EMOJI */}
        <IconButton onClick={() => setShowEmoji((p) => !p)}>
          <SentimentSatisfiedAltIcon />
        </IconButton>

        {/* TEXT INPUT */}
        <input
          style={styles.input}
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* SEND */}
        <IconButton onClick={handleSend} style={{ color: "#00A884" }}>
          <SendIcon />
        </IconButton>
      </div>

      {/* ATTACHMENT MENU (WHATSAPP STYLE) */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
        PaperProps={{ sx: styles.attachMenu }}
      >
        <AttachRow
          icon={<InsertDriveFileIcon />}
          label="Document"
          color="#8B5CF6"     // 🟣 Purple
        />

        <AttachRow
          icon={<PhotoIcon />}
          label="Photos & videos"
          color="#3B82F6"     // 🔵 Blue
          onClick={() => fileRef.current.click()}
        />

        <AttachRow
          icon={<CameraAltIcon />}
          label="Camera"
          color="#EC4899"     // 🌸 Pink
        />

        <AttachRow
          icon={<AudiotrackIcon />}
          label="Audio"
          color="#F97316"     // 🟠 Orange
        />

      </Popover>

      <input
        type="file"
        hidden
        ref={fileRef}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div style={styles.emojiPicker}>
          <EmojiPicker
            onEmojiClick={(e) =>
              setMessage((prev) => prev + e.emoji)
            }
            theme="dark"
            height={350}
          />
        </div>
      )}
    </div>
  );
}

/* ===============================
   ATTACHMENT ROW
=============================== */
function AttachRow({ icon, label, color, onClick }) {
  return (
    <div
      style={styles.attachRow}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#2A3942")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "transparent")
      }
    >
      <div
        style={{
          ...styles.attachIconCircle,
          background: color,
        }}
      >
        {icon}
      </div>

      <span>{label}</span>
    </div>
  );
}
