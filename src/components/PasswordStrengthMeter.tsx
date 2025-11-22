import { useMemo } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  gradient: string;
  requirements: {
    minLength: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strength = useMemo((): StrengthResult => {
    const requirements = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    const metCount = Object.values(requirements).filter(Boolean).length;

    let score = 0;
    let label = 'Too weak';
    let color = 'text-red-600';
    let gradient = 'from-red-500 to-red-600';

    if (metCount >= 5) {
      score = 100;
      label = 'Very strong';
      color = 'text-green-600';
      gradient = 'from-green-500 via-emerald-500 to-green-600';
    } else if (metCount >= 4) {
      score = 80;
      label = 'Strong';
      color = 'text-green-600';
      gradient = 'from-green-500 to-green-600';
    } else if (metCount >= 3) {
      score = 60;
      label = 'Good';
      color = 'text-yellow-600';
      gradient = 'from-yellow-500 to-amber-600';
    } else if (metCount >= 2) {
      score = 40;
      label = 'Fair';
      color = 'text-orange-600';
      gradient = 'from-orange-500 to-orange-600';
    } else if (password.length > 0) {
      score = 20;
      label = 'Weak';
      color = 'text-red-600';
      gradient = 'from-red-500 to-red-600';
    }

    return { score, label, color, gradient, requirements };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-oak-700">Password strength</span>
        <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
      </div>

      <div className="relative h-2 bg-oak-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${strength.gradient} rounded-full transition-all duration-500 ease-out shadow-sm`}
          style={{ width: `${strength.score}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        <RequirementItem
          met={strength.requirements.minLength}
          text="At least 8 characters"
        />
        <RequirementItem
          met={strength.requirements.hasUpperCase}
          text="One uppercase letter"
        />
        <RequirementItem
          met={strength.requirements.hasLowerCase}
          text="One lowercase letter"
        />
        <RequirementItem
          met={strength.requirements.hasNumber}
          text="One number"
        />
        <RequirementItem
          met={strength.requirements.hasSpecial}
          text="One special character"
        />
      </div>
    </div>
  );
}

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${
      met ? 'text-green-700' : 'text-oak-500'
    }`}>
      <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${
        met
          ? 'bg-green-500 text-white scale-100'
          : 'bg-oak-200 text-oak-400 scale-90'
      }`}>
        {met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </div>
      <span className={`transition-all duration-300 ${met ? 'font-medium' : 'font-normal'}`}>
        {text}
      </span>
    </div>
  );
}
