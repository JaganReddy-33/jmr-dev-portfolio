import { RESUME } from '../../config/site';
import Modal from '../ui/Modal';

/** Live preview of the resume stored in Google Drive; update the Drive file and this stays current. */
export default function ResumeModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} wide title="Resume">
      <iframe className="rvw" src={RESUME.preview} title="Resume preview" loading="lazy" />
      <div className="btns">
        <a className="btn" href={RESUME.download}>⬇ Download PDF</a>
        <a className="btn g" href={RESUME.view} target="_blank" rel="noopener noreferrer">↗ Open in new tab</a>
      </div>
    </Modal>
  );
}
