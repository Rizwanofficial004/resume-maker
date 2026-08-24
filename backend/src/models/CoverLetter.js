import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Cover Letter' },
    recipientName: { type: String, default: '' },
    companyName: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
    senderName: { type: String, default: '' },
    senderEmail: { type: String, default: '' },
    senderPhone: { type: String, default: '' },
    date: { type: String, default: '' },
    body: { type: String, default: '' },
    closing: { type: String, default: 'Sincerely' },
  },
  { timestamps: true }
);

const CoverLetter = mongoose.model('CoverLetter', coverLetterSchema);
export default CoverLetter;
