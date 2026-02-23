export const statusColors = {
  completed: "bg-green-500",
  active: "bg-blue-500",
  upcoming: "bg-amber-500",
  "in-development": "bg-purple-500",
};

export const getStatusColor = (status: string) => {
  return statusColors[status as keyof typeof statusColors] || "bg-gray-500";
};
