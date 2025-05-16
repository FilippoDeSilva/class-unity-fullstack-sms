"use client";

import { chapterSchema, ChapterSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createChapter, updateChapter } from "@/lib/actions";
import InputField from "@/components/InputField";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Chapter Form"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

type ChapterFormProps = {
  type: "create" | "update";
  data?: ChapterSchema;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  relatedData: {
    courses: { id: number; name: string }[];
    classes: { id: number; name: string }[];
    teachers: { id: string; name: string; surname: string }[];
  };
};

const ChapterForm = ({ type, data, setOpen, relatedData }: ChapterFormProps) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChapterSchema>({
    resolver: zodResolver(chapterSchema),
    defaultValues: data,
  });

  const onSubmit = async (data: ChapterSchema) => {
    try {
      if (type === "create") {
        await createChapter(data);
        toast.success("Chapter created successfully!");
      } else {
        await updateChapter(data);
        toast.success("Chapter updated successfully!");
      }
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while saving the chapter.");
    }
  };

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Chapter" : "Update the Chapter"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Chapter Name"
          name="name"
          register={register}
          error={errors.name}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            id="day"
            {...register("day")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select a day</option>
            {["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
          {errors.day && (
            <p className="text-xs text-red-400">{errors.day.message}</p>
          )}
        </div>
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          register={register}
          error={errors.endTime}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Course</label>
          <select
            id="courseId"
            {...register("courseId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select a course</option>
            {relatedData.courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-xs text-red-400">{errors.courseId.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            id="classId"
            {...register("classId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select a class</option>
            {relatedData.classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          {errors.classId && (
            <p className="text-xs text-red-400">{errors.classId.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            id="teacherId"
            {...register("teacherId")}
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          >
            <option value="">Select a teacher</option>
            {relatedData.teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {`${teacher.name} ${teacher.surname}`}
              </option>
            ))}
          </select>
          {errors.teacherId && (
            <p className="text-xs text-red-400">{errors.teacherId.message}</p>
          )}
        </div>
      </div>
      {errors.root && (
        <span className="text-red-500">{errors.root.message}</span>
      )}
      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md"
      >
        {type === "create" ? "Create" : "Update"} Chapter
      </button>
    </form>
  );
};

export default ChapterForm;
