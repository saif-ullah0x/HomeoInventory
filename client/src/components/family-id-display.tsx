/**
 * Family ID Display Component
 * Shows the family ID with copy functionality in a user-friendly format
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Check, Users, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FamilyIdDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
  memberName: string;
}

export default function FamilyIdDisplay({ isOpen, onClose, familyId, memberName }: FamilyIdDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyFamilyId = async () => {
    try {
      await navigator.clipboard.writeText(familyId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Family ID Copied!",
        description: "Share this ID with family members so they can join your inventory.",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = familyId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Family ID Copied!",
        description: "Share this ID with family members so they can join your inventory.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <Users className="h-5 w-5 text-green-600" />
            Family Created Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Your Family ID
              </CardTitle>
              <CardDescription className="text-green-700 dark:text-green-300">
                Share this code with family members to give them access to your shared medicine inventory.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                <code className="flex-1 text-lg font-mono font-bold text-center text-gray-900 dark:text-gray-100 tracking-wider">
                  {familyId}
                </code>
                <Button
                  onClick={copyFamilyId}
                  size="sm"
                  variant="outline"
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Share this Family ID with your family members</li>
              <li>• They can join using the "Join Family" option</li>
              <li>• All medicine changes sync automatically across devices</li>
              <li>• Everyone sees the same shared inventory in real-time</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={copyFamilyId}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {copied ? "Copied!" : "Copy Family ID"}
            </Button>
            <Button 
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}