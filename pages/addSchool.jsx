// pages/addSchool.jsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddSchool() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    const formData = new FormData();

    // Append all fields except image
    Object.keys(data).forEach(key => {
      if (key !== 'image') {
        formData.append(key, data[key]);
      }
    });

    // Append the actual file (first file in FileList)
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]);
    }

    const res = await fetch('/api/schools', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setMessage('School added successfully!');
    } else {
      setMessage('Failed to add school.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
        <input {...register('name', { required: true })} placeholder="Name" />
        {errors.name && <p>Name is required</p>}

        <input {...register('address')} placeholder="Address" />
        <input {...register('city')} placeholder="City" />
        <input {...register('state')} placeholder="State" />
        <input {...register('contact')} placeholder="Contact" type="number" />

        <input {...register('email_id', {
          required: true,
          pattern: /^\S+@\S+$/i
        })} placeholder="Email" />
        {errors.email_id && <p>Valid email is required</p>}

        <input type="file" {...register('image', { required: true })} />
        {errors.image && <p>Image is required</p>}

        <button type="submit">Add School</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
