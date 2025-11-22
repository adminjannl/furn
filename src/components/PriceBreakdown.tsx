import { Info, CheckCircle, Award } from 'lucide-react';
import { useState } from 'react';

interface PriceBreakdownProps {
  productPrice: number;
}

export default function PriceBreakdown({ productPrice }: PriceBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const breakdown = {
    materials: {
      percentage: 35,
      items: [
        { name: 'Premium FSC-certified European hardwood', detail: 'Sustainably sourced oak, walnut, or cherry' },
        { name: 'Natural oils and waxes finish', detail: 'Non-toxic, food-safe finishes' },
        { name: 'Premium hardware and fasteners', detail: 'Brass, stainless steel, European-made' },
      ]
    },
    labor: {
      percentage: 40,
      items: [
        { name: 'Master craftsman hours', detail: '25-40 hours per piece by certified artisans' },
        { name: 'Quality inspection', detail: '3-stage review process before shipping' },
        { name: 'Fair wages and benefits', detail: 'Above industry standard with full benefits' },
      ]
    },
    overhead: {
      percentage: 15,
      items: [
        { name: 'Workshop operations', detail: 'Modern facilities, tools, and equipment' },
        { name: 'Design and development', detail: 'R&D for new techniques and products' },
        { name: 'Sustainability programs', detail: 'Reforestation and carbon offset initiatives' },
      ]
    },
    warranty: {
      percentage: 10,
      items: [
        { name: '10-year comprehensive warranty', detail: 'Full coverage for defects and issues' },
        { name: 'Free repair service', detail: 'Lifetime support for maintenance needs' },
        { name: 'Customer satisfaction guarantee', detail: '30-day return policy' },
      ]
    }
  };

  const calculateAmount = (percentage: number) => {
    return (productPrice * percentage) / 100;
  };

  return (
    <div className="bg-gradient-to-br from-cream-50 to-cream-100 rounded-2xl p-6 md:p-8 border border-slate-200/40 shadow-elevation-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-oak-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-serif font-semibold text-oak-900">Why This Price?</h3>
            <p className="text-sm text-oak-600">See the value breakdown</p>
          </div>
        </div>
        <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6 text-oak-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-6 animate-fade-in-up">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center">
                  <span className="text-forest-700 font-bold text-sm">{breakdown.materials.percentage}%</span>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-oak-900">Premium Materials</h4>
                  <p className="text-sm text-oak-600">€{calculateAmount(breakdown.materials.percentage).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {breakdown.materials.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-oak-900 font-medium">{item.name}</span>
                    <p className="text-oak-600 text-xs">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-champagne-100 rounded-full flex items-center justify-center">
                  <span className="text-champagne-700 font-bold text-sm">{breakdown.labor.percentage}%</span>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-oak-900">Master Craftsmanship</h4>
                  <p className="text-sm text-oak-600">€{calculateAmount(breakdown.labor.percentage).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {breakdown.labor.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-champagne-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-oak-900 font-medium">{item.name}</span>
                    <p className="text-oak-600 text-xs">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-oak-100 rounded-full flex items-center justify-center">
                  <span className="text-oak-700 font-bold text-sm">{breakdown.overhead.percentage}%</span>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-oak-900">Operations & Innovation</h4>
                  <p className="text-sm text-oak-600">€{calculateAmount(breakdown.overhead.percentage).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {breakdown.overhead.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-oak-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-oak-900 font-medium">{item.name}</span>
                    <p className="text-oak-600 text-xs">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-champagne-100 rounded-full flex items-center justify-center">
                  <span className="text-champagne-700 font-bold text-sm">{breakdown.warranty.percentage}%</span>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-oak-900">Warranty & Support</h4>
                  <p className="text-sm text-oak-600">€{calculateAmount(breakdown.warranty.percentage).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {breakdown.warranty.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-champagne-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-oak-900 font-medium">{item.name}</span>
                    <p className="text-oak-600 text-xs">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-oak-800 to-oak-900 rounded-xl p-6 text-white">
            <div className="flex items-start gap-4 mb-4">
              <Award className="w-8 h-8 text-champagne-300 flex-shrink-0" />
              <div>
                <h4 className="font-serif font-semibold text-lg mb-2">Why Quality Costs More</h4>
                <p className="text-cream-200 text-sm leading-relaxed mb-4">
                  Fast furniture uses particle board, glue, and machine assembly taking hours.
                  Our pieces use solid hardwood, traditional joinery, and take 25-40 hours of skilled
                  craftsmanship. The result? Furniture that lasts 50+ years instead of 5.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs text-cream-300 mb-1">Mass-produced furniture</p>
                    <p className="text-2xl font-serif font-bold">5 years</p>
                    <p className="text-xs text-cream-300">Average lifespan</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-xs text-cream-300 mb-1">Harts furniture</p>
                    <p className="text-2xl font-serif font-bold">50+ years</p>
                    <p className="text-xs text-cream-300">Expected lifespan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-oak-700">
              <strong className="text-oak-900">Investment Value:</strong> When you calculate cost per year,
              our furniture (€{(productPrice / 50).toFixed(2)}/year) is actually more economical than
              mass-produced alternatives that need replacing every 5 years.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
