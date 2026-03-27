#!/usr/bin/env node
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) { console.error('MONGODB_URI required'); process.exit(1); }

const BlogPostSchema = new mongoose.Schema({
  title: String, slug: String, featured: Boolean, featuredOrder: Number,
}, { timestamps: true, strict: false });

// Curated picks — substantive essays with broad appeal
const featuredSlugs = [
  { slug: 'the-most-important-things-i-ve-learned-as-a-freelancing-generalist', order: 1 },
  { slug: 'extreme-ownership-and-the-things-to-think-about-when-applying-it', order: 2 },
  { slug: 'a-decision-is-a-decision-is-a-decision', order: 3 },
  { slug: 'there-s-creativity-in-everyone-find-it', order: 4 },
  { slug: 'radical-responsibility', order: 5 },
];

async function main() {
  await mongoose.connect(MONGODB_URI);
  const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

  // Reset all featured flags first
  await BlogPost.updateMany({}, { $set: { featured: false, featuredOrder: 0 } });

  for (const { slug, order } of featuredSlugs) {
    const result = await BlogPost.updateOne(
      { slug },
      { $set: { featured: true, featuredOrder: order } },
    );
    const post = await BlogPost.findOne({ slug }).select('title');
    console.log(
      result.modifiedCount ? '  [ok]' : '  [skip]',
      `#${order}`, post?.title || slug,
    );
  }

  await mongoose.disconnect();
  console.log(`\nMarked ${featuredSlugs.length} posts as featured.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
