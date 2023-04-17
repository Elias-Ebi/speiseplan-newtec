/// <reference types="cypress" />

describe('visit app', () => {

  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit('http://localhost:4200');
    // cy.pause();
    cy.get('#login-email-input').type(`test@cypress.de`);
    cy.get('#login-password-input').type(`cypress`);
    cy.get('button').contains('Login').click();
  })

  it('use buyer filter', () => {
    cy.visit('http://localhost:4200/admin/order-management');
    cy.wait(1000);
  })

});
