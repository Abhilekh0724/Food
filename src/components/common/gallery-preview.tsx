import { deleteImage } from "@/store/features/media-slice";
import { dispatch } from "@/store/store";
import { devLog } from "@/util/logger";
import { FileIcon, XCircleIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";

const GalleryPreview = ({
  documentPreviews,
  setDocumentPreviews,
  form,
  gallery,
}: {
  documentPreviews: string[];
  setDocumentPreviews: Dispatch<SetStateAction<string[]>>;
  form: UseFormReturn<
    {
      category: string;
      name: string;
      slug: string;
      note: string;
      stock: number;
      discount_percentage: number;
      discount_value: number;
      price: number;
      vendor: string;
      gallery?: FileList | undefined;
    },
    any,
    undefined
  >;
  gallery: { id: string; url: string }[];
}) => {
  return (
    <div>
      {documentPreviews.length > 0 && (
        <div className="grid grid-cols-3 gap-5">
          {documentPreviews.map((preview, index) => (
            <div
              key={index}
              className="relative p-2 border rounded-lg bg-white shadow-md w-full"
            >
              {preview.startsWith("blob:") || preview.startsWith("http") ? (
                <div className="relative w-full h-full rounded-md overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-full rounded-md aspect-square"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-lg">
                  <FileIcon className="w-6 h-6 text-gray-600" />
                  <span className="text-xs text-gray-700 mt-1 text-center">
                    {preview}
                  </span>
                </div>
              )}
              {/* Delete Button */}
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-sm hover:bg-gray-200"
                onClick={() => {
                  const fileToDelete = documentPreviews[index];
                  if (fileToDelete?.startsWith("http"))
                    dispatch(
                      deleteImage({
                        id: gallery?.find((g) => g.url === fileToDelete)?.id,
                      })
                    );
                  // Remove from previews
                  const updatedPreviews = documentPreviews.filter(
                    (_, i) => i !== index
                  );
                  setDocumentPreviews(updatedPreviews);

                  // Remove from gallery files
                  const currentFiles = form.getValues("gallery");

                  devLog(currentFiles);

                  if (currentFiles) {
                    const newFiles = new DataTransfer();
                    Array.from(currentFiles).forEach((file, i) => {
                      if (i !== index && file instanceof File) {
                        newFiles.items.add(file); // Ensure it's a File before adding
                        form.setValue("gallery", newFiles.files);
                      }
                    });
                  }
                }}
              >
                <XCircleIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryPreview;
