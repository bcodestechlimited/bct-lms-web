import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user.interface";
import { userService } from "@/services/user.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  actionType: "activate" | "deactivate" | null;
  changeActionType: (type: "activate" | "deactivate") => void;
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  user,
  actionType,
  changeActionType,
}: ConfirmActionModalProps) {
  const queryClient = useQueryClient();

  const activateMutation = useMutation({
    mutationFn: userService.activateUser,
    onSuccess: () => {
      toast.success("User activated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      changeActionType(actionType === "activate" ? "deactivate" : "activate");
    },
    onError: () => toast.error("Failed to activate user"),
  });

  const deactivateMutation = useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      toast.success("User deactivated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      changeActionType(actionType === "activate" ? "deactivate" : "activate");
    },
    onError: () => toast.error("Failed to deactivate user"),
  });

  const handleAction = async () => {
    if (!actionType || !user?._id) {
      return toast.error("Invalid action or user");
    }

    const mutation =
      actionType === "activate" ? activateMutation : deactivateMutation;
    const actionText =
      actionType === "activate" ? "Activating" : "Deactivating";

    toast.promise(mutation.mutateAsync({ userId: user._id }), {
      loading: `${actionText} user...`,
      success: (data) => data.message,
      error: (error) =>
        error instanceof AxiosError
          ? error.response?.data?.message || `Failed to ${actionType}`
          : `Failed to ${actionType}`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === "activate" ? "Activate User" : "Deactivate User"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to {actionType}{" "}
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant={actionType === "deactivate" ? "destructive" : "default"}
            onClick={handleAction}
            disabled={
              activateMutation.isPending ||
              deactivateMutation.isPending ||
              !user
            }
          >
            {actionType === "activate" ? "Activate" : "Deactivate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
