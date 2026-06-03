import React, { useState } from 'react';

export default function ImageUploader({
  label = 'Imagen',
  value,
  onChange,
}) {
  const [preview, setPreview] = useState(value || '');

  const handleFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const base64 = reader.result;

      setPreview(base64);

      if (onChange) {
        onChange(base64);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="image-uploader">
      <label>{label}</label>

      {preview && (
        <div className="image-preview">
          <img src={preview} alt={label} />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
      />

      {preview && (
        <button
          type="button"
          onClick={() => {
            setPreview('');

            if (onChange) {
              onChange('');
            }
          }}
        >
          Quitar imagen
        </button>
      )}
    </div>
  );
}
