import { Shield, FileText, Camera, Send, CheckCircle, Clock, Package, Wrench } from 'lucide-react';
import { useState } from 'react';

export default function Warranty() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30">
      <div className="bg-gradient-to-br from-oak-800 via-oak-700 to-oak-900 text-cream-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-champagne-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">10-Year Quality Guarantee</h1>
          </div>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            We stand behind every piece of furniture we create. Our comprehensive 10-year warranty
            covers all construction defects and material failures, ensuring your investment is protected.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-champagne-50 to-cream-50 rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-slate-200/40 mb-16">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">What's Covered?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-oak-900">Covered Under Warranty</h3>
              </div>
              <ul className="space-y-3 text-oak-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Structural defects in joints, frames, and load-bearing components</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Manufacturing defects in materials or craftsmanship</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Finish deterioration due to material defects</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Wood splitting or warping due to improper kiln drying</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Hardware failures including hinges, drawer slides, and mechanisms</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Veneer or laminate separation from substrate</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-xl font-serif font-semibold text-oak-900">Not Covered</h3>
              </div>
              <ul className="space-y-3 text-oak-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Normal wear and tear from regular use</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Damage from accidents, misuse, or abuse</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Scratches, dents, or surface damage from impacts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Damage from improper cleaning or maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Modifications or repairs by unauthorized parties</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 flex-shrink-0">✕</span>
                  <span>Natural wood color variations and grain patterns</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl">ℹ️</span>
              </div>
              <div>
                <h4 className="font-serif font-semibold text-oak-900 mb-2">Important Notes</h4>
                <ul className="space-y-2 text-oak-700 text-sm">
                  <li>• Warranty applies to the original purchaser and is non-transferable</li>
                  <li>• Proof of purchase required for all warranty claims</li>
                  <li>• Furniture must have been used in normal residential conditions</li>
                  <li>• Professional cleaning or repair attempts may void warranty</li>
                  <li>• We reserve the right to repair, replace, or refund at our discretion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">How to File a Warranty Claim</h2>
          <p className="text-center text-oak-600 mb-12 max-w-2xl mx-auto">
            Filing a warranty claim is simple and straightforward. Follow these steps to get your furniture
            repaired or replaced quickly.
          </p>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-oak-300 via-oak-400 to-oak-300 hidden md:block"></div>

            <div className="space-y-8">
              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <FileText className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-sm font-bold">Step 1</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 shadow-elevation-3 border border-slate-200/40">
                  <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-4">Gather Your Information</h3>
                  <p className="text-oak-700 mb-4">
                    Before starting your claim, collect the following information:
                  </p>
                  <ul className="space-y-2 text-oak-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-oak-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Order number</strong> from your original purchase confirmation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-oak-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Purchase date</strong> to verify warranty period</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-oak-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Product name and SKU</strong> from your invoice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-oak-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Detailed description</strong> of the issue you're experiencing</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-sm font-bold">Step 2</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 shadow-elevation-3 border border-slate-200/40">
                  <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-4">Document the Issue</h3>
                  <p className="text-oak-700 mb-4">
                    Take clear photos of the defect from multiple angles:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-cream-50 rounded-lg p-4 border border-slate-200">
                      <p className="font-semibold text-oak-900 mb-2">✓ Close-up of the defect</p>
                      <p className="text-sm text-oak-600">Show the issue in detail</p>
                    </div>
                    <div className="bg-cream-50 rounded-lg p-4 border border-slate-200">
                      <p className="font-semibold text-oak-900 mb-2">✓ Full furniture piece</p>
                      <p className="text-sm text-oak-600">Context of where defect is located</p>
                    </div>
                    <div className="bg-cream-50 rounded-lg p-4 border border-slate-200">
                      <p className="font-semibold text-oak-900 mb-2">✓ Product label/tag</p>
                      <p className="text-sm text-oak-600">If still attached to furniture</p>
                    </div>
                    <div className="bg-cream-50 rounded-lg p-4 border border-slate-200">
                      <p className="font-semibold text-oak-900 mb-2">✓ Any other damage</p>
                      <p className="text-sm text-oak-600">Related issues or concerns</p>
                    </div>
                  </div>
                  <p className="text-sm text-oak-600 mt-4">
                    <strong>Tip:</strong> Take photos in good lighting. Clear images help us process your claim faster.
                  </p>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <Send className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-sm font-bold">Step 3</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 shadow-elevation-3 border border-slate-200/40">
                  <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-4">Submit Your Claim</h3>
                  <p className="text-oak-700 mb-4">
                    Choose your preferred method to submit your warranty claim:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-oak-50 to-cream-50 rounded-lg p-6 border border-oak-200">
                      <p className="font-semibold text-oak-900 mb-2">📧 Email (Recommended)</p>
                      <p className="text-oak-700 mb-3">
                        Send all information and photos to: <a href="mailto:warranty@meubelmakerij.nl" className="text-oak-800 font-semibold hover:underline">warranty@meubelmakerij.nl</a>
                      </p>
                      <p className="text-sm text-oak-600">Response time: Within 24 hours</p>
                    </div>
                    <div className="bg-gradient-to-br from-oak-50 to-cream-50 rounded-lg p-6 border border-oak-200">
                      <p className="font-semibold text-oak-900 mb-2">📞 Phone</p>
                      <p className="text-oak-700 mb-3">
                        Call our warranty department: <a href="tel:+31201234567" className="text-oak-800 font-semibold hover:underline">+31 (0)20 123 4567</a>
                      </p>
                      <p className="text-sm text-oak-600">Hours: Monday-Friday, 9:00 AM - 5:00 PM CET</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <Clock className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-sm font-bold">Step 4</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 shadow-elevation-3 border border-slate-200/40">
                  <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-4">Claim Review Process</h3>
                  <p className="text-oak-700 mb-4">
                    Our warranty team will review your claim and respond within 1-2 business days:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-oak-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-oak-700 font-bold text-sm">1</span>
                      </div>
                      <div>
                        <p className="text-oak-900 font-medium">Initial Assessment</p>
                        <p className="text-sm text-oak-600">We verify warranty coverage and eligibility</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-oak-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-oak-700 font-bold text-sm">2</span>
                      </div>
                      <div>
                        <p className="text-oak-900 font-medium">Solution Proposal</p>
                        <p className="text-sm text-oak-600">We offer repair, replacement, or refund options</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-oak-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-oak-700 font-bold text-sm">3</span>
                      </div>
                      <div>
                        <p className="text-oak-900 font-medium">Additional Information</p>
                        <p className="text-sm text-oak-600">We may request more photos or details if needed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <Wrench className="w-8 h-8 text-white mb-1" />
                  <span className="text-white text-sm font-bold">Step 5</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-8 shadow-elevation-3 border border-slate-200/40">
                  <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-4">Resolution & Repair</h3>
                  <p className="text-oak-700 mb-4">
                    Once approved, we'll proceed with the resolution:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <Package className="w-8 h-8 text-green-700 mx-auto mb-2" />
                      <p className="font-semibold text-oak-900 mb-1">Replacement</p>
                      <p className="text-sm text-oak-600">New piece shipped within 2-4 weeks</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <Wrench className="w-8 h-8 text-blue-700 mx-auto mb-2" />
                      <p className="font-semibold text-oak-900 mb-1">Repair</p>
                      <p className="text-sm text-oak-600">On-site or in-workshop repair scheduled</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                      <span className="text-3xl mb-2 block">💶</span>
                      <p className="font-semibold text-oak-900 mb-1">Refund</p>
                      <p className="text-sm text-oak-600">Full purchase price returned</p>
                    </div>
                  </div>
                  <p className="text-sm text-oak-600 mt-4">
                    <strong>Free collection:</strong> We arrange pickup of defective items at no charge to you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
            <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-6">Typical Response Times</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-oak-700">Initial response</span>
                <span className="font-semibold text-oak-900">24 hours</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-oak-700">Claim assessment</span>
                <span className="font-semibold text-oak-900">1-2 days</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-oak-700">Repair scheduling</span>
                <span className="font-semibold text-oak-900">3-5 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-oak-700">Replacement delivery</span>
                <span className="font-semibold text-oak-900">2-4 weeks</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
            <h3 className="text-2xl font-serif font-semibold text-oak-900 mb-6">Contact Warranty Department</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-oak-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📧</span>
                </div>
                <div>
                  <p className="text-oak-900 font-medium">Email</p>
                  <a href="mailto:warranty@meubelmakerij.nl" className="text-oak-700 hover:text-oak-900 hover:underline">
                    warranty@meubelmakerij.nl
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-oak-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📞</span>
                </div>
                <div>
                  <p className="text-oak-900 font-medium">Phone</p>
                  <a href="tel:+31201234567" className="text-oak-700 hover:text-oak-900 hover:underline">
                    +31 (0)20 123 4567
                  </a>
                  <p className="text-sm text-oak-600">Mon-Fri: 9:00 AM - 5:00 PM CET</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-champagne-100 to-cream-100 rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-champagne-200/40">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="w-16 h-16 text-oak-700 mx-auto mb-6" />
            <h2 className="text-3xl font-serif font-bold text-oak-900 mb-4">Our Commitment to You</h2>
            <p className="text-lg text-oak-700 leading-relaxed">
              At Meubelmakerij Harts, we take pride in every piece we create. Our 10-year warranty
              is backed by 75+ years of craftsmanship excellence. When you invest in our furniture,
              you're investing in quality that lasts generations. We're here to support you every
              step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
