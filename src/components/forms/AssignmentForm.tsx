"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AssignmentSchema } from "@/lib/formValidationSchemas";
import { createAssignment, updateAssignment, deleteAssignment } from "@/lib/actions";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Assignment Form"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

// Update the AssignmentSchema to use proper types
const AssignmentSchemaWithTypes = AssignmentSchema.extend({
  chapterId: z.coerce.number(),
  startDate: z.coerce.date(),
  dueDate: z.coerce.date(),
});

type AssignmentFormData = z.infer<typeof AssignmentSchemaWithTypes>;

type CurrentState = { success: boolean; error: boolean };

const AssignmentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update" | "delete";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(AssignmentSchemaWithTypes),
    defaultValues: {
      title: data?.title || "",
      startDate: data?.startDate ? new Date(data.startDate) : undefined,
      dueDate: data?.dueDate ? new Date(data.dueDate) : undefined,
      chapterId: data?.chapterId || undefined,
    },
  });

  const router = useRouter();
  const [currentState, setCurrentState] = useState<CurrentState>({ success: false, error: false });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      let result: CurrentState;
      if (type === "create") {
        result = await createAssignment(currentState, formData);
      } else if (type === "update") {
        result = await updateAssignment(currentState, { ...formData, id: data.id });
      } else if (type === "delete") {
        result = await deleteAssignment(currentState, { id: data.id });
      } else {
        result = { success: false, error: true }; // Fallback in case of unexpected type
      }
      setCurrentState(result);

      if (result.success) {
        toast(`Assignment ${type === "create" ? "created" : type === "update" ? "updated" : "deleted"} successfully!`);
        setOpen(false);
        router.refresh();
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error(`Error during assignment ${type}:`, error);
      toast.error("An error occurred. Please try again.");
      setError("root", { message: "Something went wrong!" });
    }
  });

  const { chapters = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Assignment" : type === "update" ? "Update the Assignment" : "Delete the Assignment"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {type !== "delete" && (
          <>
            <InputField
              label="Assignment Title"
              name="title"
              register={register}
              error={errors.title}
            />
            <InputField
              label="Start Date"
              name="startDate"
              type="datetime-local"
              register={register}
              error={errors.startDate}
            />
            <InputField
              label="Due Date"
              name="dueDate"
              type="datetime-local"
              register={register}
              error={errors.dueDate}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Select Chapter</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("chapterId")}
              >
                <option value="">Select a chapter</option>
                {chapters && chapters.length > 0 ? (
                  chapters.map((chapter: { id: number; name: string }) => (
                    <option value={chapter.id} key={chapter.id}>
                      {chapter.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No Chapters available</option>
                )}
              </select>
              {errors.chapterId && (
                <p className="text-xs text-red-400">{errors.chapterId.message}</p>
              )}
            </div>
          </>
        )}
      </div>
      {errors.root && (
        <span className="text-red-500">{errors.root.message}</span>
      )}
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : type === "update" ? "Update" : "Delete"}
      </button>
    </form>
  );
};

export default AssignmentForm;
