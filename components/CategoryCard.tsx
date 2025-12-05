import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  image?: string; // URL for main category image
}

export default function CategoryCard({ title, slug, image }: Props) {
  return (
    <Link href={`/categories/${slug}`}>
      <div className="p-4 border rounded-xl flex flex-col items-center hover:shadow-md transition">
        {image && (
          <Image
            src={image}
            alt={title}
            width={80}
            height={80}
            className="rounded-xl object-cover"
          />
        )}

        <h3 className="mt-2 text-center font-medium">{title}</h3>
      </div>
    </Link>
  );
}
