import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Subscriber } from "@/types/subscription";

type NotionPropertyValue = PageObjectResponse["properties"][string];

function getText(prop: NotionPropertyValue): string {
  if (prop.type === "title") return prop.title[0]?.plain_text ?? "";
  if (prop.type === "rich_text") return prop.rich_text[0]?.plain_text ?? "";
  if (prop.type === "email") return prop.email ?? "";
  return "";
}

function getSelect(prop: NotionPropertyValue): string {
  if (prop.type === "select") return prop.select?.name ?? "";
  return "";
}

function getDate(prop: NotionPropertyValue): string | null {
  if (prop.type === "date") return prop.date?.start ?? null;
  return null;
}

function getNumber(prop: NotionPropertyValue): number {
  if (prop.type === "number") return prop.number ?? 0;
  return 0;
}

export function transformNotionPageToSubscriber(page: PageObjectResponse): Subscriber {
  const props = page.properties;
  return {
    id: page.id,
    userName: getText(props["User Name"] ?? props["Name"]),
    email: getText(props["Email"]),
    planType: (getSelect(props["Plan Type"]) || "monthly") as Subscriber["planType"],
    subscriptionStatus: (getSelect(props["Subscription Status"]) || "active") as Subscriber["subscriptionStatus"],
    trialStatus: (getSelect(props["Trial Status"]) || "none") as Subscriber["trialStatus"],
    subscriptionStartDate: getDate(props["Subscription Start Date"]) ?? page.created_time.split("T")[0],
    renewalDate: getDate(props["Renewal Date"]),
    cancellationDate: getDate(props["Cancellation Date"]),
    accessEndDate: getDate(props["Access End Date"]),
    revenue: getNumber(props["Revenue"]),
    country: getText(props["Country"]),
    deviceType: (getSelect(props["Device Type"]) || "mobile") as Subscriber["deviceType"],
    referralSource: getText(props["Referral Source"]),
    paymentStatus: (getSelect(props["Payment Status"]) || "paid") as Subscriber["paymentStatus"],
    createdAt: page.created_time.split("T")[0],
  };
}

export function transformNotionPages(pages: PageObjectResponse[]): Subscriber[] {
  return pages.map(transformNotionPageToSubscriber);
}
