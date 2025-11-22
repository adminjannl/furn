import { Clock, TreePine, Hammer, Droplet, Sparkles, Package, CheckCircle } from 'lucide-react';

export default function ProductionProcess() {
  const stages = [
    {
      icon: TreePine,
      title: 'Wood Selection',
      duration: '1-3 days',
      description: 'Our master craftsmen personally select each piece of wood, examining grain patterns, color consistency, and structural integrity.',
      details: [
        'Only premium-grade hardwood makes the cut',
        'Moisture content verified (8-12%)',
        'Natural character assessed for beauty',
        'Each board hand-picked for your furniture'
      ],
      image: 'https://images.pexels.com/photos/175709/pexels-photo-175709.jpeg'
    },
    {
      icon: Hammer,
      title: 'Precision Cutting',
      duration: '2-4 days',
      description: 'Using a combination of traditional hand tools and precision machinery, we cut each component to exact specifications.',
      details: [
        'Accuracy to within 0.5mm tolerance',
        'Grain direction optimized for strength',
        'Traditional joinery marked by hand',
        'Zero waste - all offcuts repurposed'
      ],
      image: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg'
    },
    {
      icon: Hammer,
      title: 'Joinery & Assembly',
      duration: '5-10 days',
      description: 'The heart of our craft. Traditional mortise and tenon joints, dovetails, and hand-fitted connections ensure strength that lasts generations.',
      details: [
        'No nails or screws in visible areas',
        'Glue-free joinery where possible',
        'Each joint hand-fitted for perfect alignment',
        'Techniques dating back centuries'
      ],
      image: 'https://images.pexels.com/photos/5974257/pexels-photo-5974257.jpeg'
    },
    {
      icon: Droplet,
      title: 'Sanding & Preparation',
      duration: '3-5 days',
      description: 'Multiple stages of hand sanding bring out the natural beauty of the wood, creating a surface that feels as good as it looks.',
      details: [
        'Progressive grit from 80 to 320',
        'Hand sanding for curves and details',
        'Grain raising and smoothing',
        'Final inspection for perfection'
      ],
      image: 'https://images.pexels.com/photos/5974258/pexels-photo-5974258.jpeg'
    },
    {
      icon: Sparkles,
      title: 'Finishing',
      duration: '4-7 days',
      description: 'Natural oils and waxes are hand-applied in thin layers, enhancing wood grain while providing protection. Each coat must cure before the next.',
      details: [
        '3-5 coats of natural oil applied',
        '24-48 hours curing between coats',
        'Hand-buffed to silk-smooth finish',
        'Food-safe and non-toxic materials'
      ],
      image: 'https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg'
    },
    {
      icon: CheckCircle,
      title: 'Quality Inspection',
      duration: '1-2 days',
      description: 'Every piece undergoes rigorous inspection. We check structural integrity, finish quality, and overall craftsmanship before it earns our stamp of approval.',
      details: [
        '47-point quality checklist',
        'Load testing for structural pieces',
        'Finish inspected under multiple lighting',
        'Final approval by master craftsman'
      ],
      image: 'https://images.pexels.com/photos/5974478/pexels-photo-5974478.jpeg'
    },
    {
      icon: Package,
      title: 'Packaging & Delivery',
      duration: '1-2 days',
      description: 'Custom packaging protects your furniture during transit. Delivered white-glove to your door with installation included.',
      details: [
        'Custom-fitted protective packaging',
        'Eco-friendly materials used throughout',
        'Professional delivery team',
        'Free in-home placement and setup'
      ],
      image: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg'
    }
  ];

  const totalDaysMin = stages.reduce((sum, stage) => {
    const min = parseInt(stage.duration.split('-')[0]);
    return sum + min;
  }, 0);

  const totalDaysMax = stages.reduce((sum, stage) => {
    const max = parseInt(stage.duration.split('-')[1]);
    return sum + max;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30">
      <div className="bg-gradient-to-br from-oak-800 via-oak-700 to-oak-900 text-cream-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-champagne-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <Clock className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Production Timeline</h1>
          </div>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed mb-8">
            Every piece of furniture follows a meticulous {totalDaysMin}-{totalDaysMax} day journey from raw wood
            to finished masterpiece. Here's exactly what happens during that time.
          </p>
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
            <Clock className="w-6 h-6 text-champagne-300" />
            <div>
              <p className="text-sm text-cream-300">Total Production Time</p>
              <p className="text-2xl font-serif font-bold">{totalDaysMin}-{totalDaysMax} Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative">
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-oak-300 via-oak-400 to-oak-300 hidden lg:block"></div>

          <div className="space-y-16">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <div key={index} className="relative">
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-24 h-24 bg-gradient-to-br from-oak-700 to-oak-800 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 shadow-xl relative z-10">
                      <Icon className="w-10 h-10 text-white mb-1" />
                      <span className="text-white text-xs font-bold">Stage {index + 1}</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-serif font-semibold text-oak-900">{stage.title}</h3>
                          <div className="bg-oak-100 px-4 py-2 rounded-lg">
                            <p className="text-sm font-semibold text-oak-800">{stage.duration}</p>
                          </div>
                        </div>
                        <p className="text-oak-700 leading-relaxed mb-6">{stage.description}</p>
                        <ul className="space-y-3">
                          {stage.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-forest-600 mt-0.5 flex-shrink-0" />
                              <span className="text-oak-700 text-sm">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="group relative overflow-hidden rounded-2xl shadow-elevation-3 h-80 lg:h-auto">
                        <img
                          src={stage.image}
                          alt={stage.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-oak-900/70 via-oak-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                          <div className="p-6 text-white">
                            <p className="text-sm font-semibold">Stage {index + 1} of {stages.length}</p>
                            <p className="text-lg font-serif">{stage.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-br from-champagne-50 to-cream-50 rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-champagne-200/40">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">Why Does It Take This Long?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-oak-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplet className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-oak-900 mb-3">Proper Curing</h3>
              <p className="text-oak-700 leading-relaxed">
                Each finish coat needs 24-48 hours to cure properly. Rushing this step compromises
                durability and creates an inferior product.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-champagne-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hammer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-oak-900 mb-3">Hand Craftsmanship</h3>
              <p className="text-oak-700 leading-relaxed">
                Traditional joinery can't be rushed. Each joint is hand-fitted, requiring patience,
                skill, and attention to detail that machines cannot replicate.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-oak-900 mb-3">Quality Assurance</h3>
              <p className="text-oak-700 leading-relaxed">
                Every piece undergoes rigorous inspection at multiple stages. We never compromise
                our standards to meet deadlines.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-oak-900 to-oak-800 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">The Result? Furniture That Lasts Generations</h2>
          <p className="text-cream-200 text-lg mb-8 max-w-3xl mx-auto">
            While fast furniture manufacturers can produce a piece in hours, our {totalDaysMin}-{totalDaysMax} day
            process ensures your investment will last 50+ years instead of 5. That's the difference
            between furniture and heirloom.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-serif font-bold mb-2">{totalDaysMin}+</p>
              <p className="text-cream-300 text-sm">Days Crafting</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-serif font-bold mb-2">25-40</p>
              <p className="text-cream-300 text-sm">Labor Hours</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-serif font-bold mb-2">47</p>
              <p className="text-cream-300 text-sm">Quality Checks</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-4xl font-serif font-bold mb-2">50+</p>
              <p className="text-cream-300 text-sm">Years Lifespan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
