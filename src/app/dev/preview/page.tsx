import { notFound } from "next/navigation";
import { Suspense } from "react";
import PreviewClient from "./PreviewClient";

export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <Suspense>
      <PreviewClient />
    </Suspense>
  );
}
