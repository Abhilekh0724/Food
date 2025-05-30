import { useMemo } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
  placeholder?: string;
}

export const Editor = ({
  onChange,
  value,
  placeholder = "Write Something",
}: EditorProps) => {
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link"],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  return (
    <div className="bg-background">
      <ReactQuill
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        onChange={onChange}
        className="m-6"
        placeholder={placeholder}
      />
    </div>
  );
};
