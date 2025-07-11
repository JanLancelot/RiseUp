import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../backend/config/firebase';

export default function RecordedMass() {
  const [videoURL, setVideoURL] = useState('');
  const [loading, setLoading] = useState(true);

  // Define styles as an object for better organization and reusability
  const styles = {
    // A wrapper to center the card on the page
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 2rem', // Increased padding for more space around the card
    },
    // The "glass" card that holds the content
    card: {
      width: '100%',
      maxWidth: '1100px', // <<< Increased from 900px to make the card larger
      backgroundColor: 'rgba(10, 25, 47, 0.65)',
      backdropFilter: 'blur(10px)',
      padding: '2.5rem', // Increased padding inside the card
      borderRadius: '20px', // Slightly larger border radius
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      color: '#FFFFFF',
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem', // More space below the title
      color: '#FFFFFF',
      fontSize: 'clamp(1.7rem, 5vw, 2.7rem)', // <<< Increased font size
      fontWeight: '600',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
    },
    // Wrapper for the iframe to maintain aspect ratio
    videoWrapper: {
      position: 'relative',
      paddingTop: '56.25%', // 16:9 aspect ratio
      height: 0,
      backgroundColor: '#000',
      borderRadius: '12px', // Increased border radius for the video
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: '0',
    },
    // Style for loading and error messages
    messageText: {
      textAlign: 'center',
      fontSize: '1.4rem', // Larger message text
      fontWeight: '500',
      padding: '5rem 0', // More vertical space
    },
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const manilaFormatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const formattedDate = manilaFormatter.format(new Date());

        const docRef = doc(db, 'daily_schedules', formattedDate);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.videoURL) {
            setVideoURL(data.videoURL);
          } else {
            console.warn('videoURL field is missing in the document');
          }
        } else {
          console.warn('No document found for today’s date:', formattedDate);
        }
      } catch (error) {
        console.error('Error fetching videoURL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  // Use a shared layout for all states
  const renderCardContent = () => {
    if (loading) {
      return <p style={styles.messageText}>Loading video...</p>;
    }
    if (!videoURL) {
      return <p style={styles.messageText}>No recorded mass available for today.</p>;
    }
    return (
      <>
        <h2 style={styles.title}>Recorded Mass for Today</h2>
        <div style={styles.videoWrapper}>
          <iframe
            src={videoURL}
            title="Recorded Mass"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={styles.iframe}
          />
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {renderCardContent()}
      </div>
    </div>
  );
}