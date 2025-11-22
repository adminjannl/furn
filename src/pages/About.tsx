import { Award, Heart, Leaf, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="texture-premium-leather text-cream-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-oak-900/40 via-oak-800/20 to-oak-900/40"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Over Meubelmakerij Harts</h1>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            Sinds 1947 vervaardigen wij hoogwaardige meubels met respect voor vakmanschap,
            traditie en de natuurlijke schoonheid van hout.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-serif font-bold text-oak-900 mb-6">Ons Verhaal</h2>
            <div className="space-y-4 text-oak-700 leading-relaxed">
              <p>
                Het begon in 1947, toen meester-meubelmaker Hendrik Harts zijn eerste werkplaats
                opende in het hart van Amsterdam. Met slechts enkele gereedschappen en een onwrikbare
                passie voor vakmanschap, begon hij aan een reis die generaties zou omspannen.
              </p>
              <p>
                Vandaag de dag, meer dan 75 jaar later, wordt onze familie-onderneming geleid door de
                derde generatie Harts. Hoewel veel is veranderd - van onze moderne faciliteiten
                tot onze geavanceerde technieken - blijft onze toewijding aan kwaliteit en vakmanschap
                onveranderd.
              </p>
              <p>
                Elk meubelstuk dat onze werkplaats verlaat, draagt niet alleen de naam Harts,
                maar ook de erfenis van drie generaties meubelmakers die hun leven hebben gewijd aan
                het creëren van tijdloze stukken.
              </p>
            </div>
          </div>
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src="https://images.pexels.com/photos/5974257/pexels-photo-5974257.jpeg"
              alt="Meubelmakerij werkplaats"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-forest-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">75+ Jaar Ervaring</h3>
            <p className="text-oak-600 text-sm">
              Drie generaties vakmanschap en traditie
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-champagne-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Handgemaakt</h3>
            <p className="text-oak-600 text-sm">
              Elk stuk met zorg en aandacht vervaardigd
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-forest-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Duurzaam</h3>
            <p className="text-oak-600 text-sm">
              FSC-gecertificeerd hout uit verantwoorde bronnen
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-champagne-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-champagne-700" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-oak-900 mb-2">Familie Bedrijf</h3>
            <p className="text-oak-600 text-sm">
              Persoonlijke service en maatwerk
            </p>
          </div>
        </div>

        <div className="relative texture-aged-parchment rounded-lg p-8 md:p-12 shadow-elevation-2 border border-champagne-200/30 overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold text-oak-900 mb-6 text-center">Onze Missie</h2>
            <p className="text-xl text-oak-700 text-center max-w-4xl mx-auto leading-relaxed mb-8">
              Wij geloven dat meubels meer zijn dan functionele objecten. Ze zijn getuigen van uw leven,
              dragers van herinneringen, en erfstukken voor toekomstige generaties. Daarom vervaardigen
              wij elk stuk met de intentie dat het een leven lang meegaat.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-serif font-bold text-champagne-600 mb-2">100%</p>
                <p className="text-oak-700">Nederlands Hout</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-champagne-600 mb-2">10 Jaar</p>
                <p className="text-oak-700">Garantie</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-champagne-600 mb-2">50+</p>
                <p className="text-oak-700">Medewerkers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
