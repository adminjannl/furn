import { useEffect, useState } from 'react';
import { Clock, Sparkles, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PROMOTION_END_KEY = 'promotion_end_time';
const PROMOTION_DURATION = 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 51 * 60 * 1000 + 43 * 1000;

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function PromotionBanner() {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 21, hours: 8, minutes: 51, seconds: 43 });

  useEffect(() => {
    let endTime = localStorage.getItem(PROMOTION_END_KEY);

    if (!endTime) {
      const newEndTime = Date.now() + PROMOTION_DURATION;
      localStorage.setItem(PROMOTION_END_KEY, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const endTimeNumber = parseInt(endTime, 10);

    const updateTimer = () => {
      const now = Date.now();
      const difference = endTimeNumber - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-oak-700 via-oak-800 to-slate-900 text-white py-6 shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-champagne-400/40 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-2">
              <Sparkles className="w-5 h-5 text-champagne-300/60" />
              <h3 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight">
                {t('promotion.title')}
              </h3>
              <Sparkles className="w-5 h-5 text-champagne-300/60" />
            </div>
            <p className="text-base md:text-lg font-medium text-cream-100 tracking-wide mb-4">
              {t('promotion.subtitle')}
            </p>
            <Link
              to="/products?discount=true"
              className="inline-flex items-center gap-2.5 bg-champagne-500 hover:bg-champagne-600 text-oak-900 font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Tag className="w-5 h-5" />
              <span>{t('promotion.shopNow')}</span>
            </Link>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 backdrop-blur-sm px-4 py-3 border border-white/10">
            <Clock className="w-5 h-5 text-champagne-300/70" />
            <div className="flex items-center gap-2.5">
              <TimeUnit value={timeLeft.days} label={t('promotion.days')} />
              <Separator />
              <TimeUnit value={timeLeft.hours} label={t('promotion.hours')} />
              <Separator />
              <TimeUnit value={timeLeft.minutes} label={t('promotion.mins')} />
              <Separator />
              <TimeUnit value={timeLeft.seconds} label={t('promotion.secs')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2.5 min-w-[64px] border border-white/15">
      <span className="text-2xl font-bold tabular-nums text-white">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs font-medium text-cream-200 tracking-wide">{label}</span>
    </div>
  );
}

function Separator() {
  return <span className="text-2xl font-semibold text-champagne-300/60">:</span>;
}
