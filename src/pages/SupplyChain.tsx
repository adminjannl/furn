import { MapPin, Leaf, TreePine, CheckCircle, TrendingUp, Heart } from 'lucide-react';

export default function SupplyChain() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30">
      <div className="bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-cream-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-forest-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-forest-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Supply Chain Transparency</h1>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            Every piece of wood tells a story. We believe in complete transparency about where our materials
            come from and how they reach our workshop. Our commitment to ethical sourcing ensures that every
            piece of furniture supports sustainable forestry and fair labor practices.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-slate-200/40 mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-forest-700" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-oak-900">Our Commitment to Sustainability</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-forest-700 mb-3">100%</div>
              <p className="text-oak-700 font-medium">FSC Certified Wood</p>
              <p className="text-sm text-oak-600 mt-2">All materials from responsibly managed forests</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-forest-700 mb-3">Zero</div>
              <p className="text-oak-700 font-medium">Illegal Logging</p>
              <p className="text-sm text-oak-600 mt-2">Full chain of custody documentation</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-forest-700 mb-3">75+</div>
              <p className="text-oak-700 font-medium">Years of Ethics</p>
              <p className="text-sm text-oak-600 mt-2">Three generations of responsible sourcing</p>
            </div>
          </div>

          <div className="prose max-w-none text-oak-700">
            <p className="text-lg leading-relaxed mb-4">
              Since 1947, Meubelmakerij Harts has maintained direct relationships with sustainable forestry
              operations across Europe. We personally visit our suppliers, verify their certifications, and
              ensure fair labor practices at every step of the supply chain.
            </p>
            <p className="text-lg leading-relaxed">
              Our commitment goes beyond certification. We actively contribute to reforestation programs,
              planting three trees for every one used in our furniture production. This ensures that future
              generations can continue to enjoy the beauty of European forests.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">Where Our Wood Comes From</h2>
          <div className="bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg"
                  alt="European Forest"
                  className="w-full h-96 object-cover rounded-xl shadow-lg"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Black Forest, Germany</h3>
                    <p className="text-oak-700">Premium European Oak from FSC-certified sustainable forests. Our primary supplier for 40+ years, specializing in slow-growth hardwood with exceptional grain patterns.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Veluwe Region, Netherlands</h3>
                    <p className="text-oak-700">Local Dutch Oak and Beech sourced within 100km of our workshop. Supports local forestry workers and reduces transportation emissions significantly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Ardennes, Belgium</h3>
                    <p className="text-oak-700">Walnut and Cherry wood from family-owned forestry operations. Third-generation partnerships ensuring quality and ethical practices across generations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Northern Italy</h3>
                    <p className="text-oak-700">Specialty hardwoods including Chestnut and Elm from alpine regions. Small-batch sourcing from certified sustainable operations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">From Forest to Workshop: Our Supply Chain</h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-forest-600 via-forest-500 to-forest-600 hidden md:block"></div>

            <div className="space-y-12">
              <div className="relative flex items-start gap-6">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <TreePine className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-elevation-2 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold text-oak-900">Stage 1: Sustainable Forestry</h3>
                    <span className="text-sm text-forest-700 font-semibold">Days 1-30</span>
                  </div>
                  <p className="text-oak-700 mb-4">
                    Trees are carefully selected by certified foresters using sustainable harvesting practices.
                    Only mature trees are harvested, ensuring forest regeneration. For every tree cut, three
                    saplings are planted in cooperation with local environmental programs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">FSC Certified</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Local Workers</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Biodiversity Protected</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-elevation-2 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold text-oak-900">Stage 2: Sawmill Processing</h3>
                    <span className="text-sm text-forest-700 font-semibold">Days 31-45</span>
                  </div>
                  <p className="text-oak-700 mb-4">
                    Logs are transported to family-owned sawmills where they are carefully cut and graded.
                    All sawmills meet strict environmental standards with zero-waste policies. Sawdust and
                    offcuts are used for heating or composting, ensuring complete utilization of materials.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Zero Waste</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Quality Grading</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Fair Wages</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-elevation-2 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold text-oak-900">Stage 3: Kiln Drying & Seasoning</h3>
                    <span className="text-sm text-forest-700 font-semibold">Days 46-120</span>
                  </div>
                  <p className="text-oak-700 mb-4">
                    Wood is dried using energy-efficient kilns powered by renewable energy. This crucial step
                    reduces moisture content to optimal levels (8-12%), preventing warping and ensuring
                    longevity. The process takes 6-10 weeks depending on wood species and thickness.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Renewable Energy</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Precision Monitoring</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Quality Control</span>
                  </div>
                </div>
              </div>

              <div className="relative flex items-start gap-6">
                <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg relative z-10">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 bg-white rounded-xl p-6 shadow-elevation-2 border border-slate-200/40">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-serif font-semibold text-oak-900">Stage 4: Our Workshop</h3>
                    <span className="text-sm text-forest-700 font-semibold">Days 121-180</span>
                  </div>
                  <p className="text-oak-700 mb-4">
                    Premium wood arrives at our Amsterdam workshop where master craftspeople transform it
                    into beautiful furniture. Each piece is handcrafted using traditional joinery techniques
                    passed down through three generations. Our artisans work in fair conditions with full
                    benefits and competitive wages.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Master Craftsmen</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Traditional Methods</span>
                    <span className="px-3 py-1 bg-forest-100 text-forest-800 rounded-full text-sm font-medium">Fair Labor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-oak-50 to-cream-50 rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-slate-200/40">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">Our Ethical Standards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-forest-700" />
                <h3 className="text-lg font-serif font-semibold text-oak-900">Labor Rights</h3>
              </div>
              <ul className="space-y-2 text-oak-700">
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Fair wages exceeding industry standards at all supply chain stages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Safe working conditions with regular third-party audits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>No child labor or forced labor tolerated anywhere in our supply chain</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Workers' right to organize and collective bargaining respected</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-forest-700" />
                <h3 className="text-lg font-serif font-semibold text-oak-900">Environmental Protection</h3>
              </div>
              <ul className="space-y-2 text-oak-700">
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Forest biodiversity maintained with wildlife corridor preservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Waterway protection during harvesting and processing operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Carbon-neutral transportation using optimized logistics routes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Active reforestation with native species planting programs</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-forest-700" />
                <h3 className="text-lg font-serif font-semibold text-oak-900">Community Support</h3>
              </div>
              <ul className="space-y-2 text-oak-700">
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Local community consultation before any forestry operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Indigenous land rights respected with formal agreements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Job creation in rural areas supporting local economies</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Educational programs teaching sustainable forestry practices</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-forest-700" />
                <h3 className="text-lg font-serif font-semibold text-oak-900">Transparency</h3>
              </div>
              <ul className="space-y-2 text-oak-700">
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Full chain of custody documentation for every piece of wood</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Third-party audits published annually on our website</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Traceability to specific forest locations for all materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forest-700 mt-1">•</span>
                  <span>Open invitation for customers to visit suppliers and our workshop</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-forest-900 to-forest-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Questions About Our Supply Chain?</h2>
          <p className="text-cream-200 text-lg mb-8 max-w-2xl mx-auto">
            We're proud of our ethical sourcing practices and happy to answer any questions.
            Request detailed documentation or schedule a visit to our suppliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:sustainability@meubelmakerij.nl"
              className="px-8 py-4 bg-white text-forest-900 rounded-xl font-semibold hover:bg-cream-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Contact Sustainability Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
