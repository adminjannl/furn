import { CheckCircle, ClipboardCheck, Eye, Scale, Ruler, Droplet, Shield } from 'lucide-react';

export default function QualityControl() {
  const inspectionStages = [
    {
      stage: 'Material Inspection',
      icon: Eye,
      timing: 'Upon Receipt',
      color: 'forest',
      checks: [
        {
          name: 'Wood Grade Verification',
          description: 'FSC certification confirmed, grain quality assessed, no defects or damage',
          passCriteria: '100% premium grade, consistent color and grain'
        },
        {
          name: 'Moisture Content Testing',
          description: 'Electronic moisture meter used to verify proper kiln drying',
          passCriteria: '8-12% moisture content across all pieces'
        },
        {
          name: 'Dimensional Accuracy',
          description: 'All lumber measured against order specifications',
          passCriteria: 'Within 1mm of specified dimensions'
        }
      ]
    },
    {
      stage: 'During Production',
      icon: ClipboardCheck,
      timing: 'Multiple Checkpoints',
      color: 'copper',
      checks: [
        {
          name: 'Joinery Fit Testing',
          description: 'Each mortise and tenon joint tested for snug fit without forcing',
          passCriteria: 'Hand-tight fit, no gaps or excessive force needed'
        },
        {
          name: 'Alignment Verification',
          description: 'Precision measuring tools ensure perfect alignment of all components',
          passCriteria: 'Square within 0.5mm, level within 1mm per meter'
        },
        {
          name: 'Surface Preparation',
          description: 'Sanding progression verified, surface smoothness tested by hand',
          passCriteria: 'Silk-smooth finish, no rough patches or tool marks'
        }
      ]
    },
    {
      stage: 'Post-Assembly',
      icon: Scale,
      timing: 'After Complete Assembly',
      color: 'oak',
      checks: [
        {
          name: 'Structural Integrity Testing',
          description: 'Weight capacity and stress testing for load-bearing furniture',
          passCriteria: '3x rated capacity with no flex or stress sounds'
        },
        {
          name: 'Moving Parts Function',
          description: 'Drawers, doors, and mechanisms tested for smooth operation',
          passCriteria: 'Smooth action, no binding, proper clearances'
        },
        {
          name: 'Stability Assessment',
          description: 'Furniture tested on level surface for wobble or instability',
          passCriteria: 'Rock-solid stability, all contact points even'
        }
      ]
    },
    {
      stage: 'Finish Quality',
      icon: Droplet,
      timing: 'After Final Coat',
      color: 'champagne',
      checks: [
        {
          name: 'Coating Coverage',
          description: 'Visual inspection under multiple lighting angles for complete coverage',
          passCriteria: 'Uniform finish, no missed spots or thin areas'
        },
        {
          name: 'Surface Smoothness',
          description: 'Hand-tested for smoothness, buffed to proper sheen',
          passCriteria: 'Silk-smooth feel, consistent sheen throughout'
        },
        {
          name: 'Color Consistency',
          description: 'All components compared for matching color and tone',
          passCriteria: 'Color variation within acceptable natural range'
        }
      ]
    },
    {
      stage: 'Final Inspection',
      icon: Shield,
      timing: 'Before Packaging',
      color: 'oak',
      checks: [
        {
          name: 'Master Craftsman Review',
          description: '47-point checklist completed by certified master craftsman',
          passCriteria: 'All 47 points pass, craftsman signature approval'
        },
        {
          name: 'Photographic Documentation',
          description: 'Multiple angles photographed for quality records and customer reference',
          passCriteria: 'Complete photo documentation filed with build sheet'
        },
        {
          name: 'Customer Specifications',
          description: 'Verified against original order for size, finish, and configuration',
          passCriteria: '100% match to customer order specifications'
        }
      ]
    }
  ];

  const colorClasses = {
    forest: {
      bg: 'bg-forest-100',
      text: 'text-forest-700',
      border: 'border-forest-200'
    },
    copper: {
      bg: 'bg-champagne-100',
      text: 'text-champagne-700',
      border: 'border-champagne-200'
    },
    oak: {
      bg: 'bg-oak-100',
      text: 'text-oak-700',
      border: 'border-oak-200'
    },
    champagne: {
      bg: 'bg-champagne-100',
      text: 'text-champagne-700',
      border: 'border-champagne-200'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-white to-cream-50/30">
      <div className="bg-gradient-to-br from-oak-800 via-oak-700 to-oak-900 text-cream-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-champagne-300 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-champagne-400 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <ClipboardCheck className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Quality Control Process</h1>
          </div>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            Every piece of furniture undergoes 47 individual quality checks across 5 inspection stages.
            Our zero-tolerance policy ensures only perfect pieces reach your home.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-cream-100 to-cream-50 rounded-2xl p-8 md:p-12 shadow-elevation-3 border border-slate-200/40 mb-16">
          <h2 className="text-3xl font-serif font-bold text-oak-900 mb-8 text-center">Our Quality Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-oak-700 mb-2">47</div>
              <p className="text-oak-600 font-medium">Quality Checkpoints</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-oak-700 mb-2">5</div>
              <p className="text-oak-600 font-medium">Inspection Stages</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-oak-700 mb-2">0%</div>
              <p className="text-oak-600 font-medium">Defect Tolerance</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-bold text-oak-700 mb-2">100%</div>
              <p className="text-oak-600 font-medium">Master Approved</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {inspectionStages.map((stage, index) => {
            const Icon = stage.icon;
            const colors = colorClasses[stage.color as keyof typeof colorClasses];

            return (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-elevation-3 border border-slate-200/40">
                <div className={`${colors.bg} border-b ${colors.border} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm`}>
                        <Icon className={`w-8 h-8 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-semibold text-oak-900">{stage.stage}</h3>
                        <p className={`text-sm ${colors.text} font-medium`}>{stage.timing}</p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <span className="bg-white px-4 py-2 rounded-lg text-sm font-semibold text-oak-800 shadow-sm">
                        Stage {index + 1} of {inspectionStages.length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {stage.checks.map((check, checkIndex) => (
                      <div key={checkIndex} className="bg-cream-50 rounded-xl p-6 border border-slate-200/30">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-serif font-semibold text-oak-900 mb-2">{check.name}</h4>
                            <p className="text-oak-700 mb-3">{check.description}</p>
                            <div className="bg-white rounded-lg p-4 border border-green-200">
                              <p className="text-sm text-oak-600">
                                <span className="font-semibold text-green-700">Pass Criteria:</span> {check.passCriteria}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <Ruler className="w-8 h-8 text-oak-700" />
              <h3 className="text-2xl font-serif font-semibold text-oak-900">Precision Standards</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Dimensional Tolerance</p>
                  <p className="text-sm text-oak-600">Within 0.5mm on all critical dimensions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Square and Level</p>
                  <p className="text-sm text-oak-600">Perfect 90° angles, level within 1mm per meter</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Joint Fit</p>
                  <p className="text-sm text-oak-600">Hand-tight without gaps or forcing</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Surface Finish</p>
                  <p className="text-sm text-oak-600">320-grit smoothness, no tool marks visible</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-elevation-3 border border-slate-200/40">
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-oak-700" />
              <h3 className="text-2xl font-serif font-semibold text-oak-900">Testing Protocols</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Load Testing</p>
                  <p className="text-sm text-oak-600">3x rated capacity for all weight-bearing pieces</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Cycle Testing</p>
                  <p className="text-sm text-oak-600">Drawers and doors tested 1000+ open/close cycles</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Finish Durability</p>
                  <p className="text-sm text-oak-600">Water resistance and wear testing performed</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-oak-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-oak-900">Stability Assessment</p>
                  <p className="text-sm text-oak-600">Wobble and tip-over testing on all freestanding pieces</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-oak-900 to-oak-800 rounded-2xl p-8 md:p-12 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-12 h-12 text-champagne-300" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-serif font-bold mb-4">Zero Compromise on Quality</h2>
              <p className="text-cream-200 text-lg leading-relaxed mb-4">
                If a piece doesn't pass any single check, it doesn't leave our workshop. We reject approximately
                2% of finished pieces that don't meet our exacting standards. These pieces are either completely
                reworked or recycled - never sold as "seconds" or "outlet" items.
              </p>
              <p className="text-cream-200 text-lg leading-relaxed">
                This uncompromising approach to quality is why we confidently offer a 10-year warranty and why
                our furniture regularly serves families for 50+ years.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
