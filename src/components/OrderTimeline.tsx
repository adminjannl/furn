import { Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Database } from '../lib/database.types';

type OrderStatus = Database['public']['Tables']['orders']['Row']['status'];

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  statusHistory?: Array<{
    status: string;
    created_at: string;
    notes?: string | null;
  }>;
  estimatedDeliveryDate?: string | null;
  actualDeliveryDate?: string | null;
}

interface TimelineStage {
  id: OrderStatus;
  label: string;
  icon: typeof Package;
  description: string;
}

const timelineStages: TimelineStage[] = [
  {
    id: 'pending',
    label: 'Order Placed',
    icon: Package,
    description: 'Your order has been received and is awaiting processing'
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: Package,
    description: 'We are preparing your items for shipment'
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: Truck,
    description: 'Your order is on its way'
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: CheckCircle,
    description: 'Your order has been delivered'
  }
];

function getStatusIndex(status: OrderStatus): number {
  if (status === 'cancelled') return -1;
  return timelineStages.findIndex(stage => stage.id === status);
}

export default function OrderTimeline({
  currentStatus,
  statusHistory = [],
  estimatedDeliveryDate,
  actualDeliveryDate
}: OrderTimelineProps) {
  const currentIndex = getStatusIndex(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-8 border-2 border-red-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-serif font-bold text-red-900">Order Cancelled</h3>
            <p className="text-red-700">This order has been cancelled</p>
          </div>
        </div>
        {statusHistory.length > 0 && (
          <div className="mt-6 pt-6 border-t border-red-200">
            <p className="text-sm text-red-800">
              Cancelled on: {new Date(statusHistory[statusHistory.length - 1].created_at).toLocaleDateString('en-NL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl p-8 border border-slate-200/50 shadow-sm">
      <h3 className="text-2xl font-serif font-bold text-oak-900 mb-2">Order Status</h3>
      {estimatedDeliveryDate && !actualDeliveryDate && (
        <div className="flex items-center gap-2 text-oak-700 mb-8">
          <Clock className="w-4 h-4" />
          <p className="text-sm">
            Estimated delivery: {new Date(estimatedDeliveryDate + 'T00:00:00').toLocaleDateString('en-NL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      {actualDeliveryDate && (
        <div className="flex items-center gap-2 text-green-700 mb-8 bg-green-50 px-4 py-2 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <p className="text-sm font-medium">
            Delivered on: {new Date(actualDeliveryDate).toLocaleDateString('en-NL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      )}

      <div className="relative">
        {timelineStages.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const Icon = stage.icon;

          const historyEntry = statusHistory.find(h => h.status === stage.id);

          return (
            <div key={stage.id} className="relative pb-12 last:pb-0">
              {index < timelineStages.length - 1 && (
                <div
                  className={`absolute left-8 top-16 bottom-0 w-1 transition-all duration-500 ${
                    isCompleted
                      ? 'bg-gradient-to-b from-forest-600 to-forest-700'
                      : isPending
                      ? 'bg-slate-200'
                      : 'bg-gradient-to-b from-forest-600 to-slate-200'
                  }`}
                />
              )}

              <div className="relative flex items-start gap-6">
                <div
                  className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-forest-600 to-forest-700 shadow-lg scale-110'
                      : isCurrent
                      ? 'bg-gradient-to-br from-champagne-500 to-champagne-600 shadow-xl scale-125 animate-gentle-pulse'
                      : 'bg-slate-200'
                  }`}
                >
                  <Icon
                    className={`transition-all duration-500 ${
                      isCompleted || isCurrent ? 'w-8 h-8 text-white' : 'w-6 h-6 text-slate-500'
                    }`}
                  />
                </div>

                <div className="flex-1 pt-2">
                  <h4
                    className={`text-lg font-serif font-semibold mb-1 transition-colors duration-300 ${
                      isCompleted || isCurrent ? 'text-oak-900' : 'text-oak-400'
                    }`}
                  >
                    {stage.label}
                  </h4>
                  <p
                    className={`text-sm mb-2 transition-colors duration-300 ${
                      isCompleted || isCurrent ? 'text-oak-700' : 'text-oak-400'
                    }`}
                  >
                    {stage.description}
                  </p>

                  {historyEntry && (
                    <div className="mt-3 bg-cream-100/50 rounded-lg p-3 border border-slate-200/40">
                      <p className="text-xs text-oak-600 font-medium">
                        {new Date(historyEntry.created_at).toLocaleDateString('en-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {historyEntry.notes && (
                        <p className="text-xs text-oak-500 mt-1">{historyEntry.notes}</p>
                      )}
                    </div>
                  )}

                  {isCurrent && !historyEntry && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-champagne-100 text-champagne-800 rounded-full text-xs font-semibold">
                      <span className="w-2 h-2 bg-champagne-600 rounded-full animate-pulse"></span>
                      In Progress
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
