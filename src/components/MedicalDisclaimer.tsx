import { AlertTriangle } from "lucide-react";

const MedicalDisclaimer = () => (
  <div className="rounded-xl border border-border bg-accent/30 p-5 md:p-6">
    <div className="flex items-start gap-3">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-primary" />
      <div>
        <p className="text-sm font-semibold text-foreground">Medical Disclaimer</p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          This article is authored by a qualified pain management specialist (FIPM, FIAPM) for educational purposes only.
          It does not constitute medical advice. Please consult your doctor before starting any treatment.
        </p>
      </div>
    </div>
  </div>
);

export default MedicalDisclaimer;
