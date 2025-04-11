"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ImagePlus, Loader2 } from "lucide-react";
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import { uploadFile, listFiles } from "@/lib/s3";

const imageSize = 300;

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      listImages();
    }
  }, [user]);

  const listImages = async () => {
    try {
      const urls = await listFiles(user?.uid || '');
      setImages(urls);
    } catch (error) {
      console.error("Error listing images:", error);
      toast({
        title: "Error listing images",
        description: "Failed to retrieve images. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const uploadFiles = async () => {
    setUploading(true);

    try {
      await Promise.all(
        files.map(async (file) => {
          if (user?.uid) {
            await uploadFile(file, user.uid);
          } else {
            throw new Error("User not authenticated");
          }
        })
      );

      toast({
        title: "Upload Successful",
        description: "All images have been successfully uploaded.",
      });

      setFiles([]);
      setOpen(false);
      listImages();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading the images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };


  if (!user) {
    return <div className="auth-container">Please sign in to view this page.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Images</h1>
        <div>
          <Button variant="outline" onClick={signOut}>Sign Out</Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <ImagePlus className="mr-2 h-4 w-4" /> Upload Images
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Images</DialogTitle>
            <DialogDescription>
              Select one or more images to upload to your gallery.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={uploadFiles} disabled={uploading}>
              {uploading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((imageUrl, i) => (
            <div key={i} className="relative h-0 aspect-square overflow-hidden rounded-md shadow-md">
              <Image
                src={imageUrl}
                alt={`Uploaded Image ${i}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="transition-transform duration-300 hover:scale-110"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 text-muted-foreground">No images uploaded yet.</div>
      )}
    </div>
  );
}
