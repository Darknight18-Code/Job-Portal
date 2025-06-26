"use client";

import { FilePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Resume {
  id?: string;
  url: string;
  name: string;
}

interface ResumeUploadProps {
  disabled?: boolean;
  onChange: (resumes: Resume[]) => void;
  onRemove: (url: string) => void;
  value: Resume[];
  userId: string;
}

const ResumeUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  userId,
}: ResumeUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "uploadVIA browser"); // Make sure this matches your Cloudinary preset

    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dvgwvhg3c/auto/upload",
        formData,
        {
          onUploadProgress: (event) => {
            const prog = (event.loaded / event.total!) * 100;
            setProgress(prog);
          },
        }
      );

      const newResume = {
        url: res.data.secure_url,
        name: file.name,
      };

      // Update MongoDB
      const response = await axios.patch(
        `/api/users/${userId}/resumes`,
        {
          resumes: [...value, newResume],
        }
      );

      onChange([...value, ...response.data]); // Expect updated list with IDs
    } catch (err) {
      console.error("Resume upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (url: string) => {
    try {
      await axios.delete(`/api/users/${userId}/resumes/delete`, {
        data: { url },
        headers: {
          "Content-Type": "application/json",
        },
      });

      onRemove(url);
    } catch (err) {
      console.error("Error removing resume:", err);
    }
  };

  return (
    <div className="space-y-2">
      {/* Upload Area */}
      <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center">
        {isLoading ? (
          <p>{`${progress.toFixed(2)}%`}</p>
        ) : (
          <label className="w-full h-full flex items-center justify-center">
            <div className="flex gap-2 items-center justify-center cursor-pointer">
              <FilePlus className="w-4 h-4 mr-2" />
              <p>Add Resume</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="w-0 h-0"
              onChange={onUpload}
              disabled={disabled}
            />
          </label>
        )}
      </div>

      {/* File List */}
      <div className="space-y-1">
        {value.map((file) => (
          <div
            key={file.id || file.url}
            className="flex items-center justify-between p-2 bg-white rounded shadow"
          >
            <p className="truncate w-4/5 text-sm">{file.name}</p>
            <button
              type="button"
              onClick={() => handleRemove(file.url)}
              disabled={disabled}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeUpload;
