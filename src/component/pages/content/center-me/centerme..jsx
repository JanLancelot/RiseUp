import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../../backend/config/firebase';

export default function RecordedCenterMe() {
  const [centerMeURL, setCenterMeURL] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenterMeVideo = async () => {
      try {
        const manilaFormatter = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Manila',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        const formattedDate = manilaFormatter.format(new Date());
        const docRef = doc(db, 'daily_schedules', formattedDate);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.centerMeURL) {
            setCenterMeURL(data.centerMeURL);
          } else {
            console.warn('centerMeURL field is missing in the document');
          }
        } else {
          console.warn('No document found for today’s date:', formattedDate);
        }
      } catch (error) {
        console.error('Error fetching centerMeURL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenterMeVideo();
  }, []);

  if (loading) return <p>Loading Center Me video...</p>;
  if (!centerMeURL) return <p>No Center Me video available for today.</p>;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Center Me Video for Today</h2>
      <div style={{ position: 'relative', paddingTop: '56.25%', height: 0 }}>
        <iframe
          src={centerMeURL}
          title="Center Me Video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '8px',
          }}
        />
      </div>
    </div>
  );
}
