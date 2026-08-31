import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentFilePath = path.join(process.cwd(), 'src', 'data', 'site_content.json');

const defaultContent = {
  about: {
    title: "About TOKYO JAMES",
    paragraph1: "Representing the fusion of music, literary, culinary and origins, that all together forms the rich and hybrid African and British culture. TOKYO JAMES’s identity combines its ‘Caribbean & African Couture’ spirit, as well as its glance towards Arte Povera’s philosophy, together with a strong sustainability consciousness.",
    paragraph2: "Ina Adenugba is the creative force behind TOKYO JAMES. The designer combines multicultural influences and mastery of tailoring to infuse the label with a distinct notion of luxury. Edgy yet inclusive, creative sight is an extension of personality."
  },
  manifesto: {
    title: "The Manifesto",
    quote: "At TOKYO JAMES we care. We care about fashion, as the golden daughter of all arts. We care about nature, as the golden mother of all arts. Without nature, no arts, nothing.",
    subtext: "Speaking up and acting for cultural identity and environment is an act of respect. Giving back to nature is giving back to the world. This is the idea we have for a better world, this is the idea we have for the TOKYO JAMES world."
  },
  sustainability: {
    title: "Craftsmanship & Sustainability",
    headline: "Giving back through fashion and zero-waste tailoring",
    paragraph: "We are truly connected to our narrative, telling an honest story through our brand and our creations. TOKYO JAMES's collections are run on a Solar punk mindset where technology is leading and emotion and storytelling are vital."
  },
  hero: {
    headline: "DARK WATERS AW24",
    subheadline: "The New Autumn / Winter Runway Collection by Ina Adenugba",
    primaryBtnText: "Details",
    secondaryBtnText: "Full Look Video"
  },
  footer: {
    vatNumber: "VAT: UK080129472",
    copyrightText: "© 2026, TOKYO JAMES World London • Lagos • Paris",
    contactEmail: "concierge@tokyojames.com",
    instagramUrl: "https://instagram.com"
  },
  rates: {
    USD: 1.08,
    GBP: 0.85
  }
};

function readContent() {
  try {
    if (fs.existsSync(contentFilePath)) {
      const raw = fs.readFileSync(contentFilePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading site_content.json:', err);
  }
  return defaultContent;
}

function writeContent(data) {
  try {
    const dir = path.dirname(contentFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(contentFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing site_content.json:', err);
    return false;
  }
}

export async function GET() {
  const content = readContent();
  return NextResponse.json({ success: true, data: content });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const current = readContent();
    const updated = { ...current, ...body };
    const saved = writeContent(updated);
    if (saved) {
      return NextResponse.json({ success: true, message: 'Site content updated successfully!', data: updated });
    } else {
      return NextResponse.json({ success: false, message: 'Failed to write content to disk' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  return PUT(req);
}
