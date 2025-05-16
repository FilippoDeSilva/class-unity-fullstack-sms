import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: "admin" | "teacher" | "student";
}) => {
  // Map the type to the correct Prisma model
  const modelMap = {
    admin: prisma.admin,
    teacher: prisma.teacher,
    student: prisma.student,
  };

  // Ensure we correctly type each model type from Prisma
  type ModelType = {
    count: (args?: any) => Promise<number>;
  };

  // Explicitly type cast the model to the correct ModelType
  const model = modelMap[type] as ModelType | undefined;

  if (!model) {
    console.error(`No model found for type: ${type}`);
    return (
      <div className="rounded-2xl p-4 flex-1 min-w-[130px]">
        <h1 className="text-2xl font-semibold my-4">Error: Model not found</h1>
      </div>
    );
  }

  try {
    // Call the count method and ensure the type matches
    const data = await model.count({}); // Empty object for count args

    return (
      <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
        <div className="flex justify-between items-center">
          <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
            2024/25
          </span>
          <Image src="/more.png" alt="" width={20} height={20} />
        </div>
        <h1 className="text-2xl font-semibold my-4">{data}</h1>
        <h2 className="capitalize text-sm font-medium text-gray-500">{type}s</h2>
      </div>
    );
  } catch (error) {
    console.error('Error fetching count:', error);
    return (
      <div className="rounded-2xl p-4 flex-1 min-w-[130px]">
        <h1 className="text-2xl font-semibold my-4">Error fetching data</h1>
      </div>
    );
  }
};

export default UserCard;
