import mongoose from 'mongoose';

const bulletSchema = new mongoose.Schema(
  { text: { type: String, default: '' } },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled Resume' },
    templateId: { type: String, default: 'onyx' },
    accentColor: { type: String, default: '#1d4ed8' },
    fontFamily: { type: String, default: 'inter' },
    fontSize: { type: String, default: 'normal' },
    sectionSpacing: { type: Number, default: 16 },
    paragraphSpacing: { type: Number, default: 8 },
    lineSpacing: { type: Number, default: 1.5 },
    sectionOrder: {
      left: { type: [String], default: ['experience', 'education', 'projects'] },
      right: { type: [String], default: ['skills', 'certifications', 'languages'] },
    },
    isDefault: { type: Boolean, default: false },

    personal: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      phoneCode: { type: String, default: '+92' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zip: { type: String, default: '' },
      country: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      summary: { type: String, default: '' },
      photo: { type: String, default: '' },
      additionalInfo: { type: String, default: '' },
    },

    experience: [
      {
        id: String,
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: { type: [bulletSchema], default: [] },
      },
    ],

    education: [
      {
        id: String,
        school: String,
        degree: String,
        fieldOfStudy: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    ],

    skills: [
      {
        id: String,
        name: String,
        level: { type: Number, min: 0, max: 5, default: 3 },
      },
    ],

    projects: [
      {
        id: String,
        name: String,
        link: String,
        startDate: String,
        endDate: String,
        description: { type: [bulletSchema], default: [] },
      },
    ],

    certifications: [
      {
        id: String,
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],

    languages: [
      {
        id: String,
        name: String,
        proficiency: String,
      },
    ],

    awards: [
      {
        id: String,
        name: String,
        date: String,
        issuer: String,
        description: { type: String, default: '' },
      },
    ],

    hobbies: { type: String, default: '' },

    websites: [
      {
        id: String,
        label: String,
        url: String,
      },
    ],

    references: { type: String, default: '' },
    customSections: [
      {
        id: String,
        title: String,
        content: { type: String, default: '' },
      },
    ],

    atsScore: { type: Number, default: 0 },
    reviewStatus: { type: String, enum: ['none', 'in-review', 'ready'], default: 'none' },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, updatedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
