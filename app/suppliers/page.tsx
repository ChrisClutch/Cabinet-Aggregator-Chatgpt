import CompanyDirectory from "@/components/company-directory";
import { Directory } from "@/components/marketplace";
export const metadata = { title: "Find commercial cabinet suppliers" };
export default function Page() {
  return <><CompanyDirectory /><Directory /></>;
}
