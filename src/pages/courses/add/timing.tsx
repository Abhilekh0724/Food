import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createTiming,
  fetchTimings,
  updateTiming,
} from "@/store/features/course-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import moment from "moment";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { TimingsFormValues, timingsSchema } from "../schema/timing-schema";

const TimingsForm = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const timings = useSelector((state) => state.course.singleData);
  const singleCourse = useSelector((state) => state.course.singleCourse);
  const loading = useSelector((state) => state.course.isLoading);

  const form = useForm<TimingsFormValues>({
    resolver: zodResolver(timingsSchema),
    defaultValues: {
      timings: [
        {
          date: new Date(),
          timeRanges: [{ startTime: "09:00:00", endTime: "10:00:00" }],
        },
      ],
    },
  });

  const {
    fields: timingsFields,
    append: appendTiming,
    remove: removeTiming,
  } = useFieldArray({
    control: form.control,
    name: "timings",
  });

  const onSubmit = (data: TimingsFormValues) => {
    dispatch(
      isEdit && id && timings?.length
        ? updateTiming({
            data: data.timings.map((timing) => ({
              ...timing,
              date: moment(timing?.date)?.format("YYYY-MM-DD"),
              course: id,
            })),
          })
        : createTiming({
            data: data.timings.map((timing) => ({
              ...timing,
              date: moment(timing?.date)?.format("YYYY-MM-DD"),
              course: id,
            })),
          })
    );
  };

  // TODO: fetch the timings
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchTimings({
          params: {
            populate: "timeRanges",
            filters: {
              "course.id": {
                $eq: id,
              },
            },
            sort: "date:ASC",
          },
        })
      );
    }
  }, [id, isEdit]);

  useEffect(() => {
    if (timings?.length) {
      form.reset({
        timings: timings?.map((timing: any) => ({
          date: new Date(timing?.date),
          timeRanges: timing?.timeRanges?.map((timeRange: any) => ({
            startTime: timeRange?.startTime,
            endTime: timeRange?.endTime,
          })),
        })),
      });
    }
  }, [form, timings]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card className="my-6 p-2 space-y-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-20">
              {isEdit && id && timings?.length ? "Update" : "Add"}{" "}
              {singleCourse?.name || "Course"} Timings{" "}
            </CardTitle>
            <CardDescription>Enter the course timings</CardDescription>
          </CardHeader>
          {timingsFields.map((timing, timingIndex) => (
            <div key={timing.id} className="space-y-4 border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Timing {timingIndex + 1}</h3>
                {/* Conditionally render the delete button */}
                {timingsFields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTiming(timingIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <FormField
                control={form.control}
                name={`timings.${timingIndex}.date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <TimeRangesFieldArray timingIndex={timingIndex} form={form} />
            </div>
          ))}
        </Card>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              appendTiming({
                date: new Date(),
                timeRanges: [{ startTime: "09:00:00", endTime: "10:00:00" }],
              })
            }
          >
            Add Timing
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            onClick={() => navigate("/courses")}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              <>
                {isEdit && id && timings?.length ? "Update" : "Add"} Course
                Timings
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

// Sub-component for managing time ranges within a timing
const TimeRangesFieldArray = ({
  timingIndex,
  form,
}: {
  timingIndex: number;
  form: any;
}) => {
  const {
    fields: timeRangeFields,
    append: appendTimeRange,
    remove: removeTimeRange,
  } = useFieldArray({
    control: form.control,
    name: `timings.${timingIndex}.timeRanges`,
  });

  return (
    <div className="space-y-4">
      {timeRangeFields.map((timeRange, timeRangeIndex) => (
        <div key={timeRange.id} className="space-y-2 border rounded p-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Time Range {timeRangeIndex + 1}</h4>
            {timeRangeFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTimeRange(timeRangeIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <FormField
            control={form.control}
            name={`timings.${timingIndex}.timeRanges.${timeRangeIndex}.startTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" step="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`timings.${timingIndex}.timeRanges.${timeRangeIndex}.endTime`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" step="1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          appendTimeRange({ startTime: "09:00:00", endTime: "10:00:00" })
        }
      >
        Add Time Range
      </Button>
    </div>
  );
};

export default TimingsForm;
