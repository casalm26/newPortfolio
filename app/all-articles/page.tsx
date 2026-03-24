import { redirect } from "next/navigation";
import { genPageMetadata } from "app/seo";

export const metadata = genPageMetadata({ title: "Blog" });

export default function BlogPage() {
  redirect("/");
}
