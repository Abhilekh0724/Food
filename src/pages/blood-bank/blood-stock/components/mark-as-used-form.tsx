import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSelector } from "@/store/store";
import { cx } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { useState } from "react";


interface ReceiverInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  district: string;
  occupation: string;
  country: string;
  municipality: string;
  city: string;
  streetAddress: string;
  zipCode: string;
  wardNo: string;
  usedPurpose: string;
}

export const MarkAsUsedForm = ({
  onConfirm,
  onCancel,
  pouchId
}: {
  onConfirm: (receiverInfo: ReceiverInfo) => void;
  onCancel: () => void;
  pouchId: string;
}) => {
  const [receiverInfo, setReceiverInfo] = useState<ReceiverInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    district: '',
    occupation: '',
    country: '',
    municipality: '',
    city: '',
    streetAddress: '',
    zipCode: '',
    wardNo: '',
    usedPurpose: ''
  });



  const loading = useSelector(state => state.bloodPouch.isLoading)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReceiverInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Mark Pouch {pouchId} as Used</DialogTitle>
        <DialogDescription>
          Please enter receiver information
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name*</Label>
          <Input
            id="firstName"
            name="firstName"
            value={receiverInfo.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name*</Label>
          <Input
            id="lastName"
            name="lastName"
            value={receiverInfo.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={receiverInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone*</Label>
          <Input
            id="phone"
            name="phone"
            value={receiverInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="district">District*</Label>
          <Input
            id="district"
            name="district"
            value={receiverInfo.district}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            name="occupation"
            value={receiverInfo.occupation}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country*</Label>
          <Input
            id="country"
            name="country"
            value={receiverInfo.country}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="municipality">Municipality*</Label>
          <Input
            id="municipality"
            name="municipality"
            value={receiverInfo.municipality}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            name="city"
            value={receiverInfo.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="streetAddress">Street Address*</Label>
          <Input
            id="streetAddress"
            name="streetAddress"
            value={receiverInfo.streetAddress}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zipCode">Zip Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={receiverInfo.zipCode}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wardNo">Ward No</Label>
          <Input
            id="wardNo"
            name="wardNo"
            value={receiverInfo.wardNo}
            onChange={handleChange}
          />
        </div>


      </div>

      <div className="space-y-2">
        <Label htmlFor="usedPurpose">Used Purpose</Label>
        <Textarea
          id="usedPurpose"
          name="usedPurpose"
          value={receiverInfo.usedPurpose}
          onChange={handleChange}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={() => onConfirm(receiverInfo)}
          disabled={loading || !receiverInfo.firstName || !receiverInfo.lastName || !receiverInfo.phone || !receiverInfo.usedPurpose}
        >
          {loading ? <Loader2 className="animate-spin" /> : 'Confirm Usage'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
