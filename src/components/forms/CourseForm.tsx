// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import InputField from "../InputField";
// import { courseSchema, CourseSchema } from "@/lib/formValidationSchemas";
// import { createCourse, updateCourse } from "@/lib/actions";
// import { useFormState } from "react-dom";
// import { Dispatch, SetStateAction, useEffect } from "react";
// import { toast } from "react-toastify";
// import { useRouter } from "next/navigation";
// import { Viewport } from "next";
// export const metadata = {
//   title: "Class-Unity | Course Form"
// }

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
// }

// const CourseForm = ({
//   type,
//   data,
//   setOpen,
//   relatedData,
// }: {
//   type: "create" | "update";
//   data?: any;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   relatedData?: any;
// }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<CourseSchema>({
//     resolver: zodResolver(courseSchema),
//   });

//   // AFTER REACT 19 IT'LL BE USEACTIONSTATE

//   const [state, formAction] = useFormState(
//     type === "create" ? createCourse : updateCourse,
//     {
//       success: false,
//       error: false,
//     }
//   );

//   const router = useRouter();

//   const onSubmit = handleSubmit(async (data) => {
//     try {
//       await formAction(data);
//       setOpen(false);
//       toast.success(`Course ${type === "create" ? "created" : "updated"} successfully!`);
//       router.refresh();
//     } catch (error) {
//       toast.error("Something went wrong!");
//       console.error("Form submission error:", error);
//     }
//   });

//   useEffect(() => {
//     if (state.error) {
//       toast.error("Something went wrong!");
//     }
//   }, [state.error]);

//   const { teachers } = relatedData;

//   return (
//     <form className="flex flex-col gap-8" onSubmit={onSubmit}>
//       <h1 className="text-xl font-semibold">
//         {type === "create" ? "Create a new course" : "Update the course"}
//       </h1>

//       <div className="flex justify-between flex-wrap gap-4">
//         <InputField
//           label="Course name"
//           name="name"
//           defaultValue={data?.name}
//           register={register}
//           error={errors?.name}
//         />
//         {data && (
//           <InputField
//             label="Id"
//             name="id"
//             defaultValue={data?.id}
//             register={register}
//             error={errors?.id}
//             hidden
//           />
//         )}
//         <div className="flex flex-col gap-2 w-full md:w-1/2">
//           <label className="text-xs text-gray-500">Teachers</label>
//           <select
//             multiple
//             className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
//             {...register("teachers")}
//             defaultValue={data?.teachers}
//             size={6}
//           >
//             {teachers.map(
//               (teacher: { id: string; name: string; surname: string }) => (
//                 <option 
//                   value={teacher.id} 
//                   key={teacher.id}
//                   className="p-1.5 hover:bg-gray-100 cursor-pointer"
//                 >
//                   {teacher.name + " " + teacher.surname}
//                 </option>
//               )
//             )}
//           </select>
//           {errors.teachers?.message && (
//             <p className="text-xs text-red-400">
//               {errors.teachers.message.toString()}
//             </p>
//           )}
//           <p className="text-xs text-gray-400 mt-1">
//             Hold Ctrl (Windows) or Command (Mac) to select multiple teachers
//           </p>
//         </div>
//       </div>
//       {state.error && (
//         <span className="text-red-500">Something went wrong!</span>
//       )}
//       <button 
//         type="submit"
//         className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition-colors"
//         disabled={state.success}
//       >
//         {state.success ? "Processing..." : type === "create" ? "Create" : "Update"}
//       </button>
//     </form>
//   );
// };

// export default CourseForm;


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { courseSchema, CourseSchema } from "@/lib/formValidationSchemas";
import { createCourse, updateCourse } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Viewport } from "next";

export const metadata = {
  title: "Class-Unity | Course Form",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const CourseForm = ({
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
  } = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
  const [state, formAction] = useFormState(
    type === "create" ? createCourse : updateCourse,
    {
      success: false,
      error: false,
    }
  );

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await formAction(data);
      setOpen(false);
      toast.success(
        `Course ${type === "create" ? "created" : "updated"} successfully!`
      );
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Form submission error:", error);
    }
  });

  useEffect(() => {
    if (state.error) {
      toast.error("Something went wrong!");
    }
  }, [state.error]);

  const { teachers } = relatedData;

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new course" : "Update the course"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Course name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
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

        {/* Credit Hour Input */}
        <InputField
          label="Credit Hour"
          name="creditHour"
          // type="number"
          defaultValue={data?.creditHour || 0}
          register={register}
          error={errors?.creditHour}
        />

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-3 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers}
            size={6}
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                  className="p-1.5 hover:bg-gray-100 cursor-pointer"
                >
                  {teacher.name + " " + teacher.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-xs text-red-400">
              {errors.teachers.message.toString()}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Hold Ctrl (Windows) or Command (Mac) to select multiple teachers
          </p>
        </div>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button
        type="submit"
        className="bg-blue-400 text-white p-2 rounded-md hover:bg-blue-500 transition-colors"
        disabled={state.success}
      >
        {state.success
          ? "Processing..."
          : type === "create"
          ? "Create"
          : "Update"}
      </button>
    </form>
  );
};

export default CourseForm;
