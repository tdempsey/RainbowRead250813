import { storage } from './storage';
import type { InsertArticle, InsertRssSource } from '@shared/schema';

export async function loadDummyData() {
  console.log('Loading dummy data...');

  // Sample LGBTQ+ articles with diverse content
  const dummyArticles: InsertArticle[] = [
    {
      title: "Supreme Court Upholds Marriage Equality in Landmark Decision",
      excerpt: "In a historic 6-3 ruling, the Supreme Court reinforced marriage equality protections, rejecting attempts to roll back LGBTQ+ rights.",
      content: "The Supreme Court delivered a resounding victory for LGBTQ+ rights today, upholding marriage equality in a decisive 6-3 ruling. The case, which challenged existing protections, was met with overwhelming support from civil rights organizations nationwide. Justice Roberts, writing for the majority, emphasized that 'love is love' and constitutional protections apply to all Americans regardless of sexual orientation or gender identity.",
      url: "https://example.com/supreme-court-marriage-equality",
      imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80",
      category: "politics",
      tags: ["Supreme Court", "Marriage Equality", "Civil Rights", "Legal Victory"],
      author: "Sarah Chen",
      source: "Pride Legal News",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Pride Month Celebrations Draw Record Crowds Worldwide",
      excerpt: "Cities across the globe report unprecedented attendance at Pride events, marking a significant milestone for LGBTQ+ visibility and acceptance.",
      content: "Pride Month 2024 has shattered attendance records worldwide, with over 5 million people participating in celebrations across major cities. From New York's iconic parade to London's colorful festivities, the month has been marked by increased corporate sponsorship, political support, and community engagement. Organizers report that younger generations are driving much of the growth, with Gen Z and millennial participants making up over 60% of attendees.",
      url: "https://example.com/pride-month-record-crowds",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
      category: "community",
      tags: ["Pride Month", "Celebration", "Visibility", "Community"],
      author: "Alex Rivera",
      source: "Global Pride Network",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Breakthrough Study Shows Mental Health Benefits of Affirming Care",
      excerpt: "New research from Johns Hopkins reveals significant mental health improvements among transgender youth receiving gender-affirming healthcare.",
      content: "A comprehensive study published in the Journal of Medical Ethics demonstrates substantial mental health benefits for transgender youth receiving gender-affirming care. The five-year longitudinal study followed 2,000 participants and found dramatic reductions in depression, anxiety, and suicidal ideation among those with access to appropriate healthcare. Lead researcher Dr. Maria Santos emphasized that the findings underscore the critical importance of accessible, affirming medical care for transgender individuals.",
      url: "https://example.com/gender-affirming-care-study",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
      category: "health",
      tags: ["Mental Health", "Transgender", "Healthcare", "Research", "Youth"],
      author: "Dr. Michael Thompson",
      source: "Medical Pride Journal",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Major Tech Companies Announce Expanded LGBTQ+ Benefits",
      excerpt: "Leading technology firms collectively announce comprehensive benefit packages specifically designed to support LGBTQ+ employees and their families.",
      content: "In a coordinated announcement, major technology companies including Apple, Google, Microsoft, and Amazon unveiled expanded benefit packages for LGBTQ+ employees. The new benefits include comprehensive gender transition support, fertility assistance for same-sex couples, mental health resources, and extended family leave policies. The initiative, developed in partnership with LGBTQ+ advocacy groups, represents the largest corporate commitment to LGBTQ+ employee welfare in tech industry history.",
      url: "https://example.com/tech-companies-lgbtq-benefits",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      category: "business",
      tags: ["Technology", "Corporate Benefits", "Workplace Equality", "Employee Rights"],
      author: "Jordan Kim",
      source: "Tech Diversity Report",
      sourceType: "newsapi",
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Acclaimed Director Releases Groundbreaking LGBTQ+ Documentary",
      excerpt: "Award-winning filmmaker Maria Santos premieres her latest documentary exploring the intersection of faith and LGBTQ+ identity in rural America.",
      content: "Renowned director Maria Santos has released 'Faith and Love,' a powerful documentary that examines the experiences of LGBTQ+ individuals in religious communities across rural America. The film, which premiered at Sundance to standing ovations, features intimate portraits of families navigating the complex intersection of faith, tradition, and sexual identity. Critics are calling it a masterpiece of empathy and understanding that bridges divides and opens hearts.",
      url: "https://example.com/faith-and-love-documentary",
      imageUrl: "https://images.unsplash.com/photo-1489537235181-fc05daed5805?w=800&q=80",
      category: "culture",
      tags: ["Documentary", "Faith", "Rural America", "Film", "Sundance"],
      author: "Elena Rodriguez",
      source: "Independent Film Quarterly",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Historic LGBTQ+ Community Center Opens in Small Town Mississippi",
      excerpt: "The town of Jackson Creek, Mississippi, celebrates the opening of its first LGBTQ+ community center, marking a significant milestone for the region.",
      content: "After three years of grassroots organizing and fundraising, Jackson Creek, Mississippi, has opened its first LGBTQ+ community center. The Rainbow Haven Center will provide support groups, educational resources, and safe spaces for LGBTQ+ individuals and allies in the rural Deep South. Local organizer Jamie Patterson expressed hope that the center will serve as a model for other small towns looking to create inclusive communities.",
      url: "https://example.com/mississippi-lgbtq-center",
      imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
      category: "community",
      tags: ["Community Center", "Mississippi", "Rural LGBTQ+", "Support", "Milestone"],
      author: "Marcus Johnson",
      source: "Southern Pride Network",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Olympic Committee Announces Inclusive Policies for Transgender Athletes",
      excerpt: "The International Olympic Committee releases comprehensive guidelines ensuring fair and inclusive participation for transgender and intersex athletes.",
      content: "The International Olympic Committee has unveiled new policies designed to create fair and inclusive competition for transgender and intersex athletes. The guidelines, developed in consultation with athletes, scientists, and LGBTQ+ advocates, emphasize individual assessment over blanket restrictions. IOC President Thomas Bach stated that the new policies reflect the organization's commitment to both competitive integrity and human dignity.",
      url: "https://example.com/olympic-transgender-policy",
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
      category: "politics",
      tags: ["Olympics", "Transgender Athletes", "Sports Policy", "Inclusion", "IOC"],
      author: "Samantha Lee",
      source: "Sports Equality Today",
      sourceType: "newsapi",
      publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000), // 14 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Youth Mental Health Initiative Launches Nationwide LGBTQ+ Program",
      excerpt: "The Trevor Project partners with schools nationwide to implement comprehensive mental health support specifically designed for LGBTQ+ students.",
      content: "The Trevor Project has announced a groundbreaking partnership with school districts across the United States to implement specialized mental health programming for LGBTQ+ students. The initiative, called 'Safe Schools, Strong Minds,' will train counselors, create safe spaces, and provide crisis intervention resources. Early pilot programs have shown remarkable success in reducing bullying and improving overall student wellbeing.",
      url: "https://example.com/trevor-project-schools-initiative",
      imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&q=80",
      category: "health",
      tags: ["Mental Health", "Youth", "Schools", "Trevor Project", "Support"],
      author: "Dr. Ashley Park",
      source: "Youth Mental Health Today",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Broadway's First Trans Lead Actor Makes History in New Musical",
      excerpt: "Transgender performer Casey Williams becomes the first openly trans actor to lead a major Broadway production in the groundbreaking musical 'Becoming.'",
      content: "Broadway history was made last night as Casey Williams took the stage as the lead in 'Becoming,' the first major Broadway musical to feature a transgender performer in the starring role. The show, which tells the story of a young person's journey of self-discovery and gender identity, has been praised by critics as both entertaining and deeply moving. Williams' powerful performance has drawn standing ovations and is already generating Tony Award buzz.",
      url: "https://example.com/broadway-trans-lead-history",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      category: "culture",
      tags: ["Broadway", "Transgender", "Theater", "Representation", "Musical"],
      author: "Theo Martinez",
      source: "Theater Pride Weekly",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Fortune 500 Company Diversity Report Shows Record LGBTQ+ Representation",
      excerpt: "Annual corporate diversity data reveals significant progress in LGBTQ+ representation at executive levels across major American corporations.",
      content: "The latest Fortune 500 diversity report shows unprecedented growth in LGBTQ+ representation at senior leadership levels, with a 40% increase from the previous year. Companies like Johnson & Johnson, IBM, and Salesforce are leading the way with comprehensive diversity initiatives and openly LGBTQ+ executives. The report credits employee resource groups, inclusive hiring practices, and cultural transformation efforts for driving meaningful change in corporate America.",
      url: "https://example.com/fortune-500-lgbtq-representation",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
      category: "business",
      tags: ["Corporate Diversity", "Fortune 500", "Leadership", "Representation", "Workplace"],
      author: "Morgan Davis",
      source: "Business Equality Index",
      sourceType: "newsapi",
      publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "Historic Anti-Discrimination Law Passes in Conservative State",
      excerpt: "Texas becomes the latest state to pass comprehensive LGBTQ+ anti-discrimination legislation, marking a significant shift in regional politics.",
      content: "In a surprising bipartisan vote, Texas has passed the Equality in Employment Act, comprehensive legislation that prohibits discrimination based on sexual orientation and gender identity in employment, housing, and public accommodations. The bill, which passed with support from both Republican and Democratic lawmakers, represents a significant shift in the state's approach to LGBTQ+ rights and reflects changing public opinion across traditional conservative strongholds.",
      url: "https://example.com/texas-anti-discrimination-law",
      imageUrl: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=800&q=80",
      category: "politics",
      tags: ["Anti-Discrimination", "Texas", "Legislation", "Bipartisan", "Employment"],
      author: "Jake Wilson",
      source: "Political Progress Report",
      sourceType: "rss",
      publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
      isLgbtqFocused: true,
    },
    {
      title: "LGBTQ+ Startup Unicorn Reaches $1 Billion Valuation",
      excerpt: "QueerTech, a platform connecting LGBTQ+ professionals and entrepreneurs, becomes the first LGBTQ+-founded company to reach unicorn status.",
      content: "QueerTech, the professional networking platform for LGBTQ+ individuals, has achieved a $1 billion valuation in its latest funding round, making it the first openly LGBTQ+-founded company to reach unicorn status. Founded by married couple Sam Chen and Alex Rodriguez, the platform has grown to serve over 2 million users worldwide, connecting LGBTQ+ professionals, entrepreneurs, and allies. The company plans to use the funding to expand internationally and develop new mentorship programs.",
      url: "https://example.com/queertech-unicorn-valuation",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      category: "business",
      tags: ["Startup", "Unicorn", "Technology", "Entrepreneurship", "Networking"],
      author: "Riley Foster",
      source: "Startup Pride Journal",
      sourceType: "newsapi",
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isLgbtqFocused: true,
    }
  ];

  // Create articles
  for (const articleData of dummyArticles) {
    try {
      await storage.createArticle(articleData);
    } catch (error) {
      console.error(`Error creating article: ${articleData.title}`, error);
    }
  }

  console.log(`Created ${dummyArticles.length} dummy articles`);
}