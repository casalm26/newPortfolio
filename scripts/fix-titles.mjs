#!/usr/bin/env node
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI required'); process.exit(1); }

const BlogPostSchema = new mongoose.Schema({
  title: String, slug: String, seoTitle: String,
}, { timestamps: true, strict: false });

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const fixes = [
  { oldSlug: 'together-and-alone-are-often-seen-as-binary-opposites-and-quite-often-connected-to-whether-you-re', newTitle: 'Together and alone' },
  { oldSlug: 'i-realised-a-couple-of-days-ago-that-i-ve-been-sucked-in-to-the-work-i-m-doing-not-giving-other', newTitle: 'Working a lot, but rarely being busy' },
  { oldSlug: 'we-want-what-we-want-because-we-want-to-feel-the-way-we-think-we-re-going-to-feel-when-we-have', newTitle: 'We want what we want' },
  { oldSlug: 'i-had-a-friend-over-at-my-office-the-other-day-mainly-to-hang-out-but-just-as-well-for-talking', newTitle: 'Why we have to stop believing all of the things we think' },
  { oldSlug: 'a-majority-of-the-developed-worlds-school-systems-are-allocating-a-lot-of-resources-to-making-the', newTitle: 'How to get much more worth out of your work' },
  { oldSlug: 'to-me-it-s-quite-clear-that-most-people-who-are-in-the-educational-system-today-regardless-if', newTitle: "What's the problem we're trying to solve with today's educational system?" },
  { oldSlug: 'don-t-be-fooled-in-to-believing-creativity-is-some-magic-kind-of-superpower-that-some-people-were', newTitle: "There's creativity in everyone. Find it." },
  { oldSlug: 'en-valig-misstollkning-av-platta-eller-hierarkil-sa-organisationer-r-att-de-inte-beh-ver-n-gon', newTitle: 'Om platta organisationer' },
  { oldSlug: 'i-veckan-s-skrev-mark-zuckerberg-ett-inl-gg-p-facebook-om-att-facebook-inte-ska-handla-om-att', newTitle: 'Facebook och politiken' },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

  for (const fix of fixes) {
    const newSlug = generateSlug(fix.newTitle);
    const result = await BlogPost.updateOne(
      { slug: fix.oldSlug },
      { $set: { title: fix.newTitle, slug: newSlug, seoTitle: fix.newTitle } },
    );
    console.log(
      result.modifiedCount ? '  [ok]' : '  [skip]',
      fix.oldSlug, '->', fix.newTitle, `(${newSlug})`,
    );
  }

  await mongoose.disconnect();
  console.log('\nDone!');
}

main().catch((e) => { console.error(e); process.exit(1); });
