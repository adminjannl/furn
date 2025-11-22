import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: 'Bestellen',
    question: 'Hoe kan ik een bestelling plaatsen?',
    answer: 'U kunt eenvoudig online bestellen door producten toe te voegen aan uw winkelwagen en het afrekenproces te doorlopen. Neem contact met ons op voor persoonlijk advies en begeleiding.',
  },
  {
    category: 'Bestellen',
    question: 'Kan ik een product op maat laten maken?',
    answer: 'Ja, wij bieden maatwerk aan. Neem contact met ons op via telefoon of email om uw wensen te bespreken. Onze meubelmakers kunnen vrijwel elk ontwerp realiseren.',
  },
  {
    category: 'Bestellen',
    question: 'Wat is de levertijd?',
    answer: 'Standaard producten worden binnen 2-4 weken geleverd. Voor maatwerk hangt de levertijd af van de complexiteit, meestal 6-12 weken. U ontvangt een exacte levertijd bij uw bestelling.',
  },
  {
    category: 'Betaling',
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'Wij accepteren iDEAL, bankoverschrijving, creditcards (Visa, Mastercard), en Bancontact. Voor grotere bestellingen bieden wij ook gespreide betaling aan.',
  },
  {
    category: 'Betaling',
    question: 'Ontvang ik een factuur?',
    answer: 'Ja, u ontvangt automatisch een factuur per email na uw bestelling. Deze is ook te downloaden via uw account op onze website.',
  },
  {
    category: 'Levering',
    question: 'Wat zijn de verzendkosten?',
    answer: 'Verzending binnen Nederland kost €25. Bij bestellingen boven €500 leveren wij gratis. Voor Belgi\u00eb en Duitsland hanteren wij andere tarieven, neem contact op voor een offerte.',
  },
  {
    category: 'Levering',
    question: 'Leveren jullie ook in België?',
    answer: 'Ja, wij leveren in heel Nederland, België en delen van Duitsland. Voor andere landen kunt u contact met ons opnemen.',
  },
  {
    category: 'Levering',
    question: 'Wordt mijn meubel thuis geïnstalleerd?',
    answer: 'Ja, onze bezorgers plaatsen het meubel op de gewenste locatie in uw huis en nemen het verpakkingsmateriaal mee. Montage is inbegrepen bij grotere stukken.',
  },
  {
    category: 'Product & Kwaliteit',
    question: 'Welk hout gebruiken jullie?',
    answer: 'Wij werken voornamelijk met Europees eikenhout, notenhout, en kersenhout. Al ons hout is FSC-gecertificeerd en komt uit duurzaam beheerde bossen.',
  },
  {
    category: 'Product & Kwaliteit',
    question: 'Hoe onderhoud ik mijn houten meubels?',
    answer: 'Voor dagelijks onderhoud is afstoffen met een zachte doek voldoende. Wij adviseren 2x per jaar te behandelen met natuurlijke meubelwas. Vermijd direct zonlicht en felle schoonmaakmiddelen.',
  },
  {
    category: 'Product & Kwaliteit',
    question: 'Krijg ik garantie op mijn meubels?',
    answer: 'Ja, alle meubels hebben 10 jaar garantie op constructiefouten en materiaalgebreken. Normale slijtage valt hier niet onder. Zie onze Kwaliteitsgarantie pagina voor details.',
  },
  {
    category: 'Retour & Ruilen',
    question: 'Kan ik mijn bestelling retourneren?',
    answer: 'Standaard producten kunnen binnen 30 dagen retour, mits onbeschadigd en in originele verpakking. Voor maatwerk gelden andere voorwaarden. Retourkosten zijn voor de klant.',
  },
  {
    category: 'Retour & Ruilen',
    question: 'Wat als mijn product beschadigd wordt geleverd?',
    answer: 'Controleer uw levering altijd direct bij de bezorger. Bij schade kunt u de levering weigeren of noteer de schade op de vrachtbrief. Neem binnen 24 uur contact met ons op.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = Array.from(new Set(faqs.map(f => f.category)));

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-oak-800 text-cream-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Veelgestelde Vragen</h1>
          <p className="text-xl text-cream-200 max-w-3xl leading-relaxed">
            Hier vindt u antwoorden op de meest gestelde vragen over onze producten, bestellen, levering en meer.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-oak-900 mb-6 pb-2 border-b-2 border-oak-200">
              {category}
            </h2>
            <div className="space-y-4">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div key={globalIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-cream-50 transition-colors"
                      >
                        <span className="font-semibold text-oak-900 pr-8">{faq.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-oak-600 flex-shrink-0 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6">
                          <p className="text-oak-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        <div className="bg-oak-50 rounded-lg p-8 mt-12 text-center">
          <h3 className="text-2xl font-serif font-bold text-oak-900 mb-4">Staat uw vraag er niet bij?</h3>
          <p className="text-oak-700 mb-6">
            Neem gerust contact met ons op. Ons klantenservice team helpt u graag verder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+31201234567"
              className="px-6 py-3 bg-oak-800 text-cream-50 rounded-lg font-semibold hover:bg-oak-700 transition-colors"
            >
              Bel +31 (0)20 123 4567
            </a>
            <a
              href="mailto:info@meubelmakerij.nl"
              className="px-6 py-3 bg-white text-oak-800 border-2 border-oak-800 rounded-lg font-semibold hover:bg-oak-50 transition-colors"
            >
              Email Ons
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
