import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Truck, MapPin, Clock, Shield, Globe, ChevronDown, CheckCircle, Hammer, Box, Home } from 'lucide-react';

export default function Delivery() {
  const { t } = useTranslation();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    { question: t('delivery.faq1Q'), answer: t('delivery.faq1A'), icon: Truck },
    { question: t('delivery.faq2Q'), answer: t('delivery.faq2A'), icon: Clock },
    { question: t('delivery.faq3Q'), answer: t('delivery.faq3A'), icon: Package },
    { question: t('delivery.faq4Q'), answer: t('delivery.faq4A'), icon: Shield },
    { question: t('delivery.faq5Q'), answer: t('delivery.faq5A'), icon: MapPin },
    { question: t('delivery.faq6Q'), answer: t('delivery.faq6A'), icon: Package },
    { question: t('delivery.faq7Q'), answer: t('delivery.faq7A'), icon: Globe },
    { question: t('delivery.faq8Q'), answer: t('delivery.faq8A'), icon: MapPin },
    { question: t('delivery.faq9Q'), answer: t('delivery.faq9A'), icon: Package },
    { question: t('delivery.faq10Q'), answer: t('delivery.faq10A'), icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-slate-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-700 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
            <Truck className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold mb-4">{t('delivery.title')}</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {t('delivery.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">{t('delivery.journeyTitle')}</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            {t('delivery.journeySubtitle')}
          </p>

          <div className="relative max-w-7xl mx-auto">
            <div className="absolute left-0 right-0 top-20 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 hidden lg:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 lg:gap-6">
              <div className="relative">
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-32 h-32 md:w-24 md:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 mb-4 z-10">
                    <CheckCircle className="w-12 h-12 md:w-10 md:h-10 text-white" />
                    <div className="absolute -inset-1 bg-green-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border-2 border-green-100 min-h-[140px] flex flex-col justify-between w-full">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{t('delivery.orderPlaced')}</h3>
                    <p className="text-xs text-slate-600 mb-2">{t('delivery.orderPlacedDay')}</p>
                    <p className="text-xs text-slate-500 leading-tight">{t('delivery.orderPlacedDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-32 h-32 md:w-24 md:h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 mb-4 z-10">
                    <Hammer className="w-12 h-12 md:w-10 md:h-10 text-white animate-pulse" />
                    <div className="absolute -inset-1 bg-amber-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border-2 border-amber-100 min-h-[140px] flex flex-col justify-between w-full">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{t('delivery.crafting')}</h3>
                    <p className="text-xs text-slate-600 mb-2">{t('delivery.craftingDays')}</p>
                    <p className="text-xs text-slate-500 leading-tight">{t('delivery.craftingDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-32 h-32 md:w-24 md:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 mb-4 z-10">
                    <Shield className="w-12 h-12 md:w-10 md:h-10 text-white" />
                    <div className="absolute -inset-1 bg-blue-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border-2 border-blue-100 min-h-[140px] flex flex-col justify-between w-full">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{t('delivery.qualityCheck')}</h3>
                    <p className="text-xs text-slate-600 mb-2">{t('delivery.qualityCheckDays')}</p>
                    <p className="text-xs text-slate-500 leading-tight">{t('delivery.qualityCheckDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-32 h-32 md:w-24 md:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 mb-4 z-10">
                    <Box className="w-12 h-12 md:w-10 md:h-10 text-white" />
                    <div className="absolute -inset-1 bg-purple-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border-2 border-purple-100 min-h-[140px] flex flex-col justify-between w-full">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{t('delivery.packaging')}</h3>
                    <p className="text-xs text-slate-600 mb-2">{t('delivery.packagingDay')}</p>
                    <p className="text-xs text-slate-500 leading-tight">{t('delivery.packagingDesc')}</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="flex flex-col items-center text-center group">
                  <div className="relative w-32 h-32 md:w-24 md:h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-3 mb-4 z-10">
                    <Home className="w-12 h-12 md:w-10 md:h-10 text-white" />
                    <div className="absolute -inset-1 bg-emerald-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border-2 border-emerald-100 min-h-[140px] flex flex-col justify-between w-full">
                    <h3 className="font-bold text-slate-900 mb-2 text-sm leading-tight">{t('delivery.delivered')}</h3>
                    <p className="text-xs text-slate-600 mb-2">{t('delivery.deliveredDays')}</p>
                    <p className="text-xs text-slate-500 leading-tight">{t('delivery.deliveredDesc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 max-w-3xl mx-auto border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">{t('delivery.timelineNote')}</h4>
                <p className="text-sm text-slate-600">
                  {t('delivery.timelineNoteText')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-xl mb-4">
              <Truck className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('delivery.freeShipping')}</h3>
            <p className="text-slate-600">
              {t('delivery.freeShippingDesc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-xl mb-4">
              <Clock className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('delivery.threeWeekDelivery')}</h3>
            <p className="text-slate-600">
              {t('delivery.threeWeekDeliveryDesc')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-100 rounded-xl mb-4">
              <Globe className="w-7 h-7 text-slate-900" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('delivery.euWideDelivery')}</h3>
            <p className="text-slate-600">
              {t('delivery.euWideDeliveryDesc')}
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">{t('delivery.faqTitle')}</h2>
          <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
            {t('delivery.faqSubtitle')}
          </p>

          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl">
                        <Icon className="w-6 h-6 text-slate-900" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 pr-4">{faq.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-slate-600 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-6 pl-[88px]">
                      <div className="text-slate-600 leading-relaxed whitespace-pre-line border-l-4 border-slate-200 pl-4">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">{t('delivery.stillHaveQuestions')}</h2>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
            {t('delivery.customerServiceText')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/faq"
              className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              {t('delivery.viewAllFaqs')}
            </a>
            <a
              href="/track-order"
              className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-colors"
            >
              {t('delivery.trackYourOrder')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
