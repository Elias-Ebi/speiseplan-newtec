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


  it('navigate to dish management', () => {
    cy.visit('http://localhost:4200/admin')
    cy.wait(1000)
    cy.get('p').contains('Gerichte').click();
  })

  it('cannot navigate to passed week', () => {
    cy.visit('http://localhost:4200/admin/dish-management');
    cy.wait(1000);
    cy.get('.arrow-button').first().should('be.disabled');
  })

  it('can navigate to following week', () => {
    cy.visit('http://localhost:4200/admin/dish-management');
    cy.wait(1000);
    cy.get('.arrow-button').last().should('be.not.disabled');
  })

  it('add meal', () => {
    cy.visit('http://localhost:4200/admin/dish-management');
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

  /*

  it('check calendar week thursday', () => {
    let fakeTodayAsThursday = new Date(2023, 2, 2); // this is a  thrusday
    console.log('realToDate: ', fakeTodayAsThursday)
    cy.clock(fakeTodayAsThursday);

    cy.visit('http://localhost:4200/admin/dish-management')
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

    cy.visit('http://localhost:4200/admin/dish-management')
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

    cy.visit('http://localhost:4200/admin/dish-management')
    cy.wait(1000)

    // check if aria-selected of friday tab is true, every other tab:  aria-disabled
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-disabled', 'false') // this should be the monday tab
    cy.get('div[role=tab]').eq(0).should('have.attr', 'aria-selected', 'true') // this should be the monday tab
    cy.get('div[role=tab]').eq(1).should('be.not.disabled'); // this should be the tuesday tab
    cy.get('div[role=tab]').eq(2).should('have.attr', 'aria-disabled', 'false') // this should be the wednesday tab
    cy.get('div[role=tab]').eq(3).should('have.attr', 'aria-disabled', 'false') // this should be the thursday tab
    cy.get('div[role=tab]').eq(4).should('have.attr', 'aria-disabled', 'false') // this should be the friday tab

  })

*/

it('calendar week switch selected tab', () => {
  let fakeTodayAsThursday = new Date(2023, 2, 2); // this is a  thrusday
    console.log('realToDate: ', fakeTodayAsThursday)
    cy.clock(fakeTodayAsThursday);

    cy.visit('http://localhost:4200/admin/dish-management')
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


  /*
  it('can add new todo items', () => {
    // We'll store our item text in a variable so we can reuse it
    const newItem = 'Feed the cat'

    // Let's get the input element and use the `type` command to
    // input our new list item. After typing the content of our item,
    // we need to type the enter key as well in order to submit the input.
    // This input has a data-test attribute so we'll use that to select the
    // element in accordance with best practices:
    // https://on.cypress.io/selecting-elements
    cy.get('[data-test=new-todo]').type(`${newItem}{enter}`)

    // Now that we've typed our new item, let's check that it actually was added to the list.
    // Since it's the newest item, it should exist as the last element in the list.
    // In addition, with the two default items, we should have a total of 3 elements in the list.
    // Since assertions yield the element that was asserted on,
    // we can chain both of these assertions together into a single statement.
    cy.get('.todo-list li')
      .should('have.length', 3)
      .last()
      .should('have.text', newItem)
  })

  it('can check off an item as completed', () => {
    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.
    cy.contains('Pay electric bill')
      .parent()
      .find('input[type=checkbox]')
      .check()

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    cy.contains('Pay electric bill')
      .parents('li')
      .should('have.class', 'completed')
  })

  context('with a checked task', () => {
    beforeEach(() => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      cy.contains('Pay electric bill')
        .parent()
        .find('input[type=checkbox]')
        .check()
    })

    it('can filter for uncompleted tasks', () => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      cy.contains('Active').click()

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Walk the dog')

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      cy.contains('Pay electric bill').should('not.exist')
    })

    it('can filter for completed tasks', () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.contains('Completed').click()

      cy.get('.todo-list li')
        .should('have.length', 1)
        .first()
        .should('have.text', 'Pay electric bill')

      cy.contains('Walk the dog').should('not.exist')
    })

    it('can delete all completed tasks', () => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      cy.contains('Clear completed').click()

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      cy.get('.todo-list li')
        .should('have.length', 1)
        .should('not.have.text', 'Pay electric bill')

      // Finally, make sure that the clear button no longer exists.
      cy.contains('Clear completed').should('not.exist')
    })
  }) */
})
