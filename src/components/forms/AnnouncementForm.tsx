"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { AnnouncementSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/actions";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Announcement Form"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}


// Update the AnnouncementSchema to use proper types
const AnnouncementSchemaWithTypes = AnnouncementSchema.extend({
  classId: z.union([z.coerce.number(), z.literal("")]).optional(),
  date: z.coerce.date(),
});

type AnnouncementFormData = z.infer<typeof AnnouncementSchemaWithTypes>;

type CurrentState = { success: boolean; error: boolean };

const AnnouncementForm = ({
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
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(AnnouncementSchemaWithTypes),
    defaultValues: {
      title: data?.title || "",
      description: data?.description || "",
      date: data?.date ? new Date(data.date) : undefined,
      classId: data?.classId || "",
    },
  });

  const router = useRouter();
  const [currentState, setCurrentState] = useState<CurrentState>({ success: false, error: false });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      let result: CurrentState;
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (type === "create") {
        result = await createAnnouncement(currentState, formDataToSend);
      } else if (type === "update") {
        formDataToSend.append("id", data.id.toString());
        result = await updateAnnouncement(currentState, formDataToSend);
      } else if (type === "delete") {
        result = await deleteAnnouncement(currentState, { id: data.id });
      } else {
        result = { success: false, error: true }; // Fallback in case of unexpected type
      }
      setCurrentState(result);

      if (result.success) {
        toast(`Announcement ${type === "create" ? "created" : type === "update" ? "updated" : "deleted"} successfully!`);
        setOpen(false);
        router.refresh();
      } else {
        throw new Error("Operation failed");
      }
    } catch (error) {
      console.error(`Error during announcement ${type}:`, error);
      toast.error("An error occurred. Please try again.");
      setError("root", { message: "Something went wrong!" });
    }
  });

  const { classes = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Announcement" : type === "update" ? "Update the Announcement" : "Delete the Announcement"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {type !== "delete" && (
          <>
            <InputField
              label="Announcement Title"
              name="title"
              register={register}
              error={errors.title}
            />
            <InputField
              label="Description"
              name="description"
              register={register}
              error={errors.description}
            />
            <InputField
              label="Date"
              name="date"
              type="datetime-local"
              register={register}
              error={errors.date}
            />
            <div className="flex flex-col gap-2 w-full md:w-1/4">
              <label className="text-xs text-gray-500">Select Class (Optional)</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("classId")}
              >
                <option value="">Select a class</option>
                {classes && classes.length > 0 ? (
                  classes.map((classItem: { id: number; name: string }) => (
                    <option value={classItem.id} key={classItem.id}>
                      {classItem.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No classes available</option>
                )}
              </select>
              {errors.classId && (
                <p className="text-xs text-red-400">{errors.classId.message}</p>
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

export default AnnouncementForm;
