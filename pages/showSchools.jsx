// pages/showSchools.jsx
import { useEffect, useState } from 'react';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    async function fetchSchools() {
      const res = await fetch('/api/schools');
      const data = await res.json();
      setSchools(data);
    }
    fetchSchools();
  }, []);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '20px', padding: '20px' }}>
      {schools.map(s => (
        <div key={s.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}>
          <img src={s.image} alt={s.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
          <h3>{s.name}</h3>
          <p>{s.address}</p>
          <p>{s.city}</p>
        </div>
      ))}
    </div>
  );
}
