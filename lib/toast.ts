import { toast } from "@/hooks/use-toast";

export const showToast = {
  success: (title: string, description: string) => {
    toast({
      title: `✅ ${title}`,
      description,
    });
  },

  error: (title: string, description: string) => {
    toast({
      title: `❌ ${title}`,
      description,
      variant: "destructive",
    });
  },

  warning: (title: string, description: string) => {
    toast({
      title: `⚠️ ${title}`,
      description,
      variant: "destructive",
    });
  },

  info: (title: string, description: string) => {
    toast({
      title: `ℹ️ ${title}`,
      description,
    });
  },

  // Specific action toasts
  auth: {
    signInSuccess: () => {
      toast({
        title: "🎉 Welcome Back!",
        description: "You have successfully signed in to BookWise.",
      });
    },
    signUpSuccess: () => {
      toast({
        title: "🎉 Account Created!",
        description:
          "Welcome to BookWise! Your account has been created successfully.",
      });
    },
    logoutSuccess: () => {
      toast({
        title: "👋 Logged Out",
        description:
          "You have been logged out successfully. Thank you for using BookWise!",
      });
    },
  },

  book: {
    borrowSuccess: (bookTitle: string) => {
      toast({
        title: "📚 Book Borrowed!",
        description: `"${bookTitle}" has been added to your borrowed collection. Enjoy reading!`,
      });
    },
    createSuccess: (bookTitle: string) => {
      toast({
        title: "📖 Book Created!",
        description: `"${bookTitle}" has been added to the library collection.`,
      });
    },
    borrowError: (message: string) => {
      toast({
        title: "❌ Cannot Borrow Book",
        description: message,
        variant: "destructive",
      });
    },
  },

  file: {
    uploadSuccess: (type: "image" | "video", fileName: string) => {
      toast({
        title: `✅ ${type === "image" ? "Image" : "Video"} Uploaded!`,
        description: `${fileName} has been uploaded successfully and is ready to use.`,
      });
    },
    uploadError: (message: string) => {
      toast({
        title: "📁 Upload Failed",
        description: message,
        variant: "destructive",
      });
    },
    fileTooLarge: (type: "image" | "video", maxSize: string) => {
      toast({
        title: "📁 File Too Large",
        description: `${type === "image" ? "Image" : "Video"} files must be smaller than ${maxSize}. Please compress your file and try again.`,
        variant: "destructive",
      });
    },
  },
};
