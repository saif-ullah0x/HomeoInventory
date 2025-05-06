import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, useAuth, logOut, checkRedirectResult } from "@/lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check for auth redirect result when component mounts
  useEffect(() => {
    async function checkAuthRedirect() {
      try {
        setLoading(true);
        const redirectUser = await checkRedirectResult();
        if (redirectUser) {
          // User has been redirected back after successful login
          toast({
            title: "Successfully logged in",
            description: "Your account has been connected.",
          });
          onClose();
        }
      } catch (error) {
        console.error("Redirect result error:", error);
        toast({
          title: "Login failed",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    checkAuthRedirect();
  }, [onClose, toast]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      // This will redirect the user to Google's authentication page
      // When they return, the useEffect above will handle the result
      await signInWithGoogle();
      // No need for toast or further processing here as the page will redirect
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "There was a problem logging in. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
    // No finally block needed as the page will redirect and reload
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await logOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      onClose();
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Account" : "Login to your account"}</DialogTitle>
          <DialogDescription>
            {user
              ? "You are currently logged in. Your data will be synced across devices."
              : "Login to enable cloud sync and share your inventory with others."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {!user ? (
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full p-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FcGoogle className="h-5 w-5" />
              )}
              Sign in with Google
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <p className="font-medium">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleSignOut}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign out
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}