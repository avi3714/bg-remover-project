import React, { useState } from "react";
import Snowfall from "react-snowfall";
import "./App.css";

function App() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [imageURL, setImageURL] = useState(null);

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/remove-bg");

    setProgress(0);
    setStatus("Uploading...");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.upload.onload = () => {
      setStatus("Upload complete ✔ Processing...");
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const blob = xhr.response;
        setImageURL(URL.createObjectURL(blob));
        setStatus("Processing complete ✔");
      } else {
        setStatus("❌ Error");
      }
    };

    xhr.responseType = "blob";
    xhr.send(formData);
  };

  return (
    <div className="app">
      <Snowfall snowflakeCount={170} />

      <div className="container">
        <h1>✨ AI Background Remover</h1>
        <p>Upload an image to remove background</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => uploadImage(e.target.files[0])}
        />

        {progress > 0 && (
          <div className="progress">
            <div className="bar" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        )}

        <p>{status}</p>

        {imageURL && (
          <>
            <img src={imageURL} alt="Result" />
            <a href={imageURL} download="no-bg.png">
              ⬇ Download Image
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
