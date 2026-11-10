
import React, { useEffect, useState } from "react";
import {
  FiX,
  FiUser,
  FiCamera,
  FiMapPin,
  FiGlobe,
  FiGithub,
  FiLinkedin,
  FiBookOpen,
  FiBriefcase,
  FiSave,
  FiLoader,
  FiPlus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { updateProfile } from "../services/authServices";

const initialFormData = {
  fullName: "",
  location: "",
  bio: "",
  website: "",
  linkedin: "",
  github: "",

  // Student fields
  university: "",
  program: "",
  semester: "",

  // Professional fields
  jobTitle: "",
  company: "",
  experienceLevel: "",
  skills: "",
};

const EditProfile = ({ isOpen, onClose, user, onUpdated }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fill the form with existing user information
  useEffect(() => {
    if (!user) return;

    setFormData({
      fullName: user.fullName || "",
      location: user.location || "",
      bio: user.bio || "",
      website: user.website || "",
      linkedin: user.linkedin || "",
      github: user.github || "",

      university: user.university || "",
      program: user.program || "",
      semester: user.semester || "",

      jobTitle: user.jobTitle || "",
      company: user.company || "",
      experienceLevel: user.experienceLevel || "",
      skills: Array.isArray(user.skills)
        ? user.skills.join(", ")
        : "",
    });

    setPreviewImage(user.profilepic || "");
    setProfileImage(null);
  }, [user, isOpen]);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle profile picture selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10MB.");
      e.target.value = "";
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      // Common profile fields
      data.append("fullName", formData.fullName.trim());
      data.append("location", formData.location);
      data.append("bio", formData.bio);
      data.append("website", formData.website);
      data.append("linkedin", formData.linkedin);
      data.append("github", formData.github);

      // Student-specific fields
      if (user?.role === "student") {
        data.append("university", formData.university);
        data.append("program", formData.program);
        data.append("semester", formData.semester);
      }

      // Professional-specific fields
      if (user?.role === "professional") {
        data.append("jobTitle", formData.jobTitle);
        data.append("company", formData.company);
        data.append("experienceLevel", formData.experienceLevel);
      }

      // Skills can be used by both students and professionals
      const skillsArray = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      data.append("skills", JSON.stringify(skillsArray));

      // Profile image
      if (profileImage) {
        data.append("profilepic", profileImage);
      }

      const response = await updateProfile(data);

      const updatedUser = response.data.user;

      if (updatedUser) {
        onUpdated?.(updatedUser);
      }

      toast.success(
        response.data.message || "Profile updated successfully!"
      );

      onClose();
    } catch (error) {
      console.error(
        "Profile update error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

  const labelClass =
    "mb-2 block text-sm font-medium text-gray-700";

  const sectionTitleClass =
    "mb-4 flex items-center gap-2 text-base font-semibold text-gray-800";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your personal and professional information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Form body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto px-5 py-6 sm:px-7"
        >
          {/* Profile picture */}
          <div className="mb-7 flex flex-col items-center">
            <div className="group relative">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-50 bg-gray-100">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="text-5xl text-gray-400" />
                )}
              </div>

              <label
                htmlFor="profilepic"
                className="absolute bottom-1 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-white shadow-md transition hover:bg-emerald-700"
              >
                <FiCamera size={17} />
              </label>

              <input
                type="file"
                id="profilepic"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <p className="mt-3 text-sm font-medium text-gray-700">
              Change profile picture
            </p>
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG or WEBP (maximum 10MB)
            </p>
          </div>

          {/* Common information */}
          <section className="mb-8">
            <h3 className={sectionTitleClass}>
              <FiUser className="text-emerald-600" />
              Basic Information
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className={`${inputClass} cursor-not-allowed bg-gray-50 text-gray-400`}
                />
                <p className="mt-1 text-xs text-gray-400">
                  Email cannot be changed here.
                </p>
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mahendranagar, Nepal"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>About / Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                  placeholder="Write something about yourself..."
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {formData.bio.length}/500
                </p>
              </div>
            </div>
          </section>

          {/* Student information */}
          {user?.role === "student" && (
            <section className="mb-8">
              <h3 className={sectionTitleClass}>
                <FiBookOpen className="text-emerald-600" />
                Education Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className={labelClass}>University / College</label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="Enter your university"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Program</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    placeholder="e.g. BE Computer Engineering"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select semester</option>
                    {Array.from({ length: 8 }, (_, index) => (
                      <option key={index + 1} value={`${index + 1}th Semester`}>
                        {index + 1}th Semester
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Professional information */}
          {user?.role === "professional" && (
            <section className="mb-8">
              <h3 className={sectionTitleClass}>
                <FiBriefcase className="text-emerald-600" />
                Professional Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Job Title</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineer"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Select experience level</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior</option>
                    <option value="Mid-Level">Mid-Level</option>
                    <option value="Senior">Senior</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* Skills */}
          <section className="mb-8">
            <h3 className={sectionTitleClass}>
              <FiPlus className="text-emerald-600" />
              Skills
            </h3>

            <label className={labelClass}>
              Your Skills
            </label>

            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB, JavaScript"
              className={inputClass}
            />

            <p className="mt-2 text-xs text-gray-400">
              Separate each skill with a comma.
            </p>
          </section>

          {/* Social links */}
          <section className="mb-5">
            <h3 className={sectionTitleClass}>
              <FiGlobe className="text-emerald-600" />
              Social Links
            </h3>

            <div className="space-y-5">
              <div>
                <label className={labelClass}>Personal Website</label>
                <div className="relative">
                  <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>LinkedIn Profile</label>
                <div className="relative">
                  <FiLinkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/username"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>GitHub Profile</label>
                <div className="relative">
                  <FiGithub className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleChange}
                    placeholder="https://github.com/username"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Footer buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
