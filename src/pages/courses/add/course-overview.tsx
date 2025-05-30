import { Editor } from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createOverview,
  fetchOverview,
  updateOverview,
} from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseOverview = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");

  const loading = useSelector((state) => state.course.isLoading);
  const overview = useSelector((state) => state.course.singleData);
  const singleCourse = useSelector((state) => state.course.singleCourse);

  // TODO: fetch the overview
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchOverview({
          params: {
            filters: {
              "course.id": {
                $eq: id,
              },
            },
          },
        })
      );
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (overview) {
      setContent(overview?.description);
    }
  }, [overview]);

  const handleSubmit = () => {
    if (overview?.id) {
      dispatch(
        updateOverview({
          data: {
            description: content,
          },
          id: overview?.id,
        })
      );
    } else {
      dispatch(
        createOverview({
          data: {
            course: id,
            description: content,
          },
        })
      );
    }
  };

  return (
    <div>
      <Card className="my-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-20">
            {isEdit && id ? "Update" : "Add New"}{" "}
            {singleCourse?.name || "Course"} Overview{" "}
          </CardTitle>
          <CardDescription>Enter the course overview</CardDescription>
        </CardHeader>

        <Editor
          placeholder="Write Course Overview Here..."
          value={content}
          onChange={(value) => setContent(value)}
        />
      </Card>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
        <Button
          disabled={loading}
          type="button"
          variant="outline"
          onClick={() => navigate("/courses")}
        >
          Cancel
        </Button>
        <Button type="reset" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Please wait
            </>
          ) : (
            <>
              {isEdit && id && overview?.id ? "Update" : "Add"} Course Overview
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CourseOverview;
