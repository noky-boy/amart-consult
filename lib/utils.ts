export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  return inputs.flat().filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Planning":
      return "bg-yellow-100 text-yellow-800";
    case "In Progress":
      return "bg-blue-100 text-blue-800";
    case "Review":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "On Hold":
      return "bg-orange-100 text-orange-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
