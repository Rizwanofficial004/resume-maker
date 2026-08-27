import mongoose from 'mongoose';

const customTemplateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, default: 'custom' },
    thumb: { type: String, default: 'Custom layout' },
    defaultAccent: { type: String, default: '#1d4ed8' },
    /** Full declarative template definition (layout, header, sections). */
    definition: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

customTemplateSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model('CustomTemplate', customTemplateSchema);
