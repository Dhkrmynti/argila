import { redirect } from "next/navigation";

// The old protocol specification page now lives in the docs.
export default function ProtocolPage() {
  redirect("/docs");
}
