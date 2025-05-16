"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { examSchema, ExamSchema } from "@/lib/formValidationSchemas";
import { createExam, updateExam } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Exam Form"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

const ExamForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit(async (formData) => {
    try {
      await formAction(formData);
      // Close modal immediately
      setOpen(false);
      // Show success message
      toast.success(`Exam ${type === "create" ? "created" : "updated"} successfully!`);
      // Refresh the page
      router.refresh();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Something went wrong!");
    }
  });

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state, router, setOpen]);

  const { chapters } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new exam" : "Update the exam"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Exam title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start Date"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End Date"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
          type="datetime-local"
        />
        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Chapter</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("chapterId")}
            defaultValue={data?.chapterId}
          >
            {chapters.map((chapter: { id: number; name: string }) => (
              <option value={chapter.id} key={chapter.id}>
                {chapter.name}
              </option>
            ))}
          </select>
          {errors.chapterId?.message && (
            <p className="text-xs text-red-400">
              {errors.chapterId.message.toString()}
            </p>
          )}
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button 
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition-colors"
        disabled={state.success}
      >
        {state.success ? "Processing..." : type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ExamForm;
