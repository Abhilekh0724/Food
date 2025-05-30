import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import AddAddressInfo from "./address";
import AddBasicProfile from "./basics";

const steps = [
  { id: "1", name: "Basic Info" },
  { id: "2", name: "Address Info" },
];

const AddAdminPage = ({ isEdit = false }: { isEdit?: boolean }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, index) => (
            <li key={step.id} className="relative flex-1">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={`absolute top-4 left-[-50%] right-[50%] h-0.5 ${
                    index <= currentStep ? "bg-primary" : "bg-muted"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 z-30 rounded-full flex items-center justify-center ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? <CheckIcon /> : <span>{step.id}</span>}
                </div>
                <span
                  className={`mt-2 text-sm ${
                    index === currentStep
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
      {/* Navigation Controls */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          Previous
        </Button>

        <Button onClick={handleNext}>
          {currentStep === steps.length - 1 ? "Completed" : "Next"}
        </Button>
      </div>

      {/* Form Content */}
      <div className="">
        {currentStep === 0 && <AddBasicProfile isEdit={isEdit} />}
        {currentStep === 1 && <AddAddressInfo isEdit={isEdit} />}
      </div>
    </div>
  );
};

// Simple check icon component

export default AddAdminPage;
