/** Picks an image, downsizes it in a canvas and returns a JPEG data URL. */
export default function ImagePicker({ value, onChange }) {
  const pick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'), s = Math.min(1, 640 / img.width);
        c.width = img.width * s; c.height = img.height * s;
        const x = c.getContext('2d');
        x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
        onChange(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
  return (
    <div>
      <input type="file" accept="image/*" onChange={pick} />
      {value && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 8 }}>
          <img className="prev" src={value} alt="preview" />
          <button type="button" className="btn g sm" onClick={() => onChange('')}>Remove</button>
        </div>
      )}
    </div>
  );
}
