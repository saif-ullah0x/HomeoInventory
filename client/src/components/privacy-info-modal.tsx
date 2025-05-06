import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Lock, AlertCircle } from "lucide-react";

interface PrivacyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyInfoModal({ isOpen, onClose }: PrivacyInfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy & Data Security Information
          </DialogTitle>
          <DialogDescription>
            Important information about how your data is stored and protected in this application.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-3 rounded-md border">
            <Lock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Local First Storage</h3>
              <p className="text-sm text-muted-foreground">
                Most of your data is stored locally on your device by default. This means your medicine inventory information stays on your device and is not automatically shared with anyone else.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-md border">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Personal Information in Free Replit Apps</h3>
              <p className="text-sm text-muted-foreground">
                If you input personal information (phone numbers, addresses, email) into this application, please note:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 list-disc pl-5 space-y-1">
                <li>On free Replit apps, your code and data can be remixed (copied) by others</li>
                <li>Any sensitive personal details you add could potentially be viewed by others</li>
                <li>We recommend replacing actual phone numbers with placeholders (like 03XX-XXXXXXX)</li>
                <li>Use generic email addresses instead of personal ones for donation contact info</li>
              </ul>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-md border">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Secure Your Personal Details</h3>
              <p className="text-sm text-muted-foreground">
                For maximum privacy protection:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 list-disc pl-5 space-y-1">
                <li>Do not store real phone numbers or personal details in this app</li>
                <li>If using cloud sync/login, make sure to use a strong password</li>
                <li>Keep your device secure with a passcode/password</li>
                <li>Consider running the app locally on your own computer for maximum privacy</li>
              </ul>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}