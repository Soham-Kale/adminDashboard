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

export function transformNotionPageToSubscriber(page: PageObjectResponse): Subscriber {
  const props = page.properties;
  return {
    userSubscriptionId:    page.id,
    userName:              getText(props["User Name"] ?? props["Name"]),
    email:                 getText(props["Email"]),
    planName:              getText(props["Plan Name"]) || getSelect(props["Plan Type"]) || "Pro Monthly",
    planCode:              getText(props["Plan Code"]) || "pro_m",
    billingCycle:          (getSelect(props["Billing Cycle"]) || getSelect(props["Plan Type"]) || "monthly") as Subscriber["billingCycle"],
    currency:              getText(props["Currency"]) || "USD",
    subscriptionStatus:    (getSelect(props["Subscription Status"]) || "active") as Subscriber["subscriptionStatus"],
    trialStatus:           (getSelect(props["Trial Status"]) || "none") as Subscriber["trialStatus"],
    provider:              getText(props["Provider"]) || getSelect(props["Provider"]) || "stripe",
    subscriptionStartDate: getDate(props["Subscription Start Date"]) ?? page.created_time.split("T")[0],
    renewalDate:           getDate(props["Renewal Date"]),
    accessEndDate:         getDate(props["Access End Date"]),
    createdAt:             page.created_time.split("T")[0],
  };
}

export function transformNotionPages(pages: PageObjectResponse[]): Subscriber[] {
  return pages.map(transformNotionPageToSubscriber);
}
