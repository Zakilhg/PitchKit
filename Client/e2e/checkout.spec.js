import { expect, test } from "@playwright/test";

// The demo accounts DemoUserSeeder creates (see the README's test accounts).
const CUSTOMER = { email: "fan@pitchkit.test", password: "pitchkit-demo" };

const ADDRESS = {
  "Full name": "Sam Tester",
  Address: "1 Test Street",
  City: "Testville",
  "Postal code": "10000",
};

const apiOrigin = () => test.info().config.metadata.apiOrigin;

/** A jersey with at least two shirts left in size M, read straight from the API. */
const pickJersey = async (request) => {
  const response = await request.get(`${apiOrigin()}/api/jerseys`, {
    headers: { Accept: "application/json" },
  });
  expect(response.ok()).toBeTruthy();
  const { data } = await response.json();
  const jersey = data.find((j) => (j.sizes?.M ?? 0) >= 2);
  expect(jersey, "the seeded catalog has a jersey in stock in size M").toBeTruthy();
  return jersey;
};

const stockInM = async (request, id) => {
  const response = await request.get(`${apiOrigin()}/api/jerseys/${id}`, {
    headers: { Accept: "application/json" },
  });
  expect(response.status(), `GET /api/jerseys/${id}`).toBe(200);
  return (await response.json()).data.sizes.M;
};

const addToBag = async (page, jersey) => {
  await page.goto(`/p/${jersey.id}`);
  await expect(page.getByRole("heading", { level: 1, name: jersey.name })).toBeVisible();
  await page.getByRole("radio", { name: "Size M" }).click();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("button", { name: /^Bag, 1 item/ })).toBeVisible();
};

const fillCheckout = async (page, email) => {
  await page.goto("/checkout");
  await expect(page.getByRole("heading", { level: 1, name: "Checkout" })).toBeVisible();
  await page.getByLabel("Email").fill(email);
  for (const [label, value] of Object.entries(ADDRESS)) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await page.getByRole("button", { name: /^Continue to payment/ }).click();
  await expect(page).toHaveURL(/\/checkout\/pay\//);
  await expect(page.getByText("Test mode")).toBeVisible();
};

test("a signed-in customer buys a jersey and finds the order in their account", async ({
  page,
  request,
}) => {
  const jersey = await pickJersey(request);
  const before = await stockInM(request, jersey.id);

  await page.goto("/login");
  await page.getByLabel("Email").fill(CUSTOMER.email);
  await page.getByLabel("Password", { exact: true }).fill(CUSTOMER.password);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/account$/);

  await addToBag(page, jersey);
  await fillCheckout(page, CUSTOMER.email);

  // Placing the order holds the stock before anything is paid.
  expect(await stockInM(request, jersey.id)).toBe(before - 1);

  await page.getByRole("button", { name: /^Pay / }).click();
  await expect(page).toHaveURL(/\/order\//);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/You're all set/);
  const reference = (await page.getByText(/^Order PK-\d+$/).textContent()).replace("Order ", "");

  // A paid order empties the bag and shows up in the account.
  await expect(page.getByRole("button", { name: /^Bag, 0 items/ })).toBeVisible();
  await page.goto("/account");
  await expect(page.getByText(reference)).toBeVisible();
  expect(await stockInM(request, jersey.id)).toBe(before - 1);
});

test("a declined payment can be retried, and cancelling gives the stock back", async ({
  page,
  request,
}) => {
  const jersey = await pickJersey(request);
  const before = await stockInM(request, jersey.id);

  await addToBag(page, jersey);
  await fillCheckout(page, "guest@pitchkit.test");
  expect(await stockInM(request, jersey.id)).toBe(before - 1);

  // A decline keeps the order open on the pay page with an explanation.
  await page.getByRole("button", { name: "Simulate a declined payment" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page).toHaveURL(/\/checkout\/pay\//);

  // Cancelling goes back to the bag, which still has the jersey, and frees the stock.
  await page.getByRole("button", { name: "Cancel and return to your bag" }).click();
  await expect(page).toHaveURL(/\/bag$/);
  await expect(page.getByRole("button", { name: /^Bag, 1 item/ })).toBeVisible();
  await expect.poll(() => stockInM(request, jersey.id)).toBe(before);
});
