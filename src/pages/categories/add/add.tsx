import Loader from "@/components/common/loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
  createCategory,
  fetchSingleCategory,
  updateCategory,
} from "@/store/features/category-slice";
import { dispatch, useSelector } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { formSchema, FormValues } from "../schema/form-schema";

const AddCategoryPage = ({ isEdit = false }: { isEdit?: boolean }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchLoading = useSelector((state) => state.category.fetchLoading);
  const loading = useSelector((state) => state.category.isLoading);
  const singleCategory = useSelector((state) => state.category.singleData);

  // TODO: fetch the single category
  useEffect(() => {
    if (isEdit && id) {
      dispatch(
        fetchSingleCategory({
          id,
        })
      );
    }
  }, [id, isEdit]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    isEdit && id
      ? dispatch(
          updateCategory({
            data,
            navigate,
            id,
          })
        )
      : dispatch(
          createCategory({
            data,
            navigate,
          })
        );
  };

  useEffect(() => {
    if (singleCategory && id) {
      form.reset({
        name: singleCategory?.name || "",
        slug: singleCategory?.slug || "",
      });
    }
  }, [singleCategory, form, id]);

  return (
    <>
      {fetchLoading ? (
        <Loader />
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-10 flex-wrap">
              <Card className="my-6 p-2 sm:p-6 flex-[2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-20">
                    {isEdit && id ? "Update" : "Add New"} Category{" "}
                  </CardTitle>
                  {!(isEdit && id) && (
                    <CardDescription>
                      Enter the category details to create a new category.
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Category Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            {/* <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /> */}
                            <Input
                              className="pl-3"
                              placeholder="Eg: Web Development Training"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={() => navigate("/course-categories")}
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
                  <>{isEdit && id ? "Update" : "Add"} Category</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

// Simple check icon component

export default AddCategoryPage;
