"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function FineManagement() {
  const [fineAmount, setFineAmount] = useState<number>(1.0);
  const [editableAmount, setEditableAmount] = useState<number>(1.0);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load current fine amount on component mount
  useEffect(() => {
    const loadFineAmount = async () => {
      try {
        const response = await fetch("/api/admin/fine-config");
        const result = await response.json();
        if (result.success) {
          setFineAmount(result.fineAmount);
          setEditableAmount(result.fineAmount);
        }
      } catch (error) {
        console.error("Failed to load fine amount:", error);
        toast({
          title: "Error",
          description: "Failed to load fine amount",
          variant: "destructive",
        });
      }
    };

    loadFineAmount();
  }, [toast]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableAmount(fineAmount);
  };

  const handleSaveAmount = async () => {
    if (isNaN(editableAmount) || editableAmount < 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid fine amount",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // First, save the new fine amount
      const configResponse = await fetch("/api/admin/fine-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fineAmount: editableAmount,
          updatedBy: "admin",
        }),
      });

      const configResult = await configResponse.json();
      if (!configResult.success) {
        toast({
          title: "Error",
          description: configResult.error || "Failed to update fine amount",
          variant: "destructive",
        });
        return;
      }

      // Then, update overdue fines with the new amount
      const finesResponse = await fetch("/api/admin/update-overdue-fines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fineAmount: editableAmount,
        }),
      });

      const finesResult = await finesResponse.json();
      if (finesResult.success) {
        setFineAmount(editableAmount);
        setIsEditing(false);
        toast({
          title: "Success",
          description: `Fine amount updated to $${editableAmount} per day and applied to ${finesResult.results.length} overdue books`,
        });
        // Reload the page to show updated information
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: finesResult.error || "Failed to update overdue fines",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update fine amount:", error);
      toast({
        title: "Error",
        description: "Failed to update fine amount",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditMode = () => {
    setIsEditing(true);
    setEditableAmount(fineAmount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="font-medium text-gray-900">Fine Management</h6>
          <p className="text-sm text-gray-600">
            Update fines for overdue books
          </p>
        </div>
      </div>

      {/* Dynamic Fine Amount Configuration */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-blue-900">
              Daily Fine Amount
            </label>
            <p className="mb-2 text-xs text-blue-600">
              Set the amount charged per day for overdue books
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">$</span>
              {isEditing ? (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={editableAmount}
                  onChange={(e) =>
                    setEditableAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-20 rounded border border-blue-200 px-2 py-1 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="1.00"
                  autoFocus
                />
              ) : (
                <span className=" w-20 rounded bg-blue-100 px-2 py-1 text-sm font-medium text-white">
                  {fineAmount.toFixed(2)}
                </span>
              )}
              <span className="text-sm text-blue-700">per day</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveAmount}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200"
                >
                  {loading ? "Saving..." : "Save Fine"}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEditMode}
                disabled={loading}
                variant="outline"
                size="sm"
                className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
              >
                {loading ? "Updating..." : "Update Fines"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
