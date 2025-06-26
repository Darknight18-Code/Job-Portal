"use client"

import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

interface ImageuploadProps{
    disabled?: boolean;
    onChange : (value : string) =>void;
    onRemove : (value : string) =>void;
    value : string;
}

const Imageupload = ({disabled,onChange,onRemove,value} : ImageuploadProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progrees, setProgrees] = useState<number>(0);

    useEffect(() =>{
        setIsMounted(true)
    } , [])

    if(!isMounted){
        return null;
    }

    


// inside onUpload:
const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "uploadVIA browser");
  setIsLoading(true);

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvgwvhg3c/image/upload",
      formData,
      {
        onUploadProgress: (event) => {
          const progress = (event.loaded / event.total!) * 100;
          setProgrees(progress);
        },
      }
    );

    onChange(res.data.secure_url);
    console.log(res.data.secure_url)
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div>
      {value ? <>
      <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden">
        <Image
            fill
            className="w-full h-full object-cover"
            alt = "Image Cover"
            src={value}
        />
      </div>
      </> :<>
        <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border border-dashed bg-neutral-50">
            {isLoading ? (<>
                <p>{`${progrees.toFixed(2)}%`}</p>
            </>) : (<>
                <label>
                    <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer text-neutral-500">
                        <ImagePlus className="w-10 h-10"/>
                        <p>Upload an Image</p>
                    </div>
                    <input type="file" accept="image/*" className="w-0 h-0" onChange={onUpload}/>
                </label>
            </>)}
        </div>
      </>}
    </div>
  )
}

export default Imageupload
