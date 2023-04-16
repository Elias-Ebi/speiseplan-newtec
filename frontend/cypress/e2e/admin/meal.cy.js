/// <reference types="cypress" />

const mealNameAdd = 'Montag-Test';
const mealNameEdit = 'Montag-TestEdit';

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

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
    cy.get('p').contains('Zu Admin wechseln').click();
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
  */

/*
  it('add meal', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);

    //navigate to next week, because there it is always possible to add a meal on monday
    cy.get('.arrow-button').last().click();

    // count elemets: to check if the number of saved meals is really one higher when 'save' button was clicked
    cy.wait(2000);

    let countOfElements = 0;

    cy.get("div.mat-mdc-tab").eq(1).click(); // click on tuesday tab

    cy.get('#table-tuesday').find('tr').then($elements => {
      countOfElements = $elements.length;
    }).then(() => {

      cy.get('button').contains('Gericht hinzufügen').click();
      cy.get('#save').should('be.disabled');

      cy.get('#meal-name').first().type(mealNameAdd);
      cy.get('#save').should('be.disabled');

      cy.get('#meal-description').first().type('Beschreibung-Test');
      cy.get('#save').should('be.disabled');

      cy.get('#meal-category').first().click(); // opens the drop down

      // simulate click event on the drop down item (mat-option)
      cy.get('mat-option').contains('Vegetarisch').click();  // this is jquery click() not cypress click()
      cy.get('#save').should('be.not.disabled');

      cy.get('#save').click();

      cy.get('#table-tuesday').find('tr').should('have.length', countOfElements++);
    });
  })


  it('edit meal', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);

    //navigate to next week, because there it is always possible to add a meal on monday
    cy.get('.arrow-button').last().click();

    cy.get("div.mat-mdc-tab").eq(1).click(); // click on tuesday tab

    cy.get('table') // Wählen Sie die Tabelle aus
    .contains('tr', mealNameAdd) // Suchen Sie die Zeile, die den bestimmten Text enthält
    .find('.meal-edit-button') // Wählen Sie den Button innerhalb dieser Zeile aus
    .click() // Klicken Sie auf den Button

    cy.get('#save').should('be.enabled');

    cy.get('#meal-name').first().clear().type(mealNameEdit);
    cy.get('#save').should('be.enabled');

    cy.get('#meal-description').first().clear().type('Beschreibung-TestEdit');
    cy.get('#save').should('be.enabled');

    cy.get('#meal-category').first().click(); // opens the drop down

    // simulate click event on the drop down item (mat-option)
    cy.get('mat-option').contains('Fleisch').click();  // this is jquery click() not cypress click()
    cy.get('#save').should('be.not.disabled');

    cy.get('#save').click();

    cy.get('table') // Wählen Sie die Tabelle aus
    .contains('tr', mealNameEdit) // Suchen Sie die Zeile, die den bestimmten Text enthält
    .should('exist')
  })


  it('delete meal', () => {
    cy.visit('http://localhost:4200/admin/meal-management');
    cy.wait(1000);

    //navigate to next week, because there it is always possible to add a meal on monday
    cy.get('.arrow-button').last().click();

    cy.get("div.mat-mdc-tab").eq(1).click(); // click on tuesday tab

    cy.get('table') // Wählen Sie die Tabelle aus
    .contains('tr', mealNameEdit) // Suchen Sie die Zeile, die den bestimmten Text enthält
    .find('.meal-delete-button') // Wählen Sie den Button innerhalb dieser Zeile aus
    .click(); // Klicken Sie auf den Button

    cy.get('button').last().click();

    cy.get('table') // Wählen Sie die Tabelle aus
    .contains('tr', mealNameEdit) // Suchen Sie die Zeile, die den bestimmten Text enthält
    .should('not.exist')
  })
*/

// [#]===============================[ DATE & TIME TESTS ]===============================[#]

  it('check month transition', () => {
    const dateIncurrentMonth = new Date(2023, 2, 30); // this is a  thursday, the next week is another month
    cy.log('realToDate: ', dateIncurrentMonth)
    cy.clock(dateIncurrentMonth);

    cy.visit('http://localhost:4200/admin/meal-management');

    cy.wait(2000);

    cy.get('.arrow-button').last().click({force: true}); // the next week is in a new month

    cy.wait(2000);

    cy.get("div.mat-mdc-tab").eq(0).click({force: true});

    cy.wait(2000);

    cy.log('CYPRESS: click add meal button')

    cy.get('button').contains('Gericht hinzufügen').click({force: true});
    cy.get('#meal-delivery-date').should('have.value', '3.4.2023'); // First Monday in new month
    cy.get('#meal-orderable-date').should('have.value', '31.3.2023'); // The friday before

    cy.log('CYPRESS: tab selected')
    /*
    cy.get('mat-tab-group mat-tab-header').contains('Montag').click().then(() => {
      cy.get('mat-tab-group').trigger('selectedTabChange', {tab: 'Montag'});
    });
    */
   // cy.get('div[role=tab]').eq(0).click({ timeout: 2000, force: true }); // open monday tab
  })


  /*

  // Lieferdatum liegt hinter dem Bestellbarkeitsdatum (Bestellungsdatum auf den Montag der vergangenen Woche)
  // Bestelldatum an einem Wochenende
  // Lieferdatum muss ungleich bestellbarkeitsdatum sein
  it('check date requirements', () => {


  })

  it('check calendar week thursday', () => {
    let fakeTodayAsThursday = new Date(2023, 2, 2); // this is a  thrusday
    cy.log('realToDate: ', fakeTodayAsThursday)
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
    cy.log('realToDate: ', fakeTodayAsMonday)
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
    cy.log('realToDate: ', fakeTodayAsFriday)
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
    cy.log('realToDate: ', fakeTodayAsThursday)
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
    cy.log('realToDate: ', fakeTodayAsWednesday)
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
        * not possible to go to passed week ✔
        * only two weeks into the future ✔
        * tab is not accessible if the day in current week has passed ✔

      Adding dishes
        * Adding meal correctly
        * if a meal is generated, it has to be listed in the given kw & tab (multiple meals on same day, check badge)
        * edit meal
        * delete meal (delete all meals that were added before?)

        * Check if tabs work properly when current day is on a weekend

        * adding the same meal twice
        * check if confirmation button is disabled if it shoul be (one input field missing, contradicting date/time )
        * is it possible to input something into the input fields, that should not be possible?
        * canceling the adding process

        * Check if orderabledate and deliverydate are set properly on month and year transitions

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
