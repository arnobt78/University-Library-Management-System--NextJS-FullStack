"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import config from "@/lib/config";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Eye,
  Shield,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  universityId: number;
  universityCard: string;
  createdAt: Date | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  role: "USER" | "ADMIN" | null;
  password: string;
  lastActivityDate: string | null;
}

interface AccountRequestsClientProps {
  users: User[];
  searchParams: { success?: string; error?: string };
  approveAction: (userId: string) => Promise<void>;
  rejectAction: (userId: string) => Promise<void>;
}

const AccountRequestsClient = ({
  users,
  searchParams,
  approveAction,
  rejectAction,
}: AccountRequestsClientProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Account Requests
              </h1>
              <p className="mt-2 text-gray-600">
                Review and approve pending user registrations
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-orange-100 px-3 py-1">
                <span className="text-sm font-medium text-orange-800">
                  {users.length} Pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {searchParams.success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center">
              <CheckCircle className="size-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  {searchParams.success === "account-approved" &&
                    "✅ Account Approved Successfully!"}
                  {searchParams.success === "account-rejected" &&
                    "✅ Account Rejected Successfully!"}
                </h3>
              </div>
            </div>
          </div>
        )}

        {searchParams.error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <XCircle className="size-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  ❌ Operation Failed
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Requests Grid */}
        {users.length === 0 ? (
          <Card className="text-center">
            <CardContent className="py-12">
              <div className="mx-auto mb-4 flex size-24 items-center justify-center rounded-full bg-gray-100">
                <User className="size-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No Pending Requests
              </h3>
              <p className="text-gray-500">
                All account requests have been processed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <AccountRequestCard
                key={user.id}
                user={user}
                approveAction={approveAction}
                rejectAction={rejectAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Account Request Card Component
const AccountRequestCard = ({
  user,
  approveAction,
  rejectAction,
}: {
  user: User;
  approveAction: (userId: string) => Promise<void>;
  rejectAction: (userId: string) => Promise<void>;
}) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getImageUrl = (universityCard: string) => {
    return universityCard.startsWith("http")
      ? universityCard
      : `${config.env.imagekit.urlEndpoint}/${universityCard}`;
  };

  return (
    <Card className="group border-0 shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-start">
          <div className="flex flex-1 items-center space-x-3">
            <Avatar className="size-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.fullName}
                </h3>
                <Badge
                  variant="pending"
                  className="ml-2 flex items-center space-x-1"
                >
                  <Clock className="size-3" />
                  <span>PENDING</span>
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Mail className="size-3" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* University ID */}
        <div className="flex items-center space-x-2 text-sm">
          <GraduationCap className="size-4 text-blue-500" />
          <span className="text-gray-600">University ID:</span>
          <span className="font-medium text-gray-900">{user.universityId}</span>
        </div>

        {/* Join Date */}
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="size-4 text-green-500" />
          <span className="text-gray-600">Joined:</span>
          <span className="font-medium text-gray-900">
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        {/* University Card */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="size-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">
              University Card
            </span>
          </div>
          {user.universityCard ? (
            <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
              <DialogTrigger asChild>
                <div className="group relative cursor-pointer">
                  <img
                    src={getImageUrl(user.universityCard)}
                    alt="University Card"
                    className="h-32 w-full rounded-lg border border-gray-200 object-cover transition-colors hover:border-blue-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-20">
                    <div className="rounded-full bg-white bg-opacity-90 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Eye className="size-4 text-gray-700" />
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>University Card - {user.fullName}</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <img
                    src={getImageUrl(user.universityCard)}
                    alt="University Card"
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <div className="flex h-32 w-full items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
              <div className="text-center">
                <Shield className="mx-auto mb-2 size-8 text-gray-400" />
                <p className="text-sm text-gray-500">No card uploaded</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <form action={() => approveAction(user.id)} className="flex-1">
            <Button className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700">
              <CheckCircle className="mr-2 size-4" />
              Approve
            </Button>
          </form>

          <form action={() => rejectAction(user.id)} className="flex-1">
            <Button
              variant="destructive"
              className="w-full rounded-lg px-4 py-2 font-medium transition-colors"
            >
              <XCircle className="mr-2 size-4" />
              Reject
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountRequestsClient;
