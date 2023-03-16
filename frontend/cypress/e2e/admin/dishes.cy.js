/// <reference types="cypress" />

describe('visit app', () => {

  /* before('log in', () => {
    cy.visit('http://localhost:4200');
    // cy.pause();
    cy.get('#login-email-input').type(`test@cypress.de`);
    cy.get('#login-password-input').type(`cypress`);
    cy.get('button').contains('Login').click();
  }) */

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

  /*after('log out', () => {
    cy.wait(1000)
   cy.get('p').contains('Logout').click()
  })
*/

/*
  it('navigate to admin view', () => {
    cy.wait(1000)
    cy.get('p').contains('Admin-Bereich').click();
  })

  it('navigate to meal management', () => {
    cy.visit('http://localhost:4200/admin')
    cy.wait(1000)
    cy.get('p').contains('Gerichte').click();
  })

  it('cannot navigate to passed week', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);
    cy.get('.arrow-button').first().should('be.disabled');
  })

  it('can navigate to following week', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);
    cy.get('.arrow-button').last().should('be.not.disabled');
  })

  it('add meal', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);

    //navigate to next week, because there it is always possible to add a meal
    cy.get('.arrow-button').last().click();

    let countOfElements = 0;
    cy.get('#table-monday').find('tr').then($elements => {
      console.log('new length: ',  $elements.length);
      countOfElements = $elements.length;
    }).then(() => {

      cy.get('button').contains('GERICHT HINZUFÜGEN').click();
      cy.get('#create').should('be.disabled');

      cy.get('.dish').first().type('Montag-Test');
      cy.get('#create').should('be.disabled');

      cy.get('.description').first().type('Beschreibung-Test');
      cy.get('#create').should('be.disabled');

      cy.get('.category').first().click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get('mat-option').contains('Vegetarisch').click();  // this is jquery click() not cypress click()
      cy.get('#create').should('be.not.disabled');

      cy.get('#create').click()

      cy.get('#table-monday').find('tr').should('have.length', countOfElements++);
    }) ;
  })
  */

  // Lieferdatum liegt hinter dem Bestellbarkeitsdatum (Bestellungsdatum auf den Montag der vergangenen Woche)
  // Bestelldatum an einem Wochenende
  // Lieferdatum muss ungleich bestellbarkeitsdatum sein
  it('check date requirements', () => {


  })

  it('check calendar week thursday', () => {
    let fakeTodayAsThursday = new Date(2023, 2, 2); // this is a  thrusday
    console.log('realToDate: ', fakeTodayAsThursday)
    cy.clock(fakeTodayAsThursday);

    cy.visit('http://localhost:4200/admin/meal-management')
    cy.wait(1000)

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('have.attr', 'aria-disabled', 'true') // this should be the tuesday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'true') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-disabled', 'true') // this should be the thursday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-selected', 'true') // this should be the friday tab
    cy.get('div[role=tab]').eq(4).should('be.not.disabled'); // this should be the friday tab
  })

  it('check calendar week monday', () => {
    let fakeTodayAsMonday = new Date(2023, 2, 6); // this is a  monday
    console.log('realToDate: ', fakeTodayAsMonday)
    cy.clock(fakeTodayAsMonday);

    cy.visit('http://localhost:4200/admin/meal-management')
    cy.wait(1000)

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('have.attr', 'aria-selected', 'true') // this should be the friday tab
    cy.get('div[role=tab]').eq(1).should('be.not.disabled'); // this should be the friday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'false') // this should be the tuesday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-disabled', 'false') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-disabled', 'false') // this should be the thursday tab

  })


  it('check calendar week friday', () => {
    let fakeTodayAsFriday = new Date(2023, 2, 10); // this is a  friday
    console.log('realToDate: ', fakeTodayAsFriday)
    cy.clock(fakeTodayAsFriday);

    cy.visit('http://localhost:4200/admin/meal-management')
    cy.wait(1000)

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'false') // this should be the monday tab
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('be.not.disabled'); // this should be the tuesday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'false') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-disabled', 'false') // this should be the thursday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-disabled', 'false') // this should be the friday tab

  })



it('calendar week switch selected tab', () => {
  let fakeTodayAsThursday = new Date(2023, 2, 2); // this is a  thrusday
    console.log('realToDate: ', fakeTodayAsThursday)
    cy.clock(fakeTodayAsThursday);

    cy.visit('http://localhost:4200/admin/meal-management')
    cy.wait(1000)

    cy.get('.arrow-button').last().click();
    cy.get('div[role=tab]').eq(1).click();
    cy.get('.arrow-button').first().click();

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('have.attr', 'aria-disabled', 'true') // this should be the tuesday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'true') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-disabled', 'true') // this should be the thursday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-selected', 'true') // this should be the friday tab
    cy.get('div[role=tab]').eq(4).should('be.not.disabled'); // this should be the friday tab
})

it('calendar week switch selected tab', () => {
  let fakeTodayAsWednesday = new Date(2023, 2, 8); // this is a  thrusday
    console.log('realToDate: ', fakeTodayAsWednesday)
    cy.clock(fakeTodayAsWednesday);

    cy.visit('http://localhost:4200/admin/meal-management')
    cy.wait(1000)

    cy.get('.arrow-button').last().click();
    cy.get('div[role=tab]').eq(1).click();
    cy.get('.arrow-button').first().click();

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('have.attr', 'aria-disabled', 'true') // this should be the tuesday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'true') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-disabled', 'false') // this should be the thursday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-selected', 'true') // this should be the friday tab
    cy.get('div[role=tab]').eq(3).should('be.not.disabled'); // this should be the friday tab
})

  // ------- to test: --------
  /*  Switching KW:
        * not possible to go to passed week
        * only two weeks into the future
        * tab is not accessible if the day in current week has passed
        * if a meal is generated, it has to be listed in the given kw & tab

      Adding dsihes
        * Adding meal correctly
        * adding the same meal twice
        * check if confirmation button is disabled if it shoul be (one input field missing, contradicting date/time )
        * is it possible to input something into the input fields, that should not be possible?
        * canceling the adding process

      Adding templates
        * opening the dialog
        * aselecting a template & applying it
        * saving a template
        * is saving as template deactivated if needed?
        * deleting template
        * filter template by category
        * filtering template by searching text
  */

 })
