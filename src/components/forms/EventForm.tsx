"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { EventSchema } from "@/lib/formValidationSchemas";
import { createEvent, updateEvent, deleteEvent } from "@/lib/actions";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Viewport } from "next";
export const metadata = {
  title: "Class-Unity | Event Form"
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

// Update the EventSchema to use proper types
const EventSchemaWithTypes = EventSchema.extend({
  classId: z.union([z.coerce.number(), z.literal("")]).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

type EventFormData = z.infer<typeof EventSchemaWithTypes>;
type CurrentState = { success: boolean; error: boolean; message?: string };

const EventForm = ({
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
  } = useForm<EventFormData>({
    resolver: zodResolver(EventSchemaWithTypes),
    defaultValues: {
      id: data?.id || undefined,
      title: data?.title || "",
      description: data?.description || "",
      startTime: data?.startTime ? new Date(data.startTime) : undefined,
      endTime: data?.endTime ? new Date(data.endTime) : undefined,
      classId: data?.classId || "",
    },
  });

  const router = useRouter();
  const [currentState, setCurrentState] = useState<CurrentState>({ success: false, error: false });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      let result: CurrentState;
      const formDataToSend = new FormData();
      // Add all form data fields (skipping undefined/null values)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          if (value instanceof Date) {
            formDataToSend.append(key, value.toISOString());
          } else {
            formDataToSend.append(key, value.toString());
          }
        }
      });

      if (type === "create") {
        result = await createEvent(currentState, formDataToSend);
      } else if (type === "update") {
        formDataToSend.append('id', data.id.toString());
        result = await updateEvent(currentState, formDataToSend);
      } else if (type === "delete") {
        // For delete, ensure we're sending the event ID for deletion
        result = await deleteEvent(currentState, { id: data.id.toString() });
      } else {
        result = { success: false, error: true, message: "Invalid operation type" };
      }

      setCurrentState(result);

      // Handle success and failure notifications
      if (result.success) {
        const action = type === "create" ? "created" : type === "update" ? "updated" : "deleted";
        let toastType: "success" | "warning" | "error";
        if (type === "create") {
          toastType = "success";
        } else if (type === "update") {
          toastType = "warning";
        } else {
          toastType = "error";
        }
        toast(`Event ${action} successfully!`, { type: toastType });
        setOpen(false);
        router.refresh(); // Ensure the list refreshes after deletion
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error(`Error during event ${type}:`, error);
      toast.error("An error occurred. Please try again.");
      setError("root", { message: error instanceof Error ? error.message : "Something went wrong!" });
    }
  });

  const { classes = [] } = relatedData || {};

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a New Event" : type === "update" ? "Update the Event" : "Delete the Event"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        {type !== "delete" && (
          <>
            <InputField
              label="Event Title"
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
              <label className="text-xs text-gray-500">Select Class (Optional)</label>
              <select
                className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                {...register("classId")}
              >
                <option value="">Select a class</option>
                {classes && classes.length > 0 ? (
                  classes.map((cls: { id: number; name: string }) => (
                    <option value={cls.id} key={cls.id}>
                      {cls.name}
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

export default EventForm;
