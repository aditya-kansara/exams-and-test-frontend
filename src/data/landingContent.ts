export const CONTACT_EMAIL = 'admin@examsandtest.com'

export const SOCIAL_LINKS = [
  {
    id: 'facebook',
    label: 'Facebook',
    href: 'https://www.facebook.com/share/g/1LMqc58qrW/',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/examsandtest?igsh=NHNvOHlvazNxbzE5',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://chat.whatsapp.com/Du1jPKWvthL6XmODfBQmMn?mode=gi_t',
  },
  {
    id: 'twitter',
    label: 'X (Twitter)',
    href: 'https://x.com/ExamsAndTests',
  },
  {
    id: 'telegram',
    label: 'Telegram',
    href: 'https://t.me/+fwWDoWkXq2YxODFl',
  },
] as const

export const LANDING_FAQ = [
  {
    id: 'adaptive',
    question: 'What is adaptive testing?',
    answer:
      'Adaptive testing adjusts question difficulty based on how you perform. When you answer correctly, the exam tends to present harder items; when you struggle, it eases off so your ability can be estimated more accurately. Every question contributes to a focused picture of your strengths and gaps—not just a raw score.',
  },
  {
    id: 'report',
    question: 'What do I get in the paid report?',
    answer:
      'The paid report unlocks a full review of your attempt: your score and performance breakdown, every question you answered with the correct option highlighted, written explanations, and images where the item includes them. It is designed to mirror the kind of insight you need to study efficiently after a mock exam.',
  },
  {
    id: 'payment-unlock',
    question:
      'My payment went through, but the report and explanations are still locked. What should I do?',
    answer:
      'In rare cases, payment is confirmed before your report unlocks in our system. If you have paid and still cannot open your full report or explanations, reach out on any channel in Connect with us—Facebook, Instagram, WhatsApp, Telegram, or X. Include the email on your account and, if you have it, your payment or attempt reference. Our team will verify your payment and restore access as quickly as possible.',
  },
  {
    id: 'sign-in',
    question: 'How do I sign in?',
    answer:
      'Create an account with Google from the Register or Log in page. New users complete a quick password setup so you can also sign in with email and password later. Once signed in, you can start a practice exam from your dashboard.',
  },
  {
    id: 'duration',
    question: 'How long is the exam?',
    answer:
      'Practice exams follow a realistic AMC-style session: about 3.5 hours on the clock with a full-length question set (120 items in our standard configuration). Timing and navigation are built to feel like the real MCQ flow so you can practise pacing, not just content.',
  },
] as const

export const LANDING_REVIEWS = [
  {
    id: 'review-1',
    quote:
      'I really liked the explanation and the exam format. The portal is made really well and I would recommend this to all my peers.',
    author: 'Dr. Babu',
  },
  {
    id: 'review-2',
    quote: 'It was really useful. It was wonderful.',
    author: 'Dr. Ansari',
  },
  {
    id: 'review-3',
    quote:
      'On my first attempt at AMC Part 1, I could not pass. I then started giving mocks on Exams And Test. At first I was not scoring enough to pass here either, but after preparing my weaker areas using the explanations, I passed after four to five mocks. I then booked my actual exam—and I passed that too. Very grateful to the platform.',
    author: 'Dr. Patel',
  },
] as const
