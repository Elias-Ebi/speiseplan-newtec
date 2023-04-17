/// <reference types="cypress" />

describe('visit app', () => {
  const mealNameAdd = 'Spagetti';
  const fakeDate = new Date(2023, 3, 17);
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
    cy.clock(fakeDate);
    addMeal();
    cy.visit('http://localhost:4200/');
    cy.wait(1000);

    // check if meal is displayed for ordering
    cy.get('.card').children('p').invoke('text').then(text => cy.log(text));

    // check if the meal can be ordered

  })

  function addMeal() {
    cy.clock(fakeDate);

    // navigate to admin view and publish new meal
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);
    //navigate to next week, because there it is always possible to add a meal on monday
    // count elemets: to check if the number of saved meals is really one higher when 'save' button was clicked
    cy.get("div.mat-mdc-tab").eq(2).click({force: true}); // click on tuesday tab
    cy.get('button').contains('Gericht hinzufügen').click({force: true});
    cy.get('#save').should('be.disabled');
    cy.wait(1000);
    cy.get('#meal-name').first().type(mealNameAdd, {force: true});
    cy.get('#save').should('be.disabled');
    cy.wait(1000);
    cy.get('#meal-description').first().type('Beschreibung-Test');
    cy.get('#save').should('be.disabled');
    cy.wait(1000);
    cy.get('#meal-category').first().click({force: true}); // opens the drop down
    // simulate click event on the drop down item (mat-option)
    cy.wait(1000);
    cy.get('mat-option').contains('Vegetarisch').click({force: true});  // this is jquery click() not cypress click()
    cy.get('#save').should('be.not.disabled');
    cy.get('#save').click({force: true});
  }

});
