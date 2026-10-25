import type { Metadata } from "next";
import { PageHeader } from "@/components/admin";
import { ImageUploader } from "@/components/image-uploader";
import { requireRole, STAFF_ROLES } from "@/lib/auth/session";
import { formatDateTime } from "@/lib/format";
import { listImages } from "@/lib/media";

export const metadata: Metadata = { title: "Images" };

export default async function MediaPage() {
  await requireRole(STAFF_ROLES);
  const images = await listImages();
  return (
    <div>
      <PageHeader title="Images">
        Diagrams and pictures for questions, notes and posts. Copy an image&apos;s line and paste it
        where the picture should appear.
      </PageHeader>
      <ImageUploader />
      {images.length === 0 ? (
        <p className="text-sm text-slate-600">No images yet.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image) => (
            <li key={image.id} className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
              <div className="flex h-32 items-center justify-center rounded bg-slate-50">
                {/* eslint-disable-next-line @next/next/no-img-element -- served from our own /media route */}
                <img
                  src={`/media/${image.id}`}
                  alt={image.name}
                  loading="lazy"
                  className="max-h-32 max-w-full"
                />
              </div>
              <p className="mt-2 truncate font-medium" title={image.name}>
                {image.name}
              </p>
              <p className="text-xs text-slate-500">
                {Math.ceil(image.size / 1024)} KB · {formatDateTime(image.createdAt)}
              </p>
              <code className="mt-2 block overflow-x-auto rounded bg-slate-50 px-2 py-1 text-xs">
                {image.markdown}
              </code>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
