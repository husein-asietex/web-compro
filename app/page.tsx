import LocalizedHome from "@/features/site/pages/localized-home-page";
import { defaultLocale } from "@/lib/i18n";

/** Render the localized home page at `/` using the default locale. */
export default function HomePage() {
  return (
    <LocalizedHome
      params={Promise.resolve({ locale: defaultLocale })}
      searchParams={Promise.resolve({})}
    />
  );
}
