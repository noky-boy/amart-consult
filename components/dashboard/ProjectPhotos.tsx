// amart-consult/components/dashboard/ProjectPhotos.tsx
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Eye, X, Loader2 } from "lucide-react";
import { documentService } from "@/lib/supabase";
import type { ClientDocument } from "@/lib/supabase";

// PhotoThumbnail can be a sub-component within this file
const PhotoThumbnail = ({
  photo,
  onClick,
}: {
  photo: ClientDocument;
  onClick: (url: string) => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);
      const url = await documentService.getDownloadUrl(photo.file_path);
      setImageUrl(url);
      setLoading(false);
    };
    loadImage();
  }, [photo.file_path]);

  return (
    <div
      className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer"
      onClick={() => imageUrl && onClick(imageUrl)}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-slate-400 animate-spin" />
        </div>
      ) : imageUrl ? (
        <img
          src={imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="h-8 w-8 text-slate-400" />
        </div>
      )}
    </div>
  );
};

export default function ProjectPhotos({
  photos,
}: {
  photos: ClientDocument[];
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="h-5 w-5 text-purple-600" />
            <span>Project Photos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
                <PhotoThumbnail
                  key={photo.id}
                  photo={photo}
                  onClick={setSelectedImage}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Photos Yet
              </h3>
              <p className="text-slate-600">
                Project photos will appear here as they are uploaded.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Project photo"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
