/// <reference types="cypress" />
import * as testOrderData from '../fixtures/order.json';
import * as tokens from '../fixtures/tokens.json';

describe('интеграционные тесты для страницы конструктора бургера', () => {
  // перехват запроса на получение списка ингредиентов
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  });

  describe('добавление ингредиентов из списка в конструктор', function () {
    it('добавление булок', function () {
      // проверка отсутствия булок перед добавлением
      cy.get(`[data-cy="bun-top"]`).should('not.exist');
      cy.get(`[data-cy="bun-bottom"]`).should('not.exist');

      // добавляем булку в конструктор
      cy.get('[data-cy="bun"] .common_button')
        .first()
        .click()
        // проверяем наличие верхней и нижней булки в конструктор
        .then(() => {
          cy.get(`[data-cy='bun-top']`)
            .contains('Краторная булка N-200i')
            .should('exist');
          cy.get(`[data-cy='bun-bottom']`)
            .contains('Краторная булка N-200i')
            .should('exist');
        });
    });
  });

  describe('тестирование работы модальных окон ингредиентов', () => {
    describe('проверка открытия модальных окон', () => {
      it('открытие модальных окон кликом по карточке ингредиента', () => {
        cy.get('[data-cy="bun"]').first().click();
        cy.reload(true);
        cy.get('#modals').children().should('have.length', 2);
      });
    });

    describe('проверка закрытия модальных окон', () => {
      it('закрытие модальных окон по нажатию на кнопку крестик', () => {
        cy.get('[data-cy="bun"]').first().click();
        cy.get('#modals button:first-of-type').click();
        cy.get('modal').should('not.exist');
      });

      it('закрытие модальных окон по клику на оверлей', () => {
        cy.get('[data-cy="bun"]').first().click();
        cy.get('#modals>div:nth-of-type(2)').click({ force: true });
        cy.get('modal').should('not.exist');
      });

      it('закрытие модальных окон по нажатию клавиши Escape', () => {
        cy.get('[data-cy="bun"]').first().click();
        cy.get('body').type('{esc}');
        cy.get('modal').should('not.exist');
      });
    });
  });

  describe('тестирование создания заказа', () => {
    beforeEach(() => {
      // подстановка фейковых токенов авторизации
      cy.setCookie('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);

      // перехват запросов проверки авторизации, отправки заказа и получения списка ингредиентов
      cy.intercept('GET', 'api/auth/user', { fixture: 'user' });
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients' });
      cy.visit('http://localhost:4000');
    });

    // очистка токенов
    afterEach(() => {
      cy.clearAllCookies();
      localStorage.removeItem('refreshToken');
    });

    it('проверка создания закакза (пользователь авторизован)', () => {
      // добавление ингредиентов
      cy.get(`[data-cy="bun"] > .common_button`).first().click();
      cy.get(`[data-cy="sauce"] > .common_button`).first().click();
      cy.get(`[data-cy="main"] > .common_button`).first().click();

      // нажатие кнопки оформления заказа
      cy.get('[data-cy=order-button]').click();

      // проверка открытия модального окна после оформления заказа
      cy.get('#modals').children().should('have.length', 2);
      cy.get('#modals h2:first-of-type').should('be.visible');

      // проверка открытия модального окна и номера заказа
      cy.get('#modals h2:first-of-type').should(
        'have.text',
        testOrderData.order.number
      );
      // проверка закрытия модального окна
      cy.get('#modals button:first-of-type').click();
      cy.get('modal').should('not.exist');

      // проверка очистки конструктора после оформления заказа
      cy.get(`[data-cy="bun-top"]`).should('not.exist');
      cy.get(`[data-cy="main-ingredient"]`).should('not.exist');
      cy.get(`[data-cy="bun-bottom"]`).should('not.exist');
    });
  });
});
