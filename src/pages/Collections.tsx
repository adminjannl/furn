import { Link } from 'react-router-dom';

const collections = [
  {
    name: 'Klassiek Eiken',
    slug: 'klassiek-eiken',
    description: 'Tijdloze elegantie met klassieke vormen en warme eikenhouttinten. Perfect voor traditionele interieurs.',
    image: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
    items: '24 producten',
  },
  {
    name: 'Modern Minimaal',
    slug: 'modern-minimaal',
    description: 'Strakke lijnen en functioneel design. Voor hedendaagse interieurs met focus op eenvoud en ruimte.',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    items: '18 producten',
  },
  {
    name: 'Scandinavisch',
    slug: 'scandinavisch',
    description: 'Licht hout, organische vormen en natuurlijke materialen. Comfort en functionaliteit in harmonie.',
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    items: '32 producten',
  },
  {
    name: 'Industrieel',
    slug: 'industrieel',
    description: 'Robuust hout gecombineerd met metalen accenten. Voor een stoere, authentieke uitstraling.',
    image: 'https://images.pexels.com/photos/2092058/pexels-photo-2092058.jpeg',
    items: '21 producten',
  },
  {
    name: 'Landelijk',
    slug: 'landelijk',
    description: 'Warme, rustieke meubels met natuurlijke houtstructuren. Voor een gezellige, authentieke sfeer.',
    image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg',
    items: '28 producten',
  },
  {
    name: 'Luxe Notenhout',
    slug: 'luxe-notenhout',
    description: 'Premium notenhout met rijk gevlamde tekeningen. Voor exclusieve, verfijnde interieurs.',
    image: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    items: '15 producten',
  },
];

export default function Collections() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-oak-800 text-cream-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Onze Collecties</h1>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            Ontdek onze zorgvuldig samengestelde collecties, elk met een eigen karakter en stijl.
            Van klassiek tot modern, van industrieel tot landelijk.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              to={`/collection/${collection.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-2xl font-serif font-bold text-oak-900">{collection.name}</h2>
                  <span className="text-sm text-oak-600">{collection.items}</span>
                </div>
                <p className="text-oak-700 leading-relaxed mb-4">{collection.description}</p>
                <div className="flex items-center text-champagne-600 font-semibold group-hover:gap-2 transition-all">
                  <span>Bekijk collectie</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-forest-700 text-cream-50 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Op Zoek Naar Maatwerk?</h2>
          <p className="text-xl text-cream-200 max-w-2xl mx-auto mb-8 leading-relaxed">
            Heeft u een specifieke wens of past geen van onze collecties perfect bij uw interieur?
            Onze meubelmakers realiseren graag uw unieke ontwerp.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-cream-50 text-forest-800 rounded-lg font-semibold hover:bg-white transition-colors"
          >
            Bespreek Uw Wensen
          </Link>
        </div>
      </div>
    </div>
  );
}
