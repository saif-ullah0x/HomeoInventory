import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, CreditCard, Copy, Check, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      
      toast({
        title: "Copied to clipboard",
        description: `${type} details have been copied to your clipboard.`,
      });
      
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Support Our Work
          </DialogTitle>
          <DialogDescription>
            Your donations help us maintain and improve this free app. Thank you for your support!
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="easypaisa" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="easypaisa" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Easypaisa
            </TabsTrigger>
            <TabsTrigger value="sadapay" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              SadaPay
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="easypaisa" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="easypaisa-number">Easypaisa Account</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="easypaisa-number"
                  value="03XX-XXXXXXX"
                  readOnly
                  className="font-medium"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy("03XX-XXXXXXX", "Easypaisa")}
                >
                  {copied === "Easypaisa" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Account Name: <span className="font-medium">Homeopathic Inventory App</span>
              </p>
            </div>
            
            <div className="rounded-md bg-muted p-4 text-sm">
              <h4 className="font-medium">How to donate via Easypaisa:</h4>
              <ol className="list-decimal pl-4 mt-2 space-y-1">
                <li>Open your Easypaisa app</li>
                <li>Select "Send Money"</li>
                <li>Enter the phone number shown above</li>
                <li>Enter the amount you wish to donate</li>
                <li>Complete the transaction</li>
              </ol>
            </div>
          </TabsContent>
          
          <TabsContent value="sadapay" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="sadapay-number">SadaPay Account</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="sadapay-number"
                  value="03XX-XXXXXXX"
                  readOnly
                  className="font-medium"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy("03XX-XXXXXXX", "SadaPay")}
                >
                  {copied === "SadaPay" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Account Name: <span className="font-medium">Homeopathic Inventory App</span>
              </p>
            </div>
            
            <div className="rounded-md bg-muted p-4 text-sm">
              <h4 className="font-medium">How to donate via SadaPay:</h4>
              <ol className="list-decimal pl-4 mt-2 space-y-1">
                <li>Open your SadaPay app</li>
                <li>Select "Send" or "Transfer"</li>
                <li>Enter the phone number shown above</li>
                <li>Enter the amount you wish to donate</li>
                <li>Complete the transaction</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          For larger donations or other payment methods, please contact us at
          <a href="mailto:support@example.com" className="text-primary font-medium ml-1">
            support@example.com
          </a>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            Thank You
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}