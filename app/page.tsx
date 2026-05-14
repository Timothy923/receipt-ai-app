"use client";

import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    merchant_name: "",
    date: "",
    total_amount: "",
    currency: "",
  });

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a receipt image.");
      return;
    }

    setLoading(true);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const base64 = reader.result?.toString().split(",")[1];

        const res = await fetch("/api/extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            mimeType: file.type,
          }),
        });

        const data = await res.json();

        console.log(data);

        if (!data.result) {
          alert(data.error || "Extraction failed");
          setLoading(false);
          return;
        }

        let cleaned = data.result.trim();

        cleaned = cleaned.replace(/```json/g, "");
        cleaned = cleaned.replace(/```/g, "");
        cleaned = cleaned.trim();

        const parsed = JSON.parse(cleaned);

        setFormData(parsed);
      } catch (error) {
        console.error(error);
        alert("Extraction failed.");
      }

      setLoading(false);
    };
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "black",
          }}
        >
          AI Receipt Auto-Fill System
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Extracting..." : "Extract Receipt"}
        </button>

        <div style={{ marginTop: "20px" }}>
          <input
            placeholder="Merchant Name"
            value={formData.merchant_name}
            onChange={(e) =>
              setFormData({
                ...formData,
                merchant_name: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Date"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Total Amount"
            value={formData.total_amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                total_amount: e.target.value,
              })
            }
            style={inputStyle}
          />

          <input
            placeholder="Currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({
                ...formData,
                currency: e.target.value,
              })
            }
            style={inputStyle}
          />

          <button
            onClick={() => {
            localStorage.setItem(
              "receiptData",
              JSON.stringify(formData)
            );

            alert("Receipt data saved!");
          }}
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
};