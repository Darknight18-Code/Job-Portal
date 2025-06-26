"use client";

import { FilePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Attachment {
  id: string;
  url: string;
  name: string;
}

interface AttachmentsUploadProps {
   disabled?: boolean;
  onChange: (value: { id?: string; url: string; name: string }[]) => void;
  onRemove: (url: string) => void;
  value: { id?: string; url: string; name: string }[];
  jobId: string;
}

const AttachmentsUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
  jobId,
}: AttachmentsUploadProps) => {
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
    formData.append("upload_preset", "uploadVIA browser");
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

      const newAttachment = {
        url: res.data.secure_url,
        name: file.name,
      };

      // Save to MongoDB via PATCH and get full updated list with IDs
      const response = await axios.patch(`/api/jobs/${jobId}/attachments`, {
        attachments: [...value, newAttachment],
      });

      onChange(response.data); // Pass updated list with IDs
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

 const handleRemove = async (url: string) => {
  try {
    await axios.delete(`/api/jobs/${jobId}/attachments/delete`, {
      data: { url },
      headers: {
        "Content-Type": "application/json",
      },
    });

    onRemove(url); // remove from UI state
  } catch (err) {
    console.error("Error removing attachment:", err);
  }
};

  return (
    <div className="space-y-2">
      <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center">
        {isLoading ? (
          <p>{`${progress.toFixed(2)}%`}</p>
        ) : (
          <label className="w-full h-full flex items-center justify-center">
            <div className="flex gap-2 items-center justify-center cursor-pointer">
              <FilePlus className="w-4 h-4 mr-2" />
              <p>Add a file</p>
            </div>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
              className="w-0 h-0"
              onChange={onUpload}
              disabled={disabled}
            />
          </label>
        )}
      </div>

      <div className="space-y-1">
        {value.map((file) => (
          <div
            key={file.id || file.url}
            className="flex items-center justify-between p-2 bg-white rounded shadow"
          >
            <p className="truncate w-4/5 text-sm">{file.name}</p>
            <button
              type="button"
              onClick={() => handleRemove( file.url)}
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

export default AttachmentsUpload;
