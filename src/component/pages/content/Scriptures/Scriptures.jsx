import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../backend/config/firebase";

const Scriptures = ({ date }) => {
  const [scriptureData, setScriptureData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScripture = async () => {
      try {
        const docRef = doc(db, "daily_schedules", date);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScriptureData(docSnap.data());
        } else {
          setScriptureData(null);
        }
      } catch (error) {
        console.error("Error fetching scripture:", error);
      } finally {
        setLoading(false);
      }
    };

    if (date) fetchScripture();
  }, [date]);

  if (loading) return <p style={styles.loading}>Loading...</p>;
  if (!scriptureData) return <p style={styles.error}>No data found for {date}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📖 Scripture of the Day</h2>
      <p><strong>Scripture:</strong> {scriptureData.scripture}</p>
      <p><strong>Verse:</strong> {scriptureData.verse}</p>
      <p><strong>Bible Version:</strong> {scriptureData.bible}</p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#fffaf2",
    padding: "20px",
    maxWidth: "600px",
    margin: "20px auto",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial",
    color: "#5a4638"
  },
  title: {
    textAlign: "center",
    color: "#8b5e3c",
    marginBottom: "15px"
  },
  loading: {
    textAlign: "center",
    color: "#999"
  },
  error: {
    textAlign: "center",
    color: "#c00"
  }
};

export default Scriptures;
