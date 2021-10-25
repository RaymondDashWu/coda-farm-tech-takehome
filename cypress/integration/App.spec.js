import fields from "../../src/api/fields.json";
describe("App", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Renders a map", () => {
    cy.get("#main-map");
  });

  it("Renders a polygon for each field", () => {
    fields.forEach((field) => {
      cy.get("#main-map").should("contain", field.field_name);
    });
  });

  it("Opens a sliding card when the user clicks a field", () => {
    cy.get(`[title=sims-field]`).click();
    cy.get("#field-card").should("contain", "Sims Field");
  });
});
