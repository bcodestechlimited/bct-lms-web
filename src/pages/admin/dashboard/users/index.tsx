import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/interfaces/user.interface";
import { userService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import AssignCourseModal from "./modals/assign-course-modal";
import ConfirmActionModal from "./modals/confirmation-action-modal";
import { useSearchParams } from "react-router";

export default function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "activate" | "deactivate" | null
  >(null);

  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => userService.getAllUsers({ page, limit }),
  });

  const users = data?.users || [];
  const meta = data?.meta || {
    currentPage: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    pageSize: 10,
    total: 0,
  };

  const handleAssignCourse = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleConfirmAction = (user: User, type: "activate" | "deactivate") => {
    console.log(type);
    setSelectedUser(user);
    setActionType(type);
    setIsConfirmModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const closeConfirmationModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedUser(null);
  };

  const handleChangeActionType = (type: "activate" | "deactivate") => {
    setActionType(type);
  };

  const columns = [
    {
      header: "Firstname",
      render: (row: User) => row.firstName || "N/A",
    },
    {
      header: "Lastname",
      render: (row: User) => row.lastName || "N/A",
    },
    {
      header: "Email",
      render: (row: User) => row.email || "N/A",
    },
    {
      header: "Status",
      render: (row: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Role",
      render: (row: User) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.role === "admin" ? "Admin" : "User"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-2 text-gray-600 hover:bg-gray-200 rounded-full outline-none"
              aria-label="Open actions"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className=" cursor-pointer hover:bg-gray-100"
              onClick={() => handleAssignCourse(row)}
            >
              Assign Course
            </DropdownMenuItem>
            <DropdownMenuItem
              className=" text-red-500 cursor-pointer hover:bg-gray-100"
              onClick={() =>
                handleConfirmAction(
                  row,
                  row.isActive ? "deactivate" : "activate"
                )
              }
            >
              {row.isActive ? "Deactivate" : "Activate"} User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={users || []}
        isLoading={isLoading}
        noDataMessage="No users found."
        pagination={meta}
      />
      <AssignCourseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
      />

      <ConfirmActionModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmationModal}
        user={selectedUser}
        actionType={actionType}
        changeActionType={handleChangeActionType}
      />
    </div>
  );
}
