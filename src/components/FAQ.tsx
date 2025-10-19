export default function FAQ() {
  const faqs: { question: string; answer: string }[] = [
    {
      question: 'Hoeveel inschrijvingen mag ik maximaal hebben?',
      answer: 'Je mag maximaal 3 keuzemodules kiezen. Als je al 3 modules hebt gekozen, kun je niet meer inschrijven. Je kunt wel een bestaande inschrijving verwijderen om ruimte te maken voor een andere module.',
    },
    {
      question: 'Kan ik meerdere eerste keuzes hebben?',
      answer: 'Nee, je kunt maar één eerste keuze hebben. Als je een andere module als eerste keuze selecteert, wordt de vorige eerste keuze automatisch gewist.',
    },
    {
      question: 'Kan ik een tweede of derde keuze aangeven?',
      answer: 'Momenteel kun je alleen een eerste keuze aangeven. Tweede en derde keuzes worden bepaald door de volgorde waarin je inschrijft, maar je kunt deze niet expliciet instellen.',
    },
    {
      question: 'Hoe verwijder ik een inschrijving?',
      answer: 'Ga naar "Mijn inschrijvingen" en klik op de "Verwijder" knop naast de module die je wilt verwijderen. Je krijgt een bevestiging voordat de inschrijving definitief wordt verwijderd.',
    },
    {
      question: 'Kan ik een keuzemodule zelf aanmaken of bewerken?',
      answer: 'Nee, studenten kunnen alleen keuzemodules bekijken en zich inschrijven. Het aanmaken en bewerken van modules is alleen mogelijk voor docenten/administrators.',
    },
    {
      question: 'Hoe weet ik of mijn eerste keuze is opgeslagen?',
      answer: 'In "Mijn inschrijvingen" zie je "(Eerste keuze)" staan bij de module die je als eerste keuze hebt aangegeven. Als je de pagina vernieuwt, blijft deze status zichtbaar.',
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 16px' }}>
      <h2 style={{ textAlign: 'left', marginBottom: 24, color: '#2193b0', fontWeight: 700, fontSize: '2rem', textShadow: '0 2px 8px rgba(33,147,176,0.12)' }}>Veelgestelde vragen (FAQ)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: '#f9f9f9', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#2193b0', marginBottom: 12, fontSize: '1.2rem', fontWeight: 600 }}>{faq.question}</h3>
            <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
